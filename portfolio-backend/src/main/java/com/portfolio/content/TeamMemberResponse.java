package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record TeamMemberResponse(
    UUID id,
    String name,
    String roleTitle,
    String specialty,
    String bio,
    String avatarUrl,
    String linkedinUrl,
    String githubUrl,
    int displayOrder,
    boolean published,
    Instant createdAt,
    Instant updatedAt
) {
    public static TeamMemberResponse from(TeamMember member) {
        return new TeamMemberResponse(
            member.getId(),
            member.getName(),
            member.getRoleTitle(),
            member.getSpecialty(),
            member.getBio(),
            member.getAvatarUrl(),
            member.getLinkedinUrl(),
            member.getGithubUrl(),
            member.getDisplayOrder(),
            member.isPublished(),
            member.getCreatedAt(),
            member.getUpdatedAt()
        );
    }
}
