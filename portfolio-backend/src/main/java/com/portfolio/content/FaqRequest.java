package com.portfolio.content;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FaqRequest(
    @NotBlank @Size(max = 300) String question,
    @NotBlank @Size(max = 4000) String answer,
    @Size(max = 80) String category,
    @Min(1) int displayOrder,
    boolean published
) {}
