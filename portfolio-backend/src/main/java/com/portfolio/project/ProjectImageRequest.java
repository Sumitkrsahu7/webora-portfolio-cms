package com.portfolio.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectImageRequest(
    @NotBlank
    @Size(max = 2048)
    String imageUrl,

    @Size(max = 200)
    String altText,

    int displayOrder
) {
}
