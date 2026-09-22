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
import java.util.Map;

@Document(collection = "audit_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditRecord {
    @Id
    private String id;

    @DBRef(lazy = true)
    private User actor;

    private String actorRole;
    private String action;
    private String entityType;
    private String entityId;
    private Map<String, Object> metadata;

    @Indexed
    private Instant createdAt;

    @Indexed
    private Instant updatedAt;
}
