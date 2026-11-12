package com.portfolio.auth;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.lang.reflect.Proxy;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenRevocationTest {

    private static final String TEST_SECRET = Base64.getEncoder()
        .encodeToString("0123456789abcdef0123456789abcdef".getBytes(StandardCharsets.UTF_8));

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldInvalidateIssuedJwtWhenTokenVersionIncrementsOnLogout() throws Exception {
        JwtService jwtService = new JwtService(TEST_SECRET, 900_000L);
        AdminUser admin = new AdminUser("super@webora.dev", "$2a$10$hash");
        assertEquals(0, admin.getTokenVersion());

        AtomicInteger saveCalls = new AtomicInteger();
        AdminUserRepository repository = (AdminUserRepository) Proxy.newProxyInstance(
            AdminUserRepository.class.getClassLoader(),
            new Class<?>[]{AdminUserRepository.class},
            (proxy, method, args) -> {
                if ("findByEmail".equals(method.getName()) && args != null && "super@webora.dev".equals(args[0])) {
                    return Optional.of(admin);
                }
                if ("save".equals(method.getName()) && args != null) {
                    saveCalls.incrementAndGet();
                    return args[0];
                }
                throw new UnsupportedOperationException("Unexpected call: " + method.getName());
            }
        );

        UserDetailsService uds = new AdminUserDetailsService(repository);
        AdminPrincipal initialPrincipal = (AdminPrincipal) uds.loadUserByUsername("super@webora.dev");
        String jwt = jwtService.generateToken(initialPrincipal);

        // Before logout: valid JWT authenticates cleanly
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, uds);
        MockHttpServletRequest req1 = new MockHttpServletRequest("GET", "/api/admin/me");
        req1.addHeader("Authorization", "Bearer " + jwt);
        FilterChain noopChain = (req, res) -> {};
        filter.doFilter(req1, new MockHttpServletResponse(), noopChain);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals("super@webora.dev", SecurityContextHolder.getContext().getAuthentication().getName());

        // Logout increments tokenVersion
        SecurityContextHolder.clearContext();
        AuthService authService = new AuthService(null, jwtService, new LoginAttemptService(), repository);
        authService.logout("super@webora.dev");

        assertEquals(1, admin.getTokenVersion());
        assertEquals(1, saveCalls.get());

        // After logout: previously issued JWT is rejected by filter
        MockHttpServletRequest req2 = new MockHttpServletRequest("GET", "/api/admin/me");
        req2.addHeader("Authorization", "Bearer " + jwt);
        filter.doFilter(req2, new MockHttpServletResponse(), noopChain);

        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void shouldIncludeTokenVersionClaimForAdminAndSuperAdmin() {
        JwtService jwtService = new JwtService(TEST_SECRET, 900_000L);
        AdminPrincipal admin = new AdminPrincipal(
            "admin@webora.dev",
            "hash",
            true,
            3,
            List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        String token = jwtService.generateToken(admin);
        assertEquals(3, jwtService.extractTokenVersion(token));
        assertTrue(jwtService.isTokenValid(token, admin));

        AdminPrincipal staleCopy = new AdminPrincipal(
            "admin@webora.dev",
            "hash",
            true,
            4,
            List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        assertFalse(jwtService.isTokenValid(token, staleCopy));
    }
}
