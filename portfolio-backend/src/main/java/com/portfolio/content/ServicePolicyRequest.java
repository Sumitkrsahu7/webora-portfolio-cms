package com.portfolio.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ServicePolicyRequest(
    @NotBlank @Size(max = 160) String title,
    @NotBlank
    @Pattern(
        regexp = "SEPARATE_COSTS|SUPPORT_INCLUDED|SUPPORT_EXCLUDED|GENERAL",
        message = "policyType must be SEPARATE_COSTS, SUPPORT_INCLUDED, SUPPORT_EXCLUDED, or GENERAL"
    )
    String policyType,
    @NotBlank @Size(max = 2000) String summary,
    @Size(max = 12000) String bulletPointsJson,
    int displayOrder,
    boolean published
) {}
