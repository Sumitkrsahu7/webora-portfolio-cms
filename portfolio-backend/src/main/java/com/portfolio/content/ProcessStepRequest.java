package com.portfolio.content;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProcessStepRequest(
    @Min(1) int stepNumber,
    @NotBlank @Size(max = 160) String title,
    @NotBlank @Size(max = 2000) String description,
    @Size(max = 255) String deliverableHint,
    boolean published
) {}
