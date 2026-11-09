
package com.portfolio.project;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public record ProjectRequest(
    @NotBlank
    @Size(max = 160)
    String title,

    @NotBlank
    @Size(max = 180)
    @Pattern(regexp = "[a-z0-9]+(?:-[a-z0-9]+)*",
             message = "Slug must contain lowercase letters, numbers and hyphens only")
    String slug,

    @NotBlank
    @Size(max = 320)
    String shortDescription,

    String fullDescription,
    String category,
    String thumbnailUrl,
    String liveUrl,
    String githubUrl,

    LocalDate startDate,
    LocalDate completionDate,

    boolean featured,

    ProjectStatus status,

    Set<String> technologies,

    @Valid
    List<ProjectImageRequest> images
) {
}
