package com.portfolio.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ServiceRequest(
    @NotBlank @Size(max = 160) String title,
    @NotBlank @Size(max = 10000) String description,
    @Size(max = 100) String icon,
    int displayOrder,
    boolean published,
    @Size(max = 160) @Pattern(regexp = "^$|^[a-z0-9-]+$", message = "Slug may only contain lowercase letters, numbers, and hyphens") String slug,
    @Size(max = 500) String shortDescription,
    @Size(max = 500) String targetAudience,
    @Size(max = 12000) String keyFeaturesJson,
    @Size(max = 12000) String deliverablesJson,
    @Size(max = 120) String startingPriceLabel,
    @Size(max = 120) String deliveryTimeline,
    @Size(max = 80) String ctaLabel,
    @Size(max = 20000) String overviewDetails
) {
    public ServiceRequest(
        String title,
        String description,
        String icon,
        int displayOrder,
        boolean published
    ) {
        this(title, description, icon, displayOrder, published,
            null, null, null, null, null, null, null, null, null);
    }
}
