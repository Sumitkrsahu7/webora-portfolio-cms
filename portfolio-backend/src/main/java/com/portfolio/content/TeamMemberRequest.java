package com.portfolio.content;

import com.portfolio.validation.OptionalSafeUrl;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TeamMemberRequest(
    @NotBlank @Size(max = 160) String name,
    @NotBlank @Size(max = 160) String roleTitle,
    @Size(max = 255) String specialty,
    @Size(max = 2000) String bio,
    @Size(max = 2048) @OptionalSafeUrl String avatarUrl,
    @Size(max = 2048) @OptionalSafeUrl(allowRelative = false) String linkedinUrl,
    @Size(max = 2048) @OptionalSafeUrl(allowRelative = false) String githubUrl,
    int displayOrder,
    boolean published
) {}
