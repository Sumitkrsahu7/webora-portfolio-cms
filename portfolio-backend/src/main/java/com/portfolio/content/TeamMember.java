package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "team_members")
public class TeamMember {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(name = "role_title", nullable = false, length = 160)
    private String roleTitle;

    @Column(length = 255)
    private String specialty;

    @Column(length = 2000)
    private String bio;

    @Column(name = "avatar_url", columnDefinition = "nvarchar(max)")
    private String avatarUrl;

    @Column(name = "linkedin_url", length = 2048)
    private String linkedinUrl;

    @Column(name = "github_url", length = 2048)
    private String githubUrl;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected TeamMember() {}

    public static TeamMember create(UUID id, TeamMemberRequest request) {
        TeamMember member = new TeamMember();
        member.id = id;
        member.createdAt = Instant.now();
        member.update(request);
        return member;
    }

    public void update(TeamMemberRequest request) {
        this.name = request.name().trim();
        this.roleTitle = request.roleTitle().trim();
        this.specialty = request.specialty() != null ? request.specialty().trim() : null;
        this.bio = request.bio() != null ? request.bio().trim() : null;
        this.avatarUrl = request.avatarUrl();
        this.linkedinUrl = request.linkedinUrl();
        this.githubUrl = request.githubUrl();
        this.displayOrder = request.displayOrder();
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getRoleTitle() { return roleTitle; }
    public String getSpecialty() { return specialty; }
    public String getBio() { return bio; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public String getGithubUrl() { return githubUrl; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
