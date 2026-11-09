package com.portfolio.auth;

import jakarta.validation.constraints.NotNull;

public record UpdateAdministratorStatusRequest(
    @NotNull
    Boolean enabled
) {}