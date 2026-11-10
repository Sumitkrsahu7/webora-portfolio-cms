package com.portfolio.content;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InquiryRequest(
    @NotBlank @Size(max = 160) String name,
    @NotBlank @Email @Size(max = 255) String email,
    @Size(max = 255) String subject,
    @NotBlank @Size(max = 10000) String message
) {}
