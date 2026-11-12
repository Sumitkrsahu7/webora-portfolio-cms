package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record PublicInquiryAckResponse(
    UUID id,
    String inquiryType,
    String status,
    Instant createdAt,
    String message
) {
    public static PublicInquiryAckResponse from(Inquiry inquiry) {
        return new PublicInquiryAckResponse(
            inquiry.getId(),
            inquiry.getInquiryType(),
            inquiry.getStatus(),
            inquiry.getCreatedAt(),
            "QUOTE".equals(inquiry.getInquiryType())
                ? "Your quote request has been received. Our team will review your requirements and respond shortly."
                : "Your inquiry has been received. Our team will respond shortly."
        );
    }

    public static PublicInquiryAckResponse ignoredHoneypot(String inquiryType) {
        String normalizedType = "QUOTE".equalsIgnoreCase(inquiryType) ? "QUOTE" : "GENERAL";
        return new PublicInquiryAckResponse(
            UUID.randomUUID(),
            normalizedType,
            "NEW",
            Instant.now(),
            "Thank you for reaching out."
        );
    }
}
