package com.portfolio.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;

    public AuthService(
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        LoginAttemptService loginAttemptService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.loginAttemptService = loginAttemptService;
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
}
