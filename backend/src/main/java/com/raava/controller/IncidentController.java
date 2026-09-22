package com.raava.controller;

import com.raava.dto.RaavaDtos;
import com.raava.exception.ApiException;
import com.raava.model.Incident;
import com.raava.model.User;
import com.raava.repository.IncidentRepository;
import com.raava.repository.UserRepository;
import com.raava.repository.AuditRecordRepository;
import com.raava.model.AuditRecord;
import com.raava.model.Evidence;
import com.raava.repository.EvidenceRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final EvidenceRepository evidenceRepository;
    private final AuditRecordRepository auditRecordRepository;

    public IncidentController(IncidentRepository incidentRepository, UserRepository userRepository,
                             EvidenceRepository evidenceRepository, AuditRecordRepository auditRecordRepository) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.evidenceRepository = evidenceRepository;
        this.auditRecordRepository = auditRecordRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list() {
        List<Map<String, Object>> incidents = incidentRepository.findAll().stream().map(this::toSummary).toList();
        return ResponseEntity.ok(Map.of("success", true, "incidents", incidents));
    }

    @GetMapping("/{incidentId}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ApiException(404, "Incident not found."));
        return ResponseEntity.ok(Map.of("success", true, "incident", toSummary(incident)));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody RaavaDtos.CreateIncidentRequest request) {
        String userId = SecurityContextHolder.getContext().getAuthentication() == null
                ? null
                : (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (userId == null) {
            throw new ApiException(401, "Authentication required.");
        }

        User reporter = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(401, "User not found."));

        if (request.evidence() == null || request.evidence().isEmpty()) {
            throw new ApiException(422, "At least one evidence file is required.");
        }

        Incident incident = Incident.builder()
                .reporter(reporter)
                .incidentType(request.incidentType())
                .title(request.title())
                .description(request.description())
                .location(new Incident.GeoLocation("Point", new double[]{request.location().longitude(), request.location().latitude()}, request.location().address()))
                .severity("Low".equalsIgnoreCase(request.severity()) ? Incident.Severity.Low : "High".equalsIgnoreCase(request.severity()) ? Incident.Severity.High : Incident.Severity.Medium)
                .requiredSkills(request.requiredSkills() == null ? new ArrayList<>() : request.requiredSkills())
                .status(Incident.Status.EVIDENCE_VALIDATED)
                .verificationStatus(Incident.VerificationStatus.UNVERIFIED)
                .reportedAt(Instant.now())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Incident savedIncident = incidentRepository.save(incident);

        List<Evidence> evidenceDocs = new ArrayList<>();
        for (RaavaDtos.EvidenceUpload evidenceUpload : request.evidence()) {
            Evidence evidence = Evidence.builder()
                    .incident(savedIncident)
                    .uploadedBy(reporter)
                    .fileName(evidenceUpload.fileName())
                    .filePath(evidenceUpload.filePath())
                    .mimeType(evidenceUpload.mimeType())
                    .fileSize(evidenceUpload.fileSize())
                    .validationStatus(Evidence.ValidationStatus.PENDING)
                    .metadata("{\"source\":\"upload\"}")
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            evidenceDocs.add(evidenceRepository.save(evidence));
        }

        savedIncident.setEvidence(evidenceDocs);
        incidentRepository.save(savedIncident);

        auditRecordRepository.save(AuditRecord.builder()
                .actor(reporter)
                .actorRole(reporter.getRole().name())
                .action("incident_creation")
                .entityType("Incident")
                .entityId(savedIncident.getId())
                .metadata(Map.of("title", savedIncident.getTitle(), "evidenceCount", evidenceDocs.size()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("incident", toSummary(savedIncident));
        body.put("evidence", evidenceDocs.stream().map(this::toEvidenceSummary).toList());
        return ResponseEntity.status(201).body(body);
    }

    private Map<String, Object> toSummary(Incident incident) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", incident.getId());
        summary.put("title", incident.getTitle());
        summary.put("description", incident.getDescription());
        summary.put("type", incident.getIncidentType());
        summary.put("severity", incident.getSeverity() == null ? null : incident.getSeverity().name());
        summary.put("status", incident.getStatus() == null ? null : incident.getStatus().name());
        summary.put("verificationStatus", incident.getVerificationStatus() == null ? null : incident.getVerificationStatus().name());
        summary.put("location", Map.of(
                "latitude", incident.getLocation() == null || incident.getLocation().getCoordinates() == null || incident.getLocation().getCoordinates().length < 2 ? null : incident.getLocation().getCoordinates()[1],
                "longitude", incident.getLocation() == null || incident.getLocation().getCoordinates() == null || incident.getLocation().getCoordinates().length < 2 ? null : incident.getLocation().getCoordinates()[0],
                "address", incident.getLocation() == null ? null : incident.getLocation().getAddress()
        ));
        summary.put("createdAt", incident.getCreatedAt());
        return summary;
    }

    private Map<String, Object> toEvidenceSummary(Evidence evidence) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", evidence.getId());
        summary.put("fileName", evidence.getFileName());
        summary.put("mimeType", evidence.getMimeType());
        summary.put("validationStatus", evidence.getValidationStatus().name());
        return summary;
    }
}
