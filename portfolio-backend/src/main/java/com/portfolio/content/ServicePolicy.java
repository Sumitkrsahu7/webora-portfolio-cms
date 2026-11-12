package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "service_policies")
public class ServicePolicy {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(name = "policy_type", nullable = false, length = 60)
    private String policyType;

    @Column(nullable = false, length = 2000)
    private String summary;

    @Column(name = "bullet_points_json", columnDefinition = "nvarchar(max)")
    private String bulletPointsJson;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ServicePolicy() {}

    public static ServicePolicy create(UUID id, ServicePolicyRequest request) {
        ServicePolicy policy = new ServicePolicy();
        policy.id = id;
        policy.createdAt = Instant.now();
        policy.update(request);
        return policy;
    }

    public void update(ServicePolicyRequest request) {
        this.title = request.title().trim();
        this.policyType = request.policyType().trim();
        this.summary = request.summary().trim();
        this.bulletPointsJson = request.bulletPointsJson();
        this.displayOrder = request.displayOrder();
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getPolicyType() { return policyType; }
    public String getSummary() { return summary; }
    public String getBulletPointsJson() { return bulletPointsJson; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
