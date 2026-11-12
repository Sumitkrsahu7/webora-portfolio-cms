package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record FaqResponse(
    UUID id,
    String question,
    String answer,
    String category,
    int displayOrder,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static FaqResponse from(Faq faq) {
        return new FaqResponse(
            faq.getId(),
            faq.getQuestion(),
            faq.getAnswer(),
            faq.getCategory(),
            faq.getDisplayOrder(),
            faq.isPublished(),
            faq.getCreatedAt(),
            faq.getUpdatedAt()
        );
    }
}
