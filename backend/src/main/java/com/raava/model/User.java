package com.raava.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String phone;

    @JsonIgnore
    private String passwordHash;

    private Role role;

    private boolean isActive = true;
    private boolean isFlagged = false;
    private double trustScore = 0.0;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2D)
    private double[] location;

    @Field("createdAt")
    private Instant createdAt;

    @Field("updatedAt")
    private Instant updatedAt;

    public enum Role {
        CITIZEN,
        VOLUNTEER,
        COORDINATOR,
        ADMIN
    }
}
