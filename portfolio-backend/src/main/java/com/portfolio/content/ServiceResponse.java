package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record ServiceResponse(
    UUID id,
    String title,
    String description,
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
            item.getDescription(),
            item.getIcon(),
            item.getDisplayOrder(),
            item.isPublished(),
            item.getCreatedAt(),
            item.getUpdatedAt()
        );
    }
}