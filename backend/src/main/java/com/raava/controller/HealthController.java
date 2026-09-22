package com.raava.controller;

import com.raava.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {
    private final UserRepository userRepository;
    private final String appName;

    public HealthController(UserRepository userRepository, @Value("${spring.application.name}") String appName) {
        this.userRepository = userRepository;
        this.appName = appName;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        boolean dbAvailable = true;
        try {
            userRepository.count();
        } catch (Exception e) {
            dbAvailable = false;
        }

        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "application", appName,
                "database", dbAvailable ? "connected" : "disconnected"
        ));
    }

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
                "name", "RAAVA Intelligent Disaster Response Framework",
                "version", "1.0.0",
                "status", "ready"
        ));
    }
}
