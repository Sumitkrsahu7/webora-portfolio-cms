package com.portfolio.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TestimonialRequest(
    @NotBlank @Size(max = 160) String name,
    @Size(max = 160) String role,
    @Size(max = 160) String company,
    @NotBlank String content,
    String avatarUrl,
    int displayOrder,
    boolean published
) {}