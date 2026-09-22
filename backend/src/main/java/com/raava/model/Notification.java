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

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    private String id;

    @DBRef(lazy = true)
    private User user;

    private String title;
    private String message;
    private Type type = Type.SYSTEM;
    private String channel = "MOCK_FCM";
    private Map<String, Object> metadata;
    private Instant readAt;

    @Indexed
    private Instant createdAt;

    @Indexed
    private Instant updatedAt;

    public enum Type { ASSIGNMENT, VERIFICATION, SYSTEM, ALERT }
}
