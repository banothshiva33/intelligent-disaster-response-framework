package com.raava.service;

import com.raava.dto.AuthDtos;
import com.raava.exception.ApiException;
import com.raava.model.AuditRecord;
import com.raava.model.User;
import com.raava.repository.AuditRecordRepository;
import com.raava.repository.UserRepository;
import com.raava.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditRecordRepository auditRecordRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuditRecordRepository auditRecordRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditRecordRepository = auditRecordRepository;
    }

    public Map<String, Object> register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email().trim().toLowerCase())) {
            throw new ApiException(409, "Email already registered.");
        }

        User user = User.builder()
                .name(request.name().trim())
                .email(request.email().trim().toLowerCase())
                .phone(request.phone())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(User.Role.CITIZEN)
                .isActive(true)
                .isFlagged(false)
                .trustScore(0)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        User saved = userRepository.save(user);

        auditRecordRepository.save(AuditRecord.builder()
                .actor(saved)
                .actorRole(saved.getRole().name())
                .action("registration")
                .entityType("User")
                .entityId(saved.getId())
                .metadata(Map.of("email", saved.getEmail()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        Map<String, Object> body = new HashMap<>();
        body.put("user", buildUserSummary(saved));
        body.put("token", jwtService.generateToken(saved));
        return body;
    }

    public Map<String, Object> login(AuthDtos.LoginRequest request) {
        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new ApiException(401, "Invalid credentials."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ApiException(401, "Invalid credentials.");
        }
        if (!user.isActive()) {
            throw new ApiException(403, "Account is inactive.");
        }

        auditRecordRepository.save(AuditRecord.builder()
                .actor(user)
                .actorRole(user.getRole().name())
                .action("login")
                .entityType("User")
                .entityId(user.getId())
                .metadata(Map.of("email", user.getEmail()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        Map<String, Object> body = new HashMap<>();
        body.put("user", buildUserSummary(user));
        body.put("token", jwtService.generateToken(user));
        return body;
    }

    public Map<String, Object> currentUser(String authorizationHeader) {
        User user = resolveUser(authorizationHeader);
        Map<String, Object> body = new HashMap<>();
        body.put("user", buildUserSummary(user));
        return body;
    }

    public Map<String, Object> updateProfile(String authorizationHeader, AuthDtos.UpdateProfileRequest request) {
        User user = resolveUser(authorizationHeader);
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone().trim().isEmpty() ? null : request.phone().trim());
        }
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        Map<String, Object> body = new HashMap<>();
        body.put("user", buildUserSummary(user));
        return body;
    }

    private User resolveUser(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ApiException(401, "Authentication required.");
        }
        String token = authorizationHeader.substring(7);
        String userId;
        try {
            userId = jwtService.validateToken(token).getSubject();
        } catch (IllegalArgumentException ex) {
            throw new ApiException(401, "Invalid or expired token.");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(401, "User not found."));
    }

    private Map<String, Object> buildUserSummary(User user) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", user.getId());
        summary.put("name", user.getName());
        summary.put("email", user.getEmail());
        summary.put("phone", user.getPhone());
        summary.put("role", user.getRole().name());
        summary.put("trustScore", user.getTrustScore());
        summary.put("isFlagged", user.isFlagged());
        summary.put("isActive", user.isActive());
        summary.put("location", user.getLocation() == null ? null : user.getLocation());
        return summary;
    }
}
