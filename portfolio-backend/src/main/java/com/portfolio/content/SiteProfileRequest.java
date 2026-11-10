package com.portfolio.content;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SiteProfileRequest(
    @NotBlank @Size(max = 160) String name,
    @Size(max = 255) String headline,
    @Size(max = 20000) String bio,
    @Email @Size(max = 255) String email,
    @Size(max = 50) String phone,
    @Size(max = 255) String location,
    @Size(max = 2048) String avatarUrl,
    @Size(max = 2048) String resumeUrl,
    @Size(max = 2048) String githubUrl,
    @Size(max = 2048) String linkedinUrl,
    @Size(max = 2048) String websiteUrl
) {}
