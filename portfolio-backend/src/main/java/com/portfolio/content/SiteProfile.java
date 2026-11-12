
package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "site_profile")
public class SiteProfile {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 255)
    private String headline;

    @Column(columnDefinition = "nvarchar(max)")
    private String bio;

    @Column(length = 255)
    private String email;

    @Column(length = 50)
    private String phone;

    @Column(length = 255)
    private String location;

    @Column(name = "avatar_url", columnDefinition = "nvarchar(max)")
    private String avatarUrl;

    @Column(name = "resume_url", columnDefinition = "nvarchar(max)")
    private String resumeUrl;

    @Column(name = "github_url", columnDefinition = "nvarchar(max)")
    private String githubUrl;

    @Column(name = "linkedin_url", columnDefinition = "nvarchar(max)")
    private String linkedinUrl;

    @Column(name = "website_url", columnDefinition = "nvarchar(max)")
    private String websiteUrl;

    @Column(name = "company_tagline", length = 255)
    private String companyTagline;

    @Column(name = "company_story", columnDefinition = "nvarchar(max)")
    private String companyStory;

    @Column(name = "differentiators_json", columnDefinition = "nvarchar(max)")
    private String differentiatorsJson;

    @Column(name = "whatsapp_number", length = 30)
    private String whatsappNumber;

    @Column(name = "support_email", length = 255)
    private String supportEmail;

    @Column(name = "business_hours", length = 160)
    private String businessHours;

    @Column(name = "response_sla", length = 160)
    private String responseSla;

    @Column(name = "footer_tagline", length = 255)
    private String footerTagline;

    @Column(name = "logo_url", columnDefinition = "nvarchar(max)")
    private String logoUrl;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected SiteProfile() {}

    public void update(SiteProfileRequest request) {
        this.name = request.name().trim();
        this.headline = request.headline();
        this.bio = request.bio();
        this.email = request.email();
        this.phone = request.phone();
        this.location = request.location();
        this.avatarUrl = request.avatarUrl();
        this.resumeUrl = request.resumeUrl();
        this.githubUrl = request.githubUrl();
        this.linkedinUrl = request.linkedinUrl();
        this.websiteUrl = request.websiteUrl();
        this.companyTagline = request.companyTagline();
        this.companyStory = request.companyStory();
        this.differentiatorsJson = request.differentiatorsJson();
        this.whatsappNumber = request.whatsappNumber();
        this.supportEmail = request.supportEmail();
        this.businessHours = request.businessHours();
        this.responseSla = request.responseSla();
        this.footerTagline = request.footerTagline();
        this.logoUrl = request.logoUrl();
        this.updatedAt = Instant.now();
    }

    public static SiteProfile create(UUID id, SiteProfileRequest request) {
        SiteProfile profile = new SiteProfile();
        profile.id = id;
        profile.update(request);
        return profile;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getHeadline() { return headline; }
    public String getBio() { return bio; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getLocation() { return location; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getResumeUrl() { return resumeUrl; }
    public String getGithubUrl() { return githubUrl; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public String getWebsiteUrl() { return websiteUrl; }
    public String getCompanyTagline() { return companyTagline; }
    public String getCompanyStory() { return companyStory; }
    public String getDifferentiatorsJson() { return differentiatorsJson; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public String getSupportEmail() { return supportEmail; }
    public String getBusinessHours() { return businessHours; }
    public String getResponseSla() { return responseSla; }
    public String getFooterTagline() { return footerTagline; }
    public String getLogoUrl() { return logoUrl; }
    public Instant getUpdatedAt() { return updatedAt; }
}
