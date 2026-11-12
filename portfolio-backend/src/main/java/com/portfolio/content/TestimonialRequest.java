package com.portfolio.content;

import com.portfolio.validation.OptionalSafeUrl;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TestimonialRequest(
    @NotBlank @Size(max = 160) String name,
    @Size(max = 160) String role,
    @Size(max = 160) String company,
    @Size(max = 5000) String content,
    @Size(max = 2048) @OptionalSafeUrl String avatarUrl,
    int displayOrder,
    boolean published,
    @Pattern(regexp = "^$|WRITTEN|VIDEO", message = "mediaType must be WRITTEN or VIDEO") String mediaType,
    @Size(max = 2048) @OptionalSafeUrl(allowRelative = false) String videoUrl,
    @Size(max = 2048) @OptionalSafeUrl String thumbnailUrl,
    @Size(max = 160) String projectTitle
) {
    public TestimonialRequest(
        String name,
        String role,
        String company,
        String content,
        String avatarUrl,
        int displayOrder,
        boolean published
    ) {
        this(name, role, company, content, avatarUrl, displayOrder, published, "WRITTEN", null, null, null);
    }

    public String resolvedMediaType() {
        return (mediaType != null && !mediaType.isBlank()) ? mediaType.trim() : "WRITTEN";
    }

    @AssertTrue(message = "Written testimonials require content, and video testimonials require a valid videoUrl")
    public boolean isValidMediaPayload() {
        String type = resolvedMediaType();
        if ("VIDEO".equals(type)) {
            return videoUrl != null && !videoUrl.isBlank();
        }
        return content != null && !content.isBlank();
    }
}
