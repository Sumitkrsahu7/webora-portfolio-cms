package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@RestController
public class ServiceController {

    private final ServiceRepository repository;

    public ServiceController(ServiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/services")
    public List<ServiceResponse> getPublicServices() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscTitleAsc()
            .stream()
            .map(ServiceResponse::from)
            .toList();
    }

    @GetMapping("/api/public/services/{slug}")
    public ServiceResponse getPublicServiceBySlug(@PathVariable String slug) {
        return repository.findBySlugIgnoreCaseAndPublishedTrue(slug)
            .map(ServiceResponse::from)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Service not found"
            ));
    }

    @GetMapping("/api/admin/services")
    public List<ServiceResponse> getAdminServices() {
        return repository.findAllByOrderByDisplayOrderAscTitleAsc()
            .stream()
            .map(ServiceResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/services")
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceResponse createService(
        @Valid @RequestBody ServiceRequest request
    ) {
        UUID id = UUID.randomUUID();
        String slug = resolveUniqueSlug(request.slug(), request.title(), id);
        ServiceItem item = ServiceItem.create(id, request, slug);
        return ServiceResponse.from(repository.save(item));
    }

    @PutMapping("/api/admin/services/{id}")
    public ServiceResponse updateService(
        @PathVariable UUID id,
        @Valid @RequestBody ServiceRequest request
    ) {
        ServiceItem item = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Service not found"
            ));

        String slug = resolveUniqueSlug(request.slug(), request.title(), id);
        item.update(request, slug);
        return ServiceResponse.from(repository.save(item));
    }

    @DeleteMapping("/api/admin/services/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteService(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Service not found"
            );
        }

        repository.deleteById(id);
    }

    private String resolveUniqueSlug(String requestedSlug, String title, UUID selfId) {
        String base = (requestedSlug != null && !requestedSlug.isBlank())
            ? requestedSlug.trim()
            : title.trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");

        if (base.isEmpty()) {
            base = "service-" + selfId.toString().substring(0, 8);
        }

        if (repository.existsBySlugIgnoreCaseAndIdNot(base, selfId)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A service with slug '" + base + "' already exists."
            );
        }
        return base;
    }
}
