package com.raava.controller;

import com.raava.dto.RaavaDtos;
import com.raava.service.VolunteerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/volunteers")
public class VolunteerController {
    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me() {
        return ResponseEntity.ok(volunteerService.getMyProfile());
    }

    @PatchMapping("/me")
    public ResponseEntity<Map<String, Object>> upsertMyProfile(@Valid @RequestBody RaavaDtos.VolunteerProfileRequest request) {
        return ResponseEntity.ok(volunteerService.upsertMyProfile(request));
    }

    @PatchMapping("/me/availability")
    public ResponseEntity<Map<String, Object>> updateAvailability(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(volunteerService.updateAvailability(body.getOrDefault("availability", "AVAILABLE")));
    }

    @PatchMapping("/me/location")
    public ResponseEntity<Map<String, Object>> updateLocation(@RequestBody RaavaDtos.LocationRequest locationRequest) {
        return ResponseEntity.ok(volunteerService.updateLocation(locationRequest));
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list() {
        return ResponseEntity.ok(volunteerService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        return ResponseEntity.ok(volunteerService.getById(id));
    }

    @PatchMapping("/{id}/verification")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> verify(@PathVariable String id, @RequestBody RaavaDtos.VolunteerVerificationRequest request) {
        return ResponseEntity.ok(volunteerService.verifyVolunteer(id, request.verificationStatus()));
    }
}
