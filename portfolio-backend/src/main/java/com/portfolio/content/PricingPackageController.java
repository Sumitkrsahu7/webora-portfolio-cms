package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@RestController
public class PricingPackageController {

    private final PricingPackageRepository repository;

    public PricingPackageController(PricingPackageRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/pricing")
    public List<PricingPackageResponse> getPublicPricing() {
        return repository.findByPublishedTrueOrderByDisplayOrderAscNameAsc()
            .stream()
            .map(PricingPackageResponse::from)
            .toList();
    }

    @GetMapping("/api/admin/pricing")
    public List<PricingPackageResponse> getAdminPricing() {
        return repository.findAllByOrderByDisplayOrderAscNameAsc()
            .stream()
            .map(PricingPackageResponse::from)
            .toList();
    }

    @PostMapping("/api/admin/pricing")
    @ResponseStatus(HttpStatus.CREATED)
    public PricingPackageResponse createPackage(@Valid @RequestBody PricingPackageRequest request) {
        UUID id = UUID.randomUUID();
        String slug = resolveUniqueSlug(request.slug(), request.name(), id);
        PricingPackage pkg = PricingPackage.create(id, request, slug);
        return PricingPackageResponse.from(repository.save(pkg));
    }

    @PutMapping("/api/admin/pricing/{id}")
    public PricingPackageResponse updatePackage(
        @PathVariable UUID id,
        @Valid @RequestBody PricingPackageRequest request
    ) {
        PricingPackage pkg = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Pricing package not found"
            ));
        String slug = resolveUniqueSlug(request.slug(), request.name(), id);
        pkg.update(request, slug);
        return PricingPackageResponse.from(repository.save(pkg));
    }

    @DeleteMapping("/api/admin/pricing/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePackage(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Pricing package not found"
            );
        }
        repository.deleteById(id);
    }

    private String resolveUniqueSlug(String requestedSlug, String name, UUID selfId) {
        String base = (requestedSlug != null && !requestedSlug.isBlank())
            ? requestedSlug.trim()
            : name.trim()
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");

        if (base.isEmpty()) {
            base = "package-" + selfId.toString().substring(0, 8);
        }
        if (repository.existsBySlugIgnoreCaseAndIdNot(base, selfId)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A pricing package with slug '" + base + "' already exists."
            );
        }
        return base;
    }
}
