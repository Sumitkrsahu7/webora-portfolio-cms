package com.portfolio.config;

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
    void shouldSetCacheHeaderEvenWhenControllerWritesAndFlushesBody() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/projects");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, (req, res) -> {
            res.setContentType("application/json");
            res.getWriter().write("[{\"title\":\"Webora\"}]");
            res.flushBuffer();
        });

        assertEquals(
            "public, max-age=60, stale-while-revalidate=300",
            response.getHeader("Cache-Control")
        );
        assertEquals("[{\"title\":\"Webora\"}]", response.getContentAsString());
    }

    @Test
    void shouldNotSetCacheHeaderFor404NotFound() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/projects/non-existent-slug");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, (req, res) -> {
            ((jakarta.servlet.http.HttpServletResponse) res).setStatus(404);
        });

        assertNull(response.getHeader("Cache-Control"));
    }

    @Test
    void shouldNotSetCacheHeaderFor500ServerError() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/projects");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilterInternal(request, response, (req, res) -> {
            ((jakarta.servlet.http.HttpServletResponse) res).setStatus(500);
        });

        assertNull(response.getHeader("Cache-Control"));
    }

    @Test
    void shouldNotSetCacheHeaderForNonPublicOrAuthEndpoints() throws ServletException, IOException {
        MockHttpServletRequest adminReq = new MockHttpServletRequest("GET", "/api/admin/services");
        MockHttpServletResponse adminRes = new MockHttpServletResponse();
        adminRes.setStatus(200);
        filter.doFilterInternal(adminReq, adminRes, (req, res) -> {});
        assertNull(adminRes.getHeader("Cache-Control"));

        MockHttpServletRequest authReq = new MockHttpServletRequest("GET", "/api/auth/logout");
        MockHttpServletResponse authRes = new MockHttpServletResponse();
        authRes.setStatus(200);
        filter.doFilterInternal(authReq, authRes, (req, res) -> {});
        assertNull(authRes.getHeader("Cache-Control"));
    }

    @Test
    void shouldNotSetCacheHeaderForUploadEndpoints() throws ServletException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest("GET", "/api/public/uploads/hero-banner.jpg");
        MockHttpServletResponse response = new MockHttpServletResponse();
        response.setStatus(200);
        response.setHeader("Cache-Control", "max-age=604800, public");

        filter.doFilterInternal(request, response, (req, res) -> {});

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
