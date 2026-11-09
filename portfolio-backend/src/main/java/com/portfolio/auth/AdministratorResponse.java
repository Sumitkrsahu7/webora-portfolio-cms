package com.portfolio.auth;

import java.time.Instant;
import java.util.UUID;

public record AdministratorResponse(
    UUID id,
    String email,
    String role,
    boolean enabled,
    Instant createdAt
) {
    public static AdministratorResponse from(AdminUser admin) {
        return new AdministratorResponse(
            admin.getId(),
            admin.getEmail(),
            admin.getRole(),
            admin.isEnabled(),
            admin.getCreatedAt()
        );
    }
}