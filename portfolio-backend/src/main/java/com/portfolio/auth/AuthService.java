package com.portfolio.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;
    private final AdminUserRepository adminUserRepository;

    public AuthService(
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        LoginAttemptService loginAttemptService
    ) {
        this(authenticationManager, jwtService, loginAttemptService, null);
    }

    @Autowired
    public AuthService(
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        LoginAttemptService loginAttemptService,
        AdminUserRepository adminUserRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.loginAttemptService = loginAttemptService;
        this.adminUserRepository = adminUserRepository;
    }

    public LoginResponse login(LoginRequest request) {

        String email = request.email()
            .trim()
            .toLowerCase(Locale.ROOT);

        long retryAfter =
            loginAttemptService.getRetryAfterSeconds(email);

        if (retryAfter > 0) {
            throw new LoginRateLimitException(retryAfter);
        }

        Authentication authentication;

        try {
            authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    email,
                    request.password()
                )
            );
        } catch (AuthenticationException exception) {
            loginAttemptService.recordFailure(email);
            throw exception;
        }

        loginAttemptService.reset(email);

        UserDetails userDetails =
            (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(
            token,
            "Bearer",
            jwtService.getExpirationSeconds(),
            new AdminProfileResponse(
                userDetails.getUsername(),
                userDetails.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority()
                    .replace("ROLE_", "")
            )
        );
    }

    /**
     * Invalidate all currently issued JWTs for the signed-in administrator by incrementing token_version.
     */
    @Transactional
    public void logout(String email) {
        if (adminUserRepository == null || email == null || email.isBlank()) {
            return;
        }
        adminUserRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
            .ifPresent(admin -> {
                admin.incrementTokenVersion();
                adminUserRepository.save(admin);
            });
    }
}
