package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
public class TestimonialController {

    private final TestimonialRepository repository;

    public TestimonialController(TestimonialRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/testimonials")
    public List<TestimonialResponse> getPublicTestimonials() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscCreatedAtDesc()
            .stream()
            .map(TestimonialResponse::from)
            .toList();
    }

    @GetMapping("/api/admin/testimonials")
    public List<TestimonialResponse> getAdminTestimonials() {
        return repository.findAllByOrderByDisplayOrderAscCreatedAtDesc()
            .stream()
            .map(TestimonialResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/testimonials")
    @ResponseStatus(HttpStatus.CREATED)
    public TestimonialResponse create(
        @Valid @RequestBody TestimonialRequest request
    ) {
        Testimonial item = Testimonial.create(UUID.randomUUID(), request);
        return TestimonialResponse.from(repository.save(item));
    }

    @PutMapping("/api/admin/testimonials/{id}")
    public TestimonialResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody TestimonialRequest request
    ) {
        Testimonial item = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Testimonial not found"
            ));

        item.update(request);
        return TestimonialResponse.from(repository.save(item));
    }

    @DeleteMapping("/api/admin/testimonials/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Testimonial not found"
            );
        }

        repository.deleteById(id);
    }
}