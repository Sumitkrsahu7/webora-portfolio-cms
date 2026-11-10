package com.portfolio.auth;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AuthControllerTest {

    @Test
    void shouldReturn401ForInvalidCredentials() {
        AuthService authService = new AuthService(null, null, null) {
            @Override
            public LoginResponse login(LoginRequest request) {
                throw new BadCredentialsException("Invalid credentials");
            }
        };

        AuthController authController = new AuthController(authService);
        LoginRequest request = new LoginRequest("admin@example.com", "wrong-password");
        var response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        @SuppressWarnings("unchecked")
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertEquals("Invalid email or password.", body.get("message"));
    }

    @Test
    void shouldReturn429AndRetryAfterHeaderWhenRateLimited() {
        AuthService authService = new AuthService(null, null, null) {
            @Override
            public LoginResponse login(LoginRequest request) {
                throw new LoginRateLimitException(900);
            }
        };

        AuthController authController = new AuthController(authService);
        LoginRequest request = new LoginRequest("admin@example.com", "password");
        var response = authController.login(request);

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertEquals("900", response.getHeaders().getFirst(HttpHeaders.RETRY_AFTER));
    }
}
