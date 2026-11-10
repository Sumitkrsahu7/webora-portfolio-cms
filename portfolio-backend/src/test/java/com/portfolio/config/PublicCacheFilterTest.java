package com.portfolio.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class PublicCacheFilterTest {

    private PublicCacheFilter filter;

    @BeforeEach
    void setUp() {
        filter = new PublicCacheFilter();
    }

    @Test
    void shouldSetCacheHeaderForSuccessfulPublicGetEndpoints() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/services");
        MockHttpServletResponse response = new MockHttpServletResponse();
        response.setStatus(200);

        filter.doFilterInternal(request, response, (req, res) -> {});

        assertEquals(
            "public, max-age=60, stale-while-revalidate=300",
            response.getHeader("Cache-Control")
        );
    }

    @Test
    void shouldNotSetCacheHeaderFor404NotFound() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/projects/non-existent-slug");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, (req, res) -> {
            ((MockHttpServletResponse) res).setStatus(404);
        });

        assertNotEquals(
            "public, max-age=60, stale-while-revalidate=300",
            response.getHeader("Cache-Control")
        );
        assertNull(response.getHeader("Cache-Control"));
    }

    @Test
    void shouldNotSetCacheHeaderFor500ServerError() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/projects");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, (req, res) -> {
            ((MockHttpServletResponse) res).setStatus(500);
        });

        assertNotEquals(
            "public, max-age=60, stale-while-revalidate=300",
            response.getHeader("Cache-Control")
        );
        assertNull(response.getHeader("Cache-Control"));
    }

    @Test
    void shouldNotSetCacheHeaderForNonPublicEndpoints() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/admin/services");
        MockHttpServletResponse response = new MockHttpServletResponse();
        response.setStatus(200);

        filter.doFilterInternal(request, response, (req, res) -> {});

        assertNull(response.getHeader("Cache-Control"));
    }

    @Test
    void shouldNotSetCacheHeaderForUploadEndpoints() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/uploads/hero-banner.jpg");
        MockHttpServletResponse response = new MockHttpServletResponse();
        response.setStatus(200);
        response.setHeader("Cache-Control", "max-age=604800, public");

        filter.doFilterInternal(request, response, (req, res) -> {});

        // Must retain its own 7-day upload cache header and not be overwritten
        assertEquals("max-age=604800, public", response.getHeader("Cache-Control"));
    }

    @Test
    void shouldNotSetCacheHeaderForPostRequests() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", "/api/public/inquiries");
        MockHttpServletResponse response = new MockHttpServletResponse();
        response.setStatus(201);

        filter.doFilterInternal(request, response, (req, res) -> {});

        assertNull(response.getHeader("Cache-Control"));
    }
}
