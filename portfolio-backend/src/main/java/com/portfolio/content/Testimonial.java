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

    @Column(columnDefinition = "nvarchar(max)")
    private String content;

    @Column(name = "avatar_url", columnDefinition = "nvarchar(max)")
    private String avatarUrl;

    @Column(name = "media_type", nullable = false, length = 20)
    private String mediaType = "WRITTEN";

    @Column(name = "video_url", length = 2048)
    private String videoUrl;

    @Column(name = "thumbnail_url", columnDefinition = "nvarchar(max)")
    private String thumbnailUrl;

    @Column(name = "project_title", length = 160)
    private String projectTitle;

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
        this.name = request.name().trim();
        this.role = request.role();
        this.company = request.company();
        this.content = request.content() != null ? request.content().trim() : null;
        this.avatarUrl = request.avatarUrl();
        this.mediaType = request.resolvedMediaType();
        this.videoUrl = request.videoUrl() != null ? request.videoUrl().trim() : null;
        this.thumbnailUrl = request.thumbnailUrl() != null ? request.thumbnailUrl().trim() : null;
        this.projectTitle = request.projectTitle() != null ? request.projectTitle().trim() : null;
        this.displayOrder = request.displayOrder();
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getCompany() { return company; }
    public String getContent() { return content; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getMediaType() { return mediaType; }
    public String getVideoUrl() { return videoUrl; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public String getProjectTitle() { return projectTitle; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
