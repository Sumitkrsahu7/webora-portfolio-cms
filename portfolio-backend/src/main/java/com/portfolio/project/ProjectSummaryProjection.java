package com.portfolio.project;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Lightweight projection for public project list/featured queries so list endpoints
 * omit the large fullDescription nvarchar(max) column and images collection.
 */
public interface ProjectSummaryProjection {
    UUID getId();
    String getTitle();
    String getSlug();
    String getShortDescription();
    String getCategory();
    String getThumbnailUrl();
    String getLiveUrl();
    String getGithubUrl();
    LocalDate getStartDate();
    LocalDate getCompletionDate();
    boolean isFeatured();
    ProjectStatus getStatus();
    Instant getCreatedAt();
    Instant getUpdatedAt();
}
