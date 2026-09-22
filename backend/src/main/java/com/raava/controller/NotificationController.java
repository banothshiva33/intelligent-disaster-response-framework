package com.raava.controller;

import com.raava.exception.ApiException;
import com.raava.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> list() {
        String userId = currentUserId();
        return ResponseEntity.ok(notificationService.listForCurrentUser(userId));
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Map<String, Object>> markRead(@PathVariable String notificationId) {
        String userId = currentUserId();
        return ResponseEntity.ok(notificationService.markAsRead(userId, notificationId));
    }

    private String currentUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() != null ? SecurityContextHolder.getContext().getAuthentication().getPrincipal() : null;
        if (principal == null) throw new ApiException(401, "Authentication required.");
        return principal.toString();
    }
}
