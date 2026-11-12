package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record SiteProfileResponse(
    UUID id,
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
    String websiteUrl,
    String companyTagline,
    String companyStory,
    String differentiatorsJson,
    String whatsappNumber,
    String supportEmail,
    String businessHours,
    String responseSla,
    String footerTagline,
    String logoUrl,
    Instant updatedAt
) {
    public static SiteProfileResponse from(SiteProfile p) {
        return new SiteProfileResponse(
            p.getId(),
            p.getName(),
            p.getHeadline(),
            p.getBio(),
            p.getEmail(),
            p.getPhone(),
            p.getLocation(),
            p.getAvatarUrl(),
            p.getResumeUrl(),
            p.getGithubUrl(),
            p.getLinkedinUrl(),
            p.getWebsiteUrl(),
            p.getCompanyTagline(),
            p.getCompanyStory(),
            p.getDifferentiatorsJson(),
            p.getWhatsappNumber(),
            p.getSupportEmail(),
            p.getBusinessHours(),
            p.getResponseSla(),
            p.getFooterTagline(),
            p.getLogoUrl(),
            p.getUpdatedAt()
        );
    }
}
