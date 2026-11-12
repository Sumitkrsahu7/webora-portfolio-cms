package com.portfolio.content;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ExperienceResponse(
    UUID id,
    String company,
    String companyUrl,
    String roleTitle,
    String location,
    String roleType,
    LocalDate startDate,
    LocalDate endDate,
    boolean currentRole,
    String description,
    String technologies,
    int displayOrder,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static ExperienceResponse from(Experience entity) {
        return new ExperienceResponse(
            entity.getId(),
            entity.getCompany(),
            entity.getCompanyUrl(),
            entity.getRoleTitle(),
            entity.getLocation(),
            entity.getRoleType(),
            entity.getStartDate(),
            entity.getEndDate(),
            entity.isCurrentRole(),
            entity.getDescription(),
            entity.getTechnologies(),
            entity.getDisplayOrder(),
            entity.isPublished(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }
}
