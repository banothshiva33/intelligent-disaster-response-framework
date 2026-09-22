package com.raava.service;

import com.raava.dto.RaavaDtos;
import com.raava.exception.ApiException;
import com.raava.model.AuditRecord;
import com.raava.model.User;
import com.raava.model.Volunteer;
import com.raava.repository.AuditRecordRepository;
import com.raava.repository.UserRepository;
import com.raava.repository.VolunteerRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
public class VolunteerService {
    private final VolunteerRepository volunteerRepository;
    private final UserRepository userRepository;
    private final AuditRecordRepository auditRecordRepository;

    public VolunteerService(VolunteerRepository volunteerRepository, UserRepository userRepository,
                            AuditRecordRepository auditRecordRepository) {
        this.volunteerRepository = volunteerRepository;
        this.userRepository = userRepository;
        this.auditRecordRepository = auditRecordRepository;
    }

    public Map<String, Object> getMyProfile() {
        String userId = currentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(401, "User not found."));
        Volunteer volunteer = volunteerRepository.findByUser(user).orElseThrow(() -> new ApiException(404, "Volunteer profile not found."));
        return Map.of("success", true, "volunteer", toSummary(volunteer));
    }

    public Map<String, Object> upsertMyProfile(RaavaDtos.VolunteerProfileRequest request) {
        String userId = currentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(401, "User not found."));
        Volunteer volunteer = volunteerRepository.findByUser(user).orElse(null);

        if (volunteer == null) {
            volunteer = Volunteer.builder()
                    .user(user)
                    .skills(request.skills() == null ? new ArrayList<>() : request.skills())
                    .availability(request.availability() == null ? Volunteer.Availability.AVAILABLE : Volunteer.Availability.valueOf(request.availability().toUpperCase()))
                    .verificationStatus(Volunteer.VerificationStatus.PENDING)
                    .experience(request.experience() == null ? 0 : request.experience())
                    .location(request.location() == null ? null : new double[]{request.location().longitude(), request.location().latitude()})
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
        } else {
            if (request.skills() != null) volunteer.setSkills(request.skills());
            if (request.availability() != null) volunteer.setAvailability(Volunteer.Availability.valueOf(request.availability().toUpperCase()));
            if (request.experience() != null) volunteer.setExperience(request.experience());
            if (request.location() != null) volunteer.setLocation(new double[]{request.location().longitude(), request.location().latitude()});
            volunteer.setUpdatedAt(Instant.now());
        }

        Volunteer saved = volunteerRepository.save(volunteer);
        auditRecordRepository.save(AuditRecord.builder()
                .actor(user)
                .actorRole(user.getRole().name())
                .action("volunteer_profile_update")
                .entityType("Volunteer")
                .entityId(saved.getId())
                .metadata(Map.of("skills", saved.getSkills(), "availability", saved.getAvailability().name()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        return Map.of("success", true, "volunteer", toSummary(saved));
    }

    public Map<String, Object> updateAvailability(String availability) {
        String userId = currentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(401, "User not found."));
        Volunteer volunteer = volunteerRepository.findByUser(user).orElseThrow(() -> new ApiException(404, "Volunteer profile not found."));
        volunteer.setAvailability(Volunteer.Availability.valueOf(availability.toUpperCase()));
        volunteer.setUpdatedAt(Instant.now());
        volunteerRepository.save(volunteer);
        return Map.of("success", true, "volunteer", Map.of("id", volunteer.getId(), "availability", volunteer.getAvailability().name()));
    }

    public Map<String, Object> updateLocation(RaavaDtos.LocationRequest locationRequest) {
        String userId = currentUserId();
        User user = userRepository.findById(userId).orElseThrow(() -> new ApiException(401, "User not found."));
        Volunteer volunteer = volunteerRepository.findByUser(user).orElseThrow(() -> new ApiException(404, "Volunteer profile not found."));
        volunteer.setLocation(new double[]{locationRequest.longitude(), locationRequest.latitude()});
        volunteer.setUpdatedAt(Instant.now());
        volunteerRepository.save(volunteer);
        return Map.of("success", true, "volunteer", Map.of("id", volunteer.getId(), "location", Map.of("latitude", locationRequest.latitude(), "longitude", locationRequest.longitude())));
    }

    public Map<String, Object> listAll() {
        List<Map<String, Object>> volunteers = volunteerRepository.findAll().stream().map(this::toSummary).toList();
        return Map.of("success", true, "volunteers", volunteers);
    }

    public Map<String, Object> getById(String id) {
        Volunteer volunteer = volunteerRepository.findById(id).orElseThrow(() -> new ApiException(404, "Volunteer not found."));
        return Map.of("success", true, "volunteer", toSummary(volunteer));
    }

    public Map<String, Object> verifyVolunteer(String id, String status) {
        Volunteer volunteer = volunteerRepository.findById(id).orElseThrow(() -> new ApiException(404, "Volunteer not found."));
        volunteer.setVerificationStatus(Volunteer.VerificationStatus.valueOf(status.toUpperCase()));
        volunteer.setUpdatedAt(Instant.now());
        volunteerRepository.save(volunteer);
        return Map.of("success", true, "volunteer", Map.of("id", volunteer.getId(), "verificationStatus", volunteer.getVerificationStatus().name()));
    }

    private String currentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() != null ? SecurityContextHolder.getContext().getAuthentication().getPrincipal() : null;
        if (principal == null) throw new ApiException(401, "Authentication required.");
        return principal.toString();
    }

    private Map<String, Object> toSummary(Volunteer volunteer) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", volunteer.getId());
        summary.put("userId", volunteer.getUser() == null ? null : volunteer.getUser().getId());
        summary.put("name", volunteer.getUser() == null ? null : volunteer.getUser().getName());
        summary.put("skills", volunteer.getSkills());
        summary.put("availability", volunteer.getAvailability() == null ? null : volunteer.getAvailability().name());
        summary.put("verificationStatus", volunteer.getVerificationStatus() == null ? null : volunteer.getVerificationStatus().name());
        summary.put("experience", volunteer.getExperience());
        if (volunteer.getLocation() != null && volunteer.getLocation().length >= 2) {
            summary.put("location", Map.of("latitude", volunteer.getLocation()[1], "longitude", volunteer.getLocation()[0]));
        } else {
            summary.put("location", null);
        }
        return summary;
    }
}
