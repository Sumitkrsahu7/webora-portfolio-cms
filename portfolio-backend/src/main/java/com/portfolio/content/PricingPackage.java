package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "pricing_packages")
public class PricingPackage {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 160, unique = true)
    private String slug;

    @Column(name = "category_label", length = 120)
    private String categoryLabel;

    @Column(name = "price_label", nullable = false, length = 120)
    private String priceLabel;

    @Column(name = "billing_note", length = 255)
    private String billingNote;

    @Column(name = "ideal_for", length = 500)
    private String idealFor;

    @Column(name = "features_json", columnDefinition = "nvarchar(max)")
    private String featuresJson;

    @Column(name = "excluded_note", length = 500)
    private String excludedNote;

    @Column(name = "support_period_label", length = 120)
    private String supportPeriodLabel;

    @Column(nullable = false)
    private boolean highlighted;

    @Column(name = "cta_label", length = 80)
    private String ctaLabel;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected PricingPackage() {}

    public static PricingPackage create(UUID id, PricingPackageRequest request, String resolvedSlug) {
        PricingPackage pkg = new PricingPackage();
        pkg.id = id;
        pkg.createdAt = Instant.now();
        pkg.update(request, resolvedSlug);
        return pkg;
    }

    public void update(PricingPackageRequest request, String resolvedSlug) {
        this.name = request.name().trim();
        this.slug = resolvedSlug;
        this.categoryLabel = request.categoryLabel() != null ? request.categoryLabel().trim() : null;
        this.priceLabel = request.priceLabel().trim();
        this.billingNote = request.billingNote() != null ? request.billingNote().trim() : null;
        this.idealFor = request.idealFor() != null ? request.idealFor().trim() : null;
        this.featuresJson = request.featuresJson();
        this.excludedNote = request.excludedNote() != null ? request.excludedNote().trim() : null;
        this.supportPeriodLabel = request.supportPeriodLabel() != null ? request.supportPeriodLabel().trim() : null;
        this.highlighted = request.highlighted();
        this.ctaLabel = request.ctaLabel() != null ? request.ctaLabel().trim() : null;
        this.displayOrder = request.displayOrder();
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public String getCategoryLabel() { return categoryLabel; }
    public String getPriceLabel() { return priceLabel; }
    public String getBillingNote() { return billingNote; }
    public String getIdealFor() { return idealFor; }
    public String getFeaturesJson() { return featuresJson; }
    public String getExcludedNote() { return excludedNote; }
    public String getSupportPeriodLabel() { return supportPeriodLabel; }
    public boolean isHighlighted() { return highlighted; }
    public String getCtaLabel() { return ctaLabel; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
