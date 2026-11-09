package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "testimonials")
public class Testimonial {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 160)
    private String role;

    @Column(length = 160)
    private String company;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String content;

    @Column(name = "avatar_url", columnDefinition = "nvarchar(max)")
    private String avatarUrl;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Testimonial() {}

    public static Testimonial create(UUID id, TestimonialRequest request) {
        Testimonial item = new Testimonial();
        item.id = id;
        item.createdAt = Instant.now();
        item.update(request);
        return item;
    }

    public void update(TestimonialRequest request) {
        name = request.name().trim();
        role = request.role();
        company = request.company();
        content = request.content().trim();
        avatarUrl = request.avatarUrl();
        displayOrder = request.displayOrder();
        published = request.published();
        updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getCompany() { return company; }
    public String getContent() { return content; }
    public String getAvatarUrl() { return avatarUrl; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}