package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "services")
public class ServiceItem {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String description;

    @Column(length = 100)
    private String icon;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ServiceItem() {}

    public static ServiceItem create(UUID id, ServiceRequest request) {
        ServiceItem item = new ServiceItem();
        item.id = id;
        item.createdAt = Instant.now();
        item.update(request);
        return item;
    }

    public void update(ServiceRequest request) {
        this.title = request.title().trim();
        this.description = request.description().trim();
        this.icon = request.icon();
        this.displayOrder = request.displayOrder();
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getIcon() { return icon; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}