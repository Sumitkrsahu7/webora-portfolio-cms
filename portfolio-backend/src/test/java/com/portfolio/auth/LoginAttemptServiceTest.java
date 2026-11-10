package com.portfolio.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoginAttemptServiceTest {

    private LoginAttemptService service;

    @BeforeEach
    void setUp() {
        service = new LoginAttemptService();
    }

    @Test
    void shouldAllowAttemptsBeforeFiveFailures() {
        String email = "admin@example.com";

        for (int i = 0; i < 4; i++) {
            service.recordFailure(email);
        }

        assertEquals(0, service.getRetryAfterSeconds(email));
    }

    @Test
    void shouldBlockAfterFiveFailedAttempts() {
        String email = "admin@example.com";

        for (int i = 0; i < 5; i++) {
            service.recordFailure(email);
        }

        assertTrue(service.getRetryAfterSeconds(email) > 0);
    }

    @Test
    void shouldResetAttemptsAfterSuccessfulLogin() {
        String email = "admin@example.com";

        for (int i = 0; i < 5; i++) {
            service.recordFailure(email);
        }

        service.reset(email);

        assertEquals(0, service.getRetryAfterSeconds(email));
    }

    @Test
    void shouldTrackDifferentEmailsIndependently() {
        String firstEmail = "admin1@example.com";
        String secondEmail = "admin2@example.com";

        for (int i = 0; i < 5; i++) {
            service.recordFailure(firstEmail);
        }

        assertTrue(service.getRetryAfterSeconds(firstEmail) > 0);
        assertEquals(0, service.getRetryAfterSeconds(secondEmail));
    }
}