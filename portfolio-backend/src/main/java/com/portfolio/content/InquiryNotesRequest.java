package com.portfolio.content;

import jakarta.validation.constraints.Size;

public record InquiryNotesRequest(
    @Size(max = 10000) String internalNotes
) {}
