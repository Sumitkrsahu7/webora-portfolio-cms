package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record TestimonialResponse(
    UUID id,
    String name,
    String role,
    String company,
    String content,
    String avatarUrl,
    int displayOrder,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static TestimonialResponse from(Testimonial item) {
        return new TestimonialResponse(
            item.getId(),
            item.getName(),
            item.getRole(),
            item.getCompany(),
            item.getContent(),
            item.getAvatarUrl(),
            item.getDisplayOrder(),
            item.isPublished(),
            item.getCreatedAt(),
            item.getUpdatedAt()
        );
    }
}