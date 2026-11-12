package com.portfolio.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;

/**
 * Filter that applies HTTP Cache-Control headers to successful public GET endpoints.
 * Buffers eligible non-upload /api/public/** GET responses before committing so
 * Cache-Control headers are applied prior to response commit/flush.
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

        String path = request.getRequestURI();
        boolean eligibleForCaching =
            "GET".equalsIgnoreCase(request.getMethod()) &&
            path != null &&
            path.startsWith("/api/public/") &&
            !path.startsWith("/api/public/uploads/");

        if (!eligibleForCaching) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingResponseWrapper wrappedResponse =
            response instanceof ContentCachingResponseWrapper existing
                ? existing
                : new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(request, wrappedResponse);

            int status = wrappedResponse.getStatus();
            if (status >= 200 && status < 300) {
                wrappedResponse.setHeader("Cache-Control", PUBLIC_CACHE_HEADER);
                wrappedResponse.setHeader("Pragma", "");
                wrappedResponse.setHeader("Expires", "");
            }
        } finally {
            wrappedResponse.copyBodyToResponse();
        }
    }
}
