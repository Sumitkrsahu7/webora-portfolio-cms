package com.portfolio.auth;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void shouldReturn401ForInvalidCredentials() {
        LoginRequest request = new LoginRequest("admin@example.com", "wrong-password");

        when(authService.login(request))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        var response = authController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Invalid email or password.", response.getBody().toString()
                .replace("{message=", "").replace("}", "").trim());
    }

    @Test
    void shouldReturn429AndRetryAfterHeaderWhenRateLimited() {
        LoginRequest request = new LoginRequest("admin@example.com", "password");

        when(authService.login(request))
                .thenThrow(new LoginRateLimitException(900));

        var response = authController.login(request);

        assertEquals(HttpStatus.TOO_MANY_REQUESTS, response.getStatusCode());
        assertEquals("900", response.getHeaders().getFirst(HttpHeaders.RETRY_AFTER));
    }
}