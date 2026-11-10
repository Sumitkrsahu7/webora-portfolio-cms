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

    @Size(max = 50000)
    String fullDescription,

    @Size(max = 255)
    String category,

    @Size(max = 2048)
    String thumbnailUrl,

    @Size(max = 2048)
    String liveUrl,

    @Size(max = 2048)
    String githubUrl,

    LocalDate startDate,
    LocalDate completionDate,
    boolean featured,
    ProjectStatus status,

    @Size(max = 30)
    Set<@NotBlank @Size(max = 255) String> technologies,

    @Valid
    @Size(max = 10)
    List<ProjectImageRequest> images
) {
}
