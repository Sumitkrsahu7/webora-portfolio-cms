package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
public class InquiryController {

    private final InquiryRepository repository;

    public InquiryController(InquiryRepository repository) {
        this.repository = repository;
    }

    // Public contact form submission
    @PostMapping("/api/public/inquiries")
    @ResponseStatus(HttpStatus.CREATED)
    public InquiryResponse create(
        @Valid @RequestBody InquiryRequest request
    ) {
        Inquiry inquiry = Inquiry.create(UUID.randomUUID(), request);
        return InquiryResponse.from(repository.save(inquiry));
    }

    // Admin inquiry management
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
}