
package com.portfolio.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProjectImageRequest(
    @NotBlank
    String imageUrl,

    @Size(max = 200)
    String altText,

    int displayOrder
) {
}
