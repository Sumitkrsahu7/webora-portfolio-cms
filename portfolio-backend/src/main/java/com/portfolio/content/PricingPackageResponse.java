package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record PricingPackageResponse(
    UUID id,
    String name,
    String slug,
    String categoryLabel,
    String priceLabel,
    String billingNote,
    String idealFor,
    String featuresJson,
    String excludedNote,
    String supportPeriodLabel,
    boolean highlighted,
    String ctaLabel,
    int displayOrder,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static PricingPackageResponse from(PricingPackage pkg) {
        return new PricingPackageResponse(
            pkg.getId(),
            pkg.getName(),
            pkg.getSlug(),
            pkg.getCategoryLabel(),
            pkg.getPriceLabel(),
            pkg.getBillingNote(),
            pkg.getIdealFor(),
            pkg.getFeaturesJson(),
            pkg.getExcludedNote(),
            pkg.getSupportPeriodLabel(),
            pkg.isHighlighted(),
            pkg.getCtaLabel(),
            pkg.getDisplayOrder(),
            pkg.isPublished(),
            pkg.getCreatedAt(),
            pkg.getUpdatedAt()
        );
    }
}
