package com.raava.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {
    public record RegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, max = 128) String password,
            String phone
    ) {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record UpdateProfileRequest(String name, String phone) {}

    public record AuthResponse(
            UserDto user,
            String token
    ) {}

    public record UserDto(
            String id,
            String name,
            String email,
            String phone,
            String role,
            double trustScore,
            boolean isFlagged,
            boolean isActive,
            String location
    ) {}
}
