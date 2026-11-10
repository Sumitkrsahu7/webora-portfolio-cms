package com.portfolio.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter that applies HTTP Cache-Control headers to successful public GET endpoints.
 * Only HTTP 2xx responses under /api/public/ (excluding /api/public/uploads/) receive
 * the public cache header. Error responses (4xx, 5xx), non-GET methods, and non-public
 * endpoints remain un-cached or preserve their own controller-level caching.
 */
public class PublicCacheFilter extends OncePerRequestFilter {

    public static final String PUBLIC_CACHE_HEADER =
        "public, max-age=60, stale-while-revalidate=300";

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        filterChain.doFilter(request, response);

        if (response.isCommitted()) {
            return;
        }

        int status = response.getStatus();
        String path = request.getRequestURI();

        if (status >= 200 && status < 300 &&
            "GET".equalsIgnoreCase(request.getMethod()) &&
            path != null &&
            path.startsWith("/api/public/") &&
            !path.startsWith("/api/public/uploads/")) {

            response.setHeader("Cache-Control", PUBLIC_CACHE_HEADER);
            response.setHeader("Pragma", "");
            response.setHeader("Expires", "");
        }
    }
}
