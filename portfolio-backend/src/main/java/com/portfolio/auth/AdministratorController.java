package com.portfolio.auth;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/administrators")
public class AdministratorController {

    private final AdministratorService administratorService;

    public AdministratorController(AdministratorService administratorService) {
        this.administratorService = administratorService;
    }

    @GetMapping
    public List<AdministratorResponse> getAdministrators() {
        return administratorService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdministratorResponse createAdministrator(
        @Valid @RequestBody CreateAdministratorRequest request
    ) {
        return administratorService.create(request);
    }

    @PatchMapping("/{id}/status")
    public AdministratorResponse updateAdministratorStatus(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateAdministratorStatusRequest request,
        Authentication authentication
    ) {
        return administratorService.updateStatus(
            id,
            request.enabled(),
            authentication.getName()
        );
    }
}