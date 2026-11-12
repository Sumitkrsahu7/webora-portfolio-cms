package com.portfolio.content;

import com.portfolio.validation.OptionalSafeUrl;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ExperienceRequest(
    @NotBlank(message = "Company name is required")
    @Size(max = 160, message = "Company cannot exceed 160 characters")
    String company,

    @Size(max = 2048, message = "Company URL cannot exceed 2048 characters")
    @OptionalSafeUrl(allowRelative = false, message = "Company URL must start with http:// or https://")
    String companyUrl,

    @NotBlank(message = "Role title is required")
    @Size(max = 160, message = "Role title cannot exceed 160 characters")
    String roleTitle,

    @Size(max = 160, message = "Location cannot exceed 160 characters")
    String location,

    @Pattern(
        regexp = "FULL_TIME|CONTRACT|FREELANCE|FOUNDER",
        message = "Role type must be FULL_TIME, CONTRACT, FREELANCE, or FOUNDER"
    )
    String roleType,

    @NotNull(message = "Start date is required")
    LocalDate startDate,

    LocalDate endDate,

    boolean currentRole,

    @NotBlank(message = "Description is required")
    @Size(max = 10000, message = "Description cannot exceed 10000 characters")
    String description,

    @Size(max = 2000, message = "Technologies cannot exceed 2000 characters")
    String technologies,

    int displayOrder,

    boolean published
) {
    public ExperienceRequest {
        if (roleType == null || roleType.isBlank()) {
            roleType = "FULL_TIME";
        } else {
            roleType = roleType.trim();
        }
    }

    @AssertTrue(message = "End date cannot be earlier than start date")
    public boolean isValidDateRange() {
        if (currentRole || startDate == null || endDate == null) {
            return true;
        }
        return !endDate.isBefore(startDate);
    }
}
