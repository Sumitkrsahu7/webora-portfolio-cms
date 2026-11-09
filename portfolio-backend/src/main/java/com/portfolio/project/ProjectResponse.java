
package com.portfolio.project;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record ProjectResponse(
    UUID id,
    String title,
    String slug,
    String shortDescription,
    String fullDescription,
    String category,
    String thumbnailUrl,
    String liveUrl,
    String githubUrl,
    LocalDate startDate,
    LocalDate completionDate,
    boolean featured,
    String status,
    Set<String> technologies,
    List<ProjectImageResponse> images,
    Instant createdAt,
    Instant updatedAt
) {
    public static ProjectResponse from(Project p) {
        return new ProjectResponse(
            p.getId(),
            p.getTitle(),
            p.getSlug(),
            p.getShortDescription(),
            p.getFullDescription(),
            p.getCategory(),
            p.getThumbnailUrl(),
            p.getLiveUrl(),
            p.getGithubUrl(),
            p.getStartDate(),
            p.getCompletionDate(),
            p.isFeatured(),
            p.getStatus().name(),
            Set.copyOf(p.getTechnologies()),
            p.getImages().stream()
                .map(ProjectImageResponse::from)
                .toList(),
            p.getCreatedAt(),
            p.getUpdatedAt()
        );
    }
}
