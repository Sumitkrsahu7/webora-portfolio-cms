package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record ServicePolicyResponse(
    UUID id,
    String title,
    String policyType,
    String summary,
    String bulletPointsJson,
    int displayOrder,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static ServicePolicyResponse from(ServicePolicy p) {
        return new ServicePolicyResponse(
            p.getId(),
            p.getTitle(),
            p.getPolicyType(),
            p.getSummary(),
            p.getBulletPointsJson(),
            p.getDisplayOrder(),
            p.isPublished(),
            p.getCreatedAt(),
            p.getUpdatedAt()
        );
    }
}
