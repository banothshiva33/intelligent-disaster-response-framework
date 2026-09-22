package com.raava.controller;

import com.raava.dto.RaavaDtos;
import com.raava.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {
    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirm(@RequestBody RaavaDtos.ConfirmationRequest request) {
        return ResponseEntity.status(201).body(verificationService.addConfirmation(request));
    }

    @PostMapping("/{incidentId}/request-review")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> requestReview(@PathVariable String incidentId, @RequestBody RaavaDtos.ReviewRequest request) {
        return ResponseEntity.ok(verificationService.requestCoordinatorReview(incidentId, request));
    }

    @PostMapping("/{incidentId}/decision")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> decide(@PathVariable String incidentId, @RequestBody RaavaDtos.CoordinatorDecisionRequest request) {
        return ResponseEntity.ok(verificationService.decideVerification(incidentId, request));
    }
}
