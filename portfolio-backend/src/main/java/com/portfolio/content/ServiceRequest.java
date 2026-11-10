package com.portfolio.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ServiceRequest(
    @NotBlank @Size(max = 160) String title,
    @NotBlank @Size(max = 10000) String description,
    @Size(max = 100) String icon,
    int displayOrder,
    boolean published
) {}
