package com.portfolio.auth;

public record LoginResponse(
    String accessToken,
    String tokenType,
    long expiresIn,
    AdminProfileResponse admin
) {}