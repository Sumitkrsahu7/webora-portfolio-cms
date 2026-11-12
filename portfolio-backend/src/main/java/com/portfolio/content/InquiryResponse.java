package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record InquiryResponse(
    UUID id,
    String name,
    String email,
    String subject,
    String message,
    String inquiryType,
    String phone,
    String companyName,
    String projectCategory,
    String selectedPackage,
    String budgetRange,
    String targetTimeline,
    String projectRequirements,
    String websiteOrReferenceUrl,
    String preferredContactMethod,
    String internalNotes,
    String status,
    Instant createdAt,
    Instant updatedAt
) {
    public static InquiryResponse from(Inquiry inquiry) {
        return new InquiryResponse(
            inquiry.getId(),
            inquiry.getName(),
            inquiry.getEmail(),
            inquiry.getSubject(),
            inquiry.getMessage(),
            inquiry.getInquiryType(),
            inquiry.getPhone(),
            inquiry.getCompanyName(),
            inquiry.getProjectCategory(),
            inquiry.getSelectedPackage(),
            inquiry.getBudgetRange(),
            inquiry.getTargetTimeline(),
            inquiry.getProjectRequirements(),
            inquiry.getWebsiteOrReferenceUrl(),
            inquiry.getPreferredContactMethod(),
            inquiry.getInternalNotes(),
            inquiry.getStatus(),
            inquiry.getCreatedAt(),
            inquiry.getUpdatedAt()
        );
    }
}
