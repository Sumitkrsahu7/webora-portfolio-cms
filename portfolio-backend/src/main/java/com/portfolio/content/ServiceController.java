package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
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
        ServiceItem item = ServiceItem.create(UUID.randomUUID(), request);
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

        item.update(request);
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
}