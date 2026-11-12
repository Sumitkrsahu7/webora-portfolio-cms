package com.portfolio.content;

import com.portfolio.validation.OptionalSafeUrl;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record InquiryRequest(
    @NotBlank @Size(max = 160) String name,
    @NotBlank @Email @Size(max = 255) String email,
    @Size(max = 255) String subject,
    @Size(max = 10000) String message,
    @Pattern(regexp = "GENERAL|QUOTE", message = "Inquiry type must be GENERAL or QUOTE")
    String inquiryType,
    @Size(max = 40)
    @Pattern(regexp = "^$|^[+0-9()\\s-]{6,32}$", message = "Phone number format is invalid")
    String phone,
    @Size(max = 160) String companyName,
    @Size(max = 120) String projectCategory,
    @Size(max = 160) String selectedPackage,
    @Size(max = 120) String budgetRange,
    @Size(max = 120) String targetTimeline,
    @Size(max = 10000) String projectRequirements,
    @Size(max = 1024) @OptionalSafeUrl String websiteOrReferenceUrl,
    @Pattern(regexp = "^$|EMAIL|WHATSAPP|PHONE", message = "Preferred contact method must be EMAIL, WHATSAPP, or PHONE")
    String preferredContactMethod,
    @Size(max = 120) String hpField
) {
    public InquiryRequest(String name, String email, String subject, String message) {
        this(
            name, email, subject, message,
            "GENERAL", null, null, null, null, null, null, null, null, null, null
        );
    }

    @AssertTrue(message = "Message or project requirements are required.")
    public boolean isBodyPresent() {
        return (message != null && !message.isBlank())
            || (projectRequirements != null && !projectRequirements.isBlank());
    }
}
