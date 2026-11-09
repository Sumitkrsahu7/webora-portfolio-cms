
package com.portfolio.content;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
public class SiteProfileController {

    private static final UUID PROFILE_ID =
        UUID.fromString("00000000-0000-0000-0000-000000000001");

    private final SiteProfileRepository repository;

    public SiteProfileController(SiteProfileRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/public/profile")
    public SiteProfileResponse getPublicProfile() {
        return getProfile();
    }

    @GetMapping("/api/admin/profile")
    public SiteProfileResponse getAdminProfile() {
        return getProfile();
    }

    @PutMapping("/api/admin/profile")
    public SiteProfileResponse updateProfile(
        @Valid @RequestBody SiteProfileRequest request
    ) {
        SiteProfile profile = repository.findById(PROFILE_ID)
            .orElseGet(() -> SiteProfile.create(PROFILE_ID, request));

        profile.update(request);

        return SiteProfileResponse.from(repository.save(profile));
    }

    private SiteProfileResponse getProfile() {
        return repository.findById(PROFILE_ID)
            .map(SiteProfileResponse::from)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Website profile has not been configured"
            ));
    }
}
