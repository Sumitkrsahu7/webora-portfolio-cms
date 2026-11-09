package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inquiries")
public class Inquiry {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 255)
    private String subject;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String message;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Inquiry() {}

    public static Inquiry create(UUID id, InquiryRequest request) {
        Inquiry inquiry = new Inquiry();
        inquiry.id = id;
        inquiry.name = request.name().trim();
        inquiry.email = request.email().trim();
        inquiry.subject = request.subject();
        inquiry.message = request.message().trim();
        inquiry.status = "NEW";
        inquiry.createdAt = Instant.now();
        inquiry.updatedAt = Instant.now();
        return inquiry;
    }

    public void updateStatus(String status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}