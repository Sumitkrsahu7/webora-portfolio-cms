package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
public class FaqController {

    private final FaqRepository repository;

    public FaqController(FaqRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/faqs")
    public List<FaqResponse> getPublicFaqs() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscQuestionAsc()
            .stream()
            .map(FaqResponse::from)
            .toList();
    }

    @GetMapping("/api/admin/faqs")
    public List<FaqResponse> getAdminFaqs() {
        return repository.findAllByOrderByDisplayOrderAscQuestionAsc()
            .stream()
            .map(FaqResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/faqs")
    @ResponseStatus(HttpStatus.CREATED)
    public FaqResponse create(@Valid @RequestBody FaqRequest request) {
        Faq faq = Faq.create(UUID.randomUUID(), request);
        return FaqResponse.from(repository.save(faq));
    }

    @PutMapping("/api/admin/faqs/{id}")
    public FaqResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody FaqRequest request
    ) {
        Faq faq = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "FAQ not found"
            ));
        faq.update(request);
        return FaqResponse.from(repository.save(faq));
    }

    @DeleteMapping("/api/admin/faqs/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "FAQ not found"
            );
        }
        repository.deleteById(id);
    }
}
