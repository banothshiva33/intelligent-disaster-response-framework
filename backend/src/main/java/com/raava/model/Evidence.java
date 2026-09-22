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

@Document(collection = "evidence")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evidence {
    @Id
    private String id;

    @DBRef(lazy = true)
    private Incident incident;

    @DBRef(lazy = true)
    private User uploadedBy;

    private String fileName;
    private String filePath;
    private String mimeType;
    private long fileSize;

    private ValidationStatus validationStatus = ValidationStatus.PENDING;
    private String metadata;

    @Indexed
    private Instant createdAt;

    @Indexed
    private Instant updatedAt;

    public enum ValidationStatus { PENDING, VALIDATED, REJECTED }
}
