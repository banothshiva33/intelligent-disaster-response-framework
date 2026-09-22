package com.raava.dto;

import java.util.List;
import java.util.Map;

public class RaavaDtos {
    public record CreateIncidentRequest(
            String title,
            String description,
            String incidentType,
            String severity,
            List<String> requiredSkills,
            LocationRequest location,
            List<EvidenceUpload> evidence
    ) {}

    public record LocationRequest(double latitude, double longitude, String address) {}
    public record EvidenceUpload(String fileName, String filePath, String mimeType, long fileSize) {}
    public record ConfirmationRequest(String incidentId, String sourceType, String response, String comment, LocationRequest location) {}
    public record ReviewRequest(String notes, Boolean verificationCallRequested, String callStatus) {}
    public record CoordinatorDecisionRequest(String decision, String notes, Boolean verificationCallRequested, String callStatus) {}
    public record VolunteerProfileRequest(List<String> skills, String availability, Integer experience, LocationRequest location) {}
    public record VolunteerVerificationRequest(String verificationStatus) {}
    public record AssignmentCreateRequest(String incidentId, String volunteerId, String message) {}
    public record AssignmentResponseRequest(String status, String message) {}
    public record PredictionRequest(String disasterType, String location, Double affectedPopulation, Double deaths, Double injured, Double economicDamage) {}
    public record PredictionResponse(String prediction, Map<String, Object> probabilities, double confidence) {}
}
