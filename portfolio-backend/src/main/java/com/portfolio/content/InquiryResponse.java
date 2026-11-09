package com.portfolio.content;

import java.time.Instant;
import java.util.UUID;

public record InquiryResponse(
    UUID id,
    String name,
    String email,
    String subject,
    String message,
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
            inquiry.getStatus(),
            inquiry.getCreatedAt(),
            inquiry.getUpdatedAt()
        );
    }
}