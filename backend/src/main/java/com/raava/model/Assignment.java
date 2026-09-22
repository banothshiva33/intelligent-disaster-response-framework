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

@Document(collection = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assignment {
    @Id
    private String id;

    @DBRef(lazy = true)
    private Incident incident;

    @DBRef(lazy = true)
    private Volunteer volunteer;

    @DBRef(lazy = true)
    private User assignedBy;

    private Status status = Status.PENDING;
    private String message;

    private Instant createdAt;
    private Instant updatedAt;

    public enum Status { PENDING, ACCEPTED, DECLINED, EN_ROUTE, IN_PROGRESS, COMPLETED, CANCELLED }
}
