package com.portfolio.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record InquiryStatusRequest(
    @NotBlank
    @Pattern(
        regexp = "NEW|READ|REPLIED",
        message = "Status must be NEW, READ or REPLIED"
    )
    String status
) {}