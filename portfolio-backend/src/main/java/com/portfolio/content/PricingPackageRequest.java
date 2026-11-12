package com.portfolio.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PricingPackageRequest(
    @NotBlank @Size(max = 160) String name,
    @Size(max = 160) @Pattern(regexp = "^$|^[a-z0-9-]+$", message = "Slug may only contain lowercase letters, numbers, and hyphens") String slug,
    @Size(max = 120) String categoryLabel,
    @NotBlank @Size(max = 120) String priceLabel,
    @Size(max = 255) String billingNote,
    @Size(max = 500) String idealFor,
    @Size(max = 12000) String featuresJson,
    @Size(max = 500) String excludedNote,
    @Size(max = 120) String supportPeriodLabel,
    boolean highlighted,
    @Size(max = 80) String ctaLabel,
    int displayOrder,
    boolean published
) {}
