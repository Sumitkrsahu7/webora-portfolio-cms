package com.portfolio.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.net.URI;

/**
 * Validates optional URL fields: allows null/blank, safe relative paths (if enabled),
 * or absolute http:// / https:// URIs with a host, blocking javascript:/data:/vbscript:.
 */
public class OptionalSafeUrlValidator implements ConstraintValidator<OptionalSafeUrl, String> {

    private boolean allowRelative;

    @Override
    public void initialize(OptionalSafeUrl constraintAnnotation) {
        this.allowRelative = constraintAnnotation.allowRelative();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        String trimmed = value.trim();
        if (trimmed.contains("\r") || trimmed.contains("\n") || trimmed.contains(" ")) {
            return false;
        }

        if (allowRelative && trimmed.startsWith("/") && !trimmed.startsWith("//")) {
            return true;
        }

        try {
            URI uri = URI.create(trimmed);
            String scheme = uri.getScheme();
            String host = uri.getHost();
            return scheme != null
                && (scheme.equalsIgnoreCase("http") || scheme.equalsIgnoreCase("https"))
                && host != null
                && !host.isBlank();
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }
}
