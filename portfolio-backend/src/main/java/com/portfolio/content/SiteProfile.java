
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
    public Instant getUpdatedAt() { return updatedAt; }
}
