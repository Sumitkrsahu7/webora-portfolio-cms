package com.portfolio.content;

import com.portfolio.validation.OptionalSafeUrl;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SiteProfileRequest(
    @NotBlank @Size(max = 160) String name,
    @Size(max = 255) String headline,
    @Size(max = 20000) String bio,
    @Email @Size(max = 255) String email,
    @Size(max = 50) String phone,
    @Size(max = 255) String location,
    @Size(max = 2048) @OptionalSafeUrl String avatarUrl,
    @Size(max = 2048) @OptionalSafeUrl String resumeUrl,
    @Size(max = 2048) @OptionalSafeUrl(allowRelative = false) String githubUrl,
    @Size(max = 2048) @OptionalSafeUrl(allowRelative = false) String linkedinUrl,
    @Size(max = 2048) @OptionalSafeUrl(allowRelative = false) String websiteUrl,
    @Size(max = 255) String companyTagline,
    @Size(max = 20000) String companyStory,
    @Size(max = 12000) String differentiatorsJson,
    @Size(max = 30) @Pattern(regexp = "^$|^[0-9+()\\s-]{7,30}$", message = "Invalid WhatsApp number format") String whatsappNumber,
    @Email @Size(max = 255) String supportEmail,
    @Size(max = 160) String businessHours,
    @Size(max = 160) String responseSla,
    @Size(max = 255) String footerTagline,
    @Size(max = 2048) @OptionalSafeUrl String logoUrl
) {
    public SiteProfileRequest(
        String name,
        String headline,
        String bio,
        String email,
        String phone,
        String location,
        String avatarUrl,
        String resumeUrl,
        String githubUrl,
        String linkedinUrl,
        String websiteUrl
    ) {
        this(
            name, headline, bio, email, phone, location,
            avatarUrl, resumeUrl, githubUrl, linkedinUrl, websiteUrl,
            null, null, null, null, null, null, null, null, null
        );
    }
}
