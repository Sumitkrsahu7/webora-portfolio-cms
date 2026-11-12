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

    @Column(length = 160, unique = true)
    private String slug;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String description;

    @Column(name = "target_audience", length = 500)
    private String targetAudience;

    @Column(name = "key_features_json", columnDefinition = "nvarchar(max)")
    private String keyFeaturesJson;

    @Column(name = "deliverables_json", columnDefinition = "nvarchar(max)")
    private String deliverablesJson;

    @Column(name = "starting_price_label", length = 120)
    private String startingPriceLabel;

    @Column(name = "delivery_timeline", length = 120)
    private String deliveryTimeline;

    @Column(name = "cta_label", length = 80)
    private String ctaLabel;

    @Column(name = "overview_details", columnDefinition = "nvarchar(max)")
    private String overviewDetails;

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

    public static ServiceItem create(UUID id, ServiceRequest request, String resolvedSlug) {
        ServiceItem item = new ServiceItem();
        item.id = id;
        item.createdAt = Instant.now();
        item.update(request, resolvedSlug);
        return item;
    }

    public void update(ServiceRequest request, String resolvedSlug) {
        this.title = request.title().trim();
        this.slug = resolvedSlug;
        this.shortDescription = request.shortDescription() != null ? request.shortDescription().trim() : null;
        this.description = request.description().trim();
        this.targetAudience = request.targetAudience() != null ? request.targetAudience().trim() : null;
        this.keyFeaturesJson = request.keyFeaturesJson();
        this.deliverablesJson = request.deliverablesJson();
        this.startingPriceLabel = request.startingPriceLabel() != null ? request.startingPriceLabel().trim() : null;
        this.deliveryTimeline = request.deliveryTimeline() != null ? request.deliveryTimeline().trim() : null;
        this.ctaLabel = request.ctaLabel() != null ? request.ctaLabel().trim() : null;
        this.overviewDetails = request.overviewDetails() != null ? request.overviewDetails().trim() : null;
        this.icon = request.icon();
        this.displayOrder = request.displayOrder();
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public String getSlug() { return slug; }
    public String getShortDescription() { return shortDescription; }
    public String getDescription() { return description; }
    public String getTargetAudience() { return targetAudience; }
    public String getKeyFeaturesJson() { return keyFeaturesJson; }
    public String getDeliverablesJson() { return deliverablesJson; }
    public String getStartingPriceLabel() { return startingPriceLabel; }
    public String getDeliveryTimeline() { return deliveryTimeline; }
    public String getCtaLabel() { return ctaLabel; }
    public String getOverviewDetails() { return overviewDetails; }
    public String getIcon() { return icon; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
