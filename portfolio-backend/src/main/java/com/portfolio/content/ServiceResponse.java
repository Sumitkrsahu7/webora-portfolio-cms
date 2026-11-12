package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record ServiceResponse(
    UUID id,
    String title,
    String slug,
    String shortDescription,
    String description,
    String targetAudience,
    String keyFeaturesJson,
    String deliverablesJson,
    String startingPriceLabel,
    String deliveryTimeline,
    String ctaLabel,
    String overviewDetails,
    String icon,
    int displayOrder,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static ServiceResponse from(ServiceItem item) {
        return new ServiceResponse(
            item.getId(),
            item.getTitle(),
            item.getSlug(),
            item.getShortDescription(),
            item.getDescription(),
            item.getTargetAudience(),
            item.getKeyFeaturesJson(),
            item.getDeliverablesJson(),
            item.getStartingPriceLabel(),
            item.getDeliveryTimeline(),
            item.getCtaLabel(),
            item.getOverviewDetails(),
            item.getIcon(),
            item.getDisplayOrder(),
            item.isPublished(),
            item.getCreatedAt(),
            item.getUpdatedAt()
        );
    }
}
