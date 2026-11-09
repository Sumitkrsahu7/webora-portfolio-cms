
package com.portfolio.content;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SiteProfileRequest(
    @NotBlank @Size(max = 160) String name,
    @Size(max = 255) String headline,
    String bio,
    @Email @Size(max = 255) String email,
    @Size(max = 50) String phone,
    @Size(max = 255) String location,
    String avatarUrl,
    String resumeUrl,
    String githubUrl,
    String linkedinUrl,
    String websiteUrl
) {}
