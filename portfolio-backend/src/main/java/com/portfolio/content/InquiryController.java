package com.portfolio.content;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
public class InquiryController {

    private static final int MAX_SUBMISSIONS_PER_WINDOW = 6;
    private static final Duration RATE_LIMIT_WINDOW = Duration.ofMinutes(10);

    private final InquiryRepository repository;
    private final ConcurrentHashMap<String, Deque<Instant>> rateLimitBuckets = new ConcurrentHashMap<>();

    public InquiryController(InquiryRepository repository) {
        this.repository = repository;
    }

    // Public contact and quote form submission
    @PostMapping("/api/public/inquiries")
    @ResponseStatus(HttpStatus.CREATED)
    public PublicInquiryAckResponse create(
        @Valid @RequestBody InquiryRequest request,
        HttpServletRequest httpRequest
    ) {
        // Silent honeypot drop to avoid tipping off automated form bots
        if (request.hpField() != null && !request.hpField().isBlank()) {
            return PublicInquiryAckResponse.ignoredHoneypot(request.inquiryType());
        }

        enforceRateLimit(resolveClientKey(httpRequest));

        Inquiry inquiry = Inquiry.create(UUID.randomUUID(), request);
        return PublicInquiryAckResponse.from(repository.save(inquiry));
    }

    // Admin inquiry and quote lead management
    @GetMapping("/api/admin/inquiries")
    public List<InquiryResponse> getAll() {
        return repository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(InquiryResponse::from)
            .toList();
    }

    @PatchMapping("/api/admin/inquiries/{id}/status")
    public InquiryResponse updateStatus(
        @PathVariable UUID id,
        @Valid @RequestBody InquiryStatusRequest request
    ) {
        Inquiry inquiry = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Inquiry not found"
            ));

        inquiry.updateStatus(request.status());
        return InquiryResponse.from(repository.save(inquiry));
    }

    @PatchMapping("/api/admin/inquiries/{id}/notes")
    public InquiryResponse updateNotes(
        @PathVariable UUID id,
        @Valid @RequestBody InquiryNotesRequest request
    ) {
        Inquiry inquiry = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Inquiry not found"
            ));

        inquiry.updateInternalNotes(request.internalNotes());
        return InquiryResponse.from(repository.save(inquiry));
    }

    @DeleteMapping("/api/admin/inquiries/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Inquiry not found"
            );
        }

        repository.deleteById(id);
    }

    private void enforceRateLimit(String clientKey) {
        Instant now = Instant.now();
        Instant cutoff = now.minus(RATE_LIMIT_WINDOW);

        Deque<Instant> timestamps = rateLimitBuckets.computeIfAbsent(clientKey, k -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= MAX_SUBMISSIONS_PER_WINDOW) {
                throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many inquiries submitted recently. Please wait a few minutes and try again."
                );
            }
            timestamps.addLast(now);
        }

        if (rateLimitBuckets.size() > 1000) {
            rateLimitBuckets.entrySet().removeIf(entry -> {
                synchronized (entry.getValue()) {
                    return entry.getValue().isEmpty() || entry.getValue().peekLast().isBefore(cutoff);
                }
            });
        }
    }

    private String resolveClientKey(HttpServletRequest httpRequest) {
        if (httpRequest == null) {
            return "unknown";
        }
        String forwarded = httpRequest.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            int comma = forwarded.indexOf(',');
            return (comma >= 0 ? forwarded.substring(0, comma) : forwarded).trim();
        }
        return httpRequest.getRemoteAddr() != null ? httpRequest.getRemoteAddr() : "unknown";
    }
}
