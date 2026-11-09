
package com.portfolio.project;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/projects")
public class AdminProjectController {

    private final ProjectService projectService;

    public AdminProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(
        @Valid @RequestBody ProjectRequest request
    ) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    public ProjectResponse update(
        @PathVariable UUID id,
        @Valid @RequestBody ProjectRequest request
    ) {
        return projectService.update(id, request);
    }

    @GetMapping
    public Page<ProjectResponse> getAll(
        @RequestParam(required = false) ProjectStatus status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        if (page < 0 || size < 1 || size > 100) {
            throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid pagination parameters"
            );
        }

        return projectService.getAll(
            status,
            PageRequest.of(page, size)
        );
    }

    @GetMapping("/{id}")
    public ProjectResponse getById(@PathVariable UUID id) {
        return projectService.getById(id);
    }

    @GetMapping("/slug/{slug}")
    public ProjectResponse getBySlug(@PathVariable String slug) {
        return projectService.getBySlug(slug);
    }

    @PatchMapping("/{id}/status")
    public ProjectResponse changeStatus(
        @PathVariable UUID id,
        @Valid @RequestBody ProjectStatusRequest request
    ) {
        return projectService.changeStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        projectService.delete(id);
    }
}
