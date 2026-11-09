package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record SkillResponse(
    UUID id,
    String name,
    String category,
    Integer proficiency,
    int displayOrder,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static SkillResponse from(Skill skill) {
        return new SkillResponse(
            skill.getId(),
            skill.getName(),
            skill.getCategory(),
            skill.getProficiency(),
            skill.getDisplayOrder(),
            skill.isPublished(),
            skill.getCreatedAt(),
            skill.getUpdatedAt()
        );
    }
}