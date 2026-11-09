
package com.portfolio.project;

import java.util.UUID;

public record ProjectImageResponse(
    UUID id,
    String imageUrl,
    String altText,
    int displayOrder
) {
    public static ProjectImageResponse from(ProjectImage image) {
        return new ProjectImageResponse(
            image.getId(),
            image.getImageUrl(),
            image.getAltText(),
            image.getDisplayOrder()
        );
    }
}
