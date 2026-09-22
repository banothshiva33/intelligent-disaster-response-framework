package com.raava.service;

import com.raava.dto.RaavaDtos;
import com.raava.exception.ApiException;
import com.raava.model.*;
import com.raava.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class VerificationService {
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final ConfirmationRepository confirmationRepository;
    private final VerificationRecordRepository verificationRecordRepository;
    private final AuditRecordRepository auditRecordRepository;
    private final NotificationService notificationService;

    public VerificationService(IncidentRepository incidentRepository, UserRepository userRepository,
                               ConfirmationRepository confirmationRepository, VerificationRecordRepository verificationRecordRepository,
                               AuditRecordRepository auditRecordRepository, NotificationService notificationService) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.confirmationRepository = confirmationRepository;
        this.verificationRecordRepository = verificationRecordRepository;
        this.auditRecordRepository = auditRecordRepository;
        this.notificationService = notificationService;
    }

    public Map<String, Object> addConfirmation(RaavaDtos.ConfirmationRequest request) {
        String userId = principalUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(401, "User not found."));
        Incident incident = incidentRepository.findById(request.incidentId()).orElseThrow(() -> new ApiException(404, "Incident not found."));

        if (incident.getReporter() != null && incident.getReporter().getId().equals(userId)) {
            throw new ApiException(403, "Reporter cannot confirm their own incident.");
        }

        if (confirmationRepository.findByIncidentIdAndConfirmingUserId(request.incidentId(), userId).isPresent()) {
            throw new ApiException(409, "Duplicate confirmation.");
        }

        Confirmation confirmation = Confirmation.builder()
                .incident(incident)
                .confirmingUser(user)
                .sourceType(request.sourceType())
                .response(request.response())
                .comment(request.comment())
                .locationAtConfirmation(request.location() == null ? null : Confirmation.GeoLocation.builder()
                        .type("Point")
                        .coordinates(new double[]{request.location().longitude(), request.location().latitude()})
                        .build())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        confirmationRepository.save(confirmation);

        boolean positive = "CONFIRMED".equalsIgnoreCase(request.response());
        if (positive) {
            incident.setVerificationStatus(Incident.VerificationStatus.VERIFIED);
            incident.setStatus(Incident.Status.VERIFIED);
            incident.setVerifiedAt(Instant.now());
            incident.setVerificationMethod(Incident.VerificationMethod.CONFIRMATION);
            incidentRepository.save(incident);
        }

        verificationRecordRepository.save(VerificationRecord.builder()
                .incident(incident)
                .sourceType(request.sourceType())
                .confirmingUser(user)
                .decision(positive ? "VERIFIED" : "PENDING")
                .notes(request.comment() == null ? "Confirmation submitted." : request.comment())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        auditRecordRepository.save(AuditRecord.builder()
                .actor(user)
                .actorRole(user.getRole().name())
                .action("confirmation")
                .entityType("Confirmation")
                .entityId(confirmation.getId())
                .metadata(Map.of("incidentId", incident.getId(), "response", request.response()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("incident", Map.of("id", incident.getId(), "status", incident.getStatus().name(), "verificationStatus", incident.getVerificationStatus().name()));
        body.put("confirmation", Map.of("id", confirmation.getId(), "incidentId", incident.getId(), "response", request.response()));
        return body;
    }

    public Map<String, Object> requestCoordinatorReview(String incidentId, RaavaDtos.ReviewRequest request) {
        String userId = principalUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(401, "User not found."));
        Incident incident = incidentRepository.findById(incidentId).orElseThrow(() -> new ApiException(404, "Incident not found."));

        incident.setStatus(Incident.Status.COORDINATOR_REVIEW);
        incident.setVerificationStatus(Incident.VerificationStatus.PENDING_REVIEW);
        incident.setVerificationMethod(Incident.VerificationMethod.COORDINATOR_REVIEW);
        incidentRepository.save(incident);

        VerificationRecord record = verificationRecordRepository.save(VerificationRecord.builder()
                .incident(incident)
                .sourceType("COORDINATOR")
                .coordinator(user)
                .decision("PENDING")
                .notes(request.notes() == null ? "Coordinator review requested." : request.notes())
                .verificationCallRequested(Boolean.TRUE.equals(request.verificationCallRequested()))
                .callStatus(request.callStatus() == null ? "MANUAL" : request.callStatus())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        notificationService.sendNotification(incident.getReporter().getId(), "Incident review requested", "Your incident has been escalated to coordinator review for verification.", "VERIFICATION");

        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("incident", Map.of("id", incident.getId(), "status", incident.getStatus().name(), "verificationStatus", incident.getVerificationStatus().name()));
        body.put("review", Map.of("id", record.getId(), "callStatus", record.getCallStatus(), "verificationCallRequested", record.isVerificationCallRequested()));
        return body;
    }

    public Map<String, Object> decideVerification(String incidentId, RaavaDtos.CoordinatorDecisionRequest request) {
        String userId = principalUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(401, "User not found."));
        Incident incident = incidentRepository.findById(incidentId).orElseThrow(() -> new ApiException(404, "Incident not found."));

        String decision = request.decision();
        if (!"VERIFIED".equalsIgnoreCase(decision) && !"FALSE_REPORT".equalsIgnoreCase(decision)) {
            throw new ApiException(422, "Use VERIFIED or FALSE_REPORT.");
        }

        boolean verified = "VERIFIED".equalsIgnoreCase(decision);
        incident.setStatus(verified ? Incident.Status.VERIFIED : Incident.Status.FALSE_REPORT);
        incident.setVerificationStatus(verified ? Incident.VerificationStatus.VERIFIED : Incident.VerificationStatus.FALSE_REPORT);
        incident.setVerificationMethod(Incident.VerificationMethod.COORDINATOR_REVIEW);
        if (verified) incident.setVerifiedAt(Instant.now());
        incidentRepository.save(incident);

        VerificationRecord record = verificationRecordRepository.save(VerificationRecord.builder()
                .incident(incident)
                .sourceType("COORDINATOR")
                .coordinator(user)
                .decision(verified ? "VERIFIED" : "FALSE_REPORT")
                .notes(request.notes() == null ? "Coordinator decision recorded." : request.notes())
                .verificationCallRequested(Boolean.TRUE.equals(request.verificationCallRequested()))
                .callStatus(request.callStatus() == null ? "MANUAL" : request.callStatus())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        auditRecordRepository.save(AuditRecord.builder()
                .actor(user)
                .actorRole(user.getRole().name())
                .action(verified ? "verification_decision" : "false_report_decision")
                .entityType("Incident")
                .entityId(incident.getId())
                .metadata(Map.of("decision", verified ? "VERIFIED" : "FALSE_REPORT", "notes", request.notes()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("incident", Map.of("id", incident.getId(), "status", incident.getStatus().name(), "verificationStatus", incident.getVerificationStatus().name()));
        body.put("verification", Map.of("id", record.getId(), "decision", verified ? "VERIFIED" : "FALSE_REPORT", "notes", request.notes()));
        return body;
    }

    private String principalUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() != null ? SecurityContextHolder.getContext().getAuthentication().getPrincipal() : null;
        if (principal == null) throw new ApiException(401, "Authentication required.");
        return principal.toString();
    }
}
