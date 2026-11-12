package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
public class ProcessStepController {

    private final ProcessStepRepository repository;

    public ProcessStepController(ProcessStepRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/process-steps")
    public List<ProcessStepResponse> getPublicSteps() {
        return repository.findByPublishedTrueOrderByStepNumberAsc()
            .stream()
            .map(ProcessStepResponse::from)
            .toList();
    }

    @GetMapping("/api/admin/process-steps")
    public List<ProcessStepResponse> getAdminSteps() {
        return repository.findAllByOrderByStepNumberAsc()
            .stream()
            .map(ProcessStepResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/process-steps")
    @ResponseStatus(HttpStatus.CREATED)
    public ProcessStepResponse createStep(@Valid @RequestBody ProcessStepRequest request) {
        ProcessStep step = ProcessStep.create(UUID.randomUUID(), request);
        return ProcessStepResponse.from(repository.save(step));
    }

    @PutMapping("/api/admin/process-steps/{id}")
    public ProcessStepResponse updateStep(
        @PathVariable UUID id,
        @Valid @RequestBody ProcessStepRequest request
    ) {
        ProcessStep step = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Process step not found"
            ));
        step.update(request);
        return ProcessStepResponse.from(repository.save(step));
    }

    @DeleteMapping("/api/admin/process-steps/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStep(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Process step not found"
            );
        }
        repository.deleteById(id);
    }
}
