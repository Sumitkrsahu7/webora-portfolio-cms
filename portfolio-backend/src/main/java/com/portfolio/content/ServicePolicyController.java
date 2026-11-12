package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
public class ServicePolicyController {

    private final ServicePolicyRepository repository;

    public ServicePolicyController(ServicePolicyRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/policies")
    public List<ServicePolicyResponse> getPublicPolicies() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscTitleAsc()
            .stream()
            .map(ServicePolicyResponse::from)
            .toList();
    }

    @GetMapping("/api/admin/policies")
    public List<ServicePolicyResponse> getAdminPolicies() {
        return repository.findAllByOrderByDisplayOrderAscTitleAsc()
            .stream()
            .map(ServicePolicyResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/policies")
    @ResponseStatus(HttpStatus.CREATED)
    public ServicePolicyResponse createPolicy(@Valid @RequestBody ServicePolicyRequest request) {
        ServicePolicy policy = ServicePolicy.create(UUID.randomUUID(), request);
        return ServicePolicyResponse.from(repository.save(policy));
    }

    @PutMapping("/api/admin/policies/{id}")
    public ServicePolicyResponse updatePolicy(
        @PathVariable UUID id,
        @Valid @RequestBody ServicePolicyRequest request
    ) {
        ServicePolicy policy = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Service policy not found"
            ));
        policy.update(request);
        return ServicePolicyResponse.from(repository.save(policy));
    }

    @DeleteMapping("/api/admin/policies/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePolicy(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Service policy not found"
            );
        }
        repository.deleteById(id);
    }
}
