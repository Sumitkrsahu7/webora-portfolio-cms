package com.portfolio.auth;

public record AdminProfileResponse(
    String email,
    String role
) {}