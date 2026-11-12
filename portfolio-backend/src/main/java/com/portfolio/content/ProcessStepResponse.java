package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record ProcessStepResponse(
    UUID id,
    int stepNumber,
    String title,
    String description,
    String deliverableHint,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static ProcessStepResponse from(ProcessStep step) {
        return new ProcessStepResponse(
            step.getId(),
            step.getStepNumber(),
            step.getTitle(),
            step.getDescription(),
            step.getDeliverableHint(),
            step.isPublished(),
            step.getCreatedAt(),
            step.getUpdatedAt()
        );
    }
}
