package com.portfolio.auth;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdministratorService {

    private static final String SUPER_ADMIN = "SUPER_ADMIN";

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AdministratorService(
        AdminUserRepository repository,
        PasswordEncoder passwordEncoder
    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AdministratorResponse> findAll() {
        return repository.findAll()
            .stream()
            .map(AdministratorResponse::from)
            .toList();
    }

    @Transactional
    public AdministratorResponse create(CreateAdministratorRequest request) {
        String email = request.email().trim().toLowerCase();

        if (repository.existsByEmail(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "An administrator with this email already exists"
            );
        }

        if (request.password().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Password must not exceed 72 UTF-8 bytes"
            );
        }

        AdminUser admin = new AdminUser(
            email,
            passwordEncoder.encode(request.password())
        );

        return AdministratorResponse.from(repository.save(admin));
    }

    @Transactional
    public AdministratorResponse updateStatus(
        UUID id,
        boolean enabled,
        String currentAdminEmail
    ) {
        AdminUser target = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Administrator not found"
            ));

        if (!enabled && target.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "You cannot disable your own account"
            );
        }

        if (!enabled
            && SUPER_ADMIN.equals(target.getRole())
            && target.isEnabled()
            && repository.countByRoleAndEnabled(SUPER_ADMIN, true) <= 1) {

            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "The last active Super Admin cannot be disabled"
            );
        }

        target.setEnabled(enabled);

        return AdministratorResponse.from(repository.save(target));
    }
}