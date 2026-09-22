package com.raava.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {
    @Id
    private String id;

    @DBRef(lazy = true)
    private User reporter;

    private String incidentType;
    private String title;
    private String description;

    private GeoLocation location;

    private Severity severity = Severity.Medium;
    private String priority;

    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();

    @DBRef(lazy = true)
    @Builder.Default
    private List<Evidence> evidence = new ArrayList<>();

    private Status status = Status.PENDING_EVIDENCE;
    private VerificationStatus verificationStatus = VerificationStatus.UNVERIFIED;
    private VerificationMethod verificationMethod = VerificationMethod.CONFIRMATION;

    private Instant reportedAt;
    private Instant verifiedAt;
    private Instant resolvedAt;

    @Indexed
    private Instant createdAt;

    @Indexed
    private Instant updatedAt;

    public enum Severity { Low, Medium, High }
    public enum Status { PENDING_EVIDENCE, EVIDENCE_VALIDATED, AWAITING_CONFIRMATION, COORDINATOR_REVIEW, VERIFIED, FALSE_REPORT, ALLOCATING, ASSIGNMENT_PENDING, IN_PROGRESS, RESOLVED, CANCELLED }
    public enum VerificationStatus { UNVERIFIED, VERIFIED, FALSE_REPORT, PENDING_REVIEW }
    public enum VerificationMethod { CONFIRMATION, COORDINATOR_REVIEW, MANUAL }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GeoLocation {
        private String type = "Point";
        private double[] coordinates;
        private String address;
    }
}
