package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
public class ExperienceController {

    private final ExperienceRepository repository;

    public ExperienceController(ExperienceRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/experiences")
    public List<ExperienceResponse> getPublicExperiences() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscStartDateDesc()
            .stream()
            .map(ExperienceResponse::from)
            .toList();
    }

    @GetMapping("/api/admin/experiences")
    public List<ExperienceResponse> getAdminExperiences() {
        return repository.findAllByOrderByDisplayOrderAscStartDateDesc()
            .stream()
            .map(ExperienceResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/experiences")
    @ResponseStatus(HttpStatus.CREATED)
    public ExperienceResponse createExperience(
        @Valid @RequestBody ExperienceRequest request
    ) {
        Experience item = Experience.create(UUID.randomUUID(), request);
        return ExperienceResponse.from(repository.save(item));
    }

    @PutMapping("/api/admin/experiences/{id}")
    public ExperienceResponse updateExperience(
        @PathVariable UUID id,
        @Valid @RequestBody ExperienceRequest request
    ) {
        Experience item = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Experience entry not found"
            ));

        item.update(request);
        return ExperienceResponse.from(repository.save(item));
    }

    @DeleteMapping("/api/admin/experiences/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExperience(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Experience entry not found"
            );
        }
        repository.deleteById(id);
    }
}
