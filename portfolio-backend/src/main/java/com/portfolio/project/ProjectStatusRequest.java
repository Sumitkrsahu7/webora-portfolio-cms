
package com.portfolio.project;

import jakarta.validation.constraints.NotNull;

public record ProjectStatusRequest(
    @NotNull ProjectStatus status
) {
}
