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

@Document(collection = "verification_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRecord {
    @Id
    private String id;

    @DBRef(lazy = true)
    private Incident incident;

    private String sourceType;

    @DBRef(lazy = true)
    private User confirmingUser;

    @DBRef(lazy = true)
    private User coordinator;

    private String decision;
    private String notes;

    private boolean verificationCallRequested;
    private String callStatus;

    @Indexed
    private Instant createdAt;

    @Indexed
    private Instant updatedAt;
}
