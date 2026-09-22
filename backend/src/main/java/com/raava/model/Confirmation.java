package com.raava.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "confirmations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Confirmation {
    @Id
    private String id;

    @DBRef(lazy = true)
    private Incident incident;

    @DBRef(lazy = true)
    private User confirmingUser;

    private String sourceType;
    private String response;
    private String comment;

    private GeoLocation locationAtConfirmation;

    @Indexed
    private Instant createdAt;

    @Indexed
    private Instant updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GeoLocation {
        private String type = "Point";
        private double[] coordinates;
    }
}
