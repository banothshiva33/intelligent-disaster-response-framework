package com.raava.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "volunteers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Volunteer {
    @Id
    private String id;

    @DBRef(lazy = true)
    private User user;

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2D)
    private double[] location;

    private Availability availability = Availability.AVAILABLE;

    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @DBRef(lazy = true)
    private Assignment currentAssignment;

    private int experience;

    @Indexed
    private Instant createdAt;

    @Indexed
    private Instant updatedAt;

    public enum Availability { AVAILABLE, BUSY, OFFLINE }
    public enum VerificationStatus { PENDING, VERIFIED, REJECTED }
}
