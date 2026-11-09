package com.portfolio.auth;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @GetMapping("/me")
    public AdminProfileResponse getCurrentAdmin(
        Authentication authentication
    ) {
        String email = authentication.getName();

        String role = authentication.getAuthorities()
            .iterator()
            .next()
            .getAuthority()
            .replace("ROLE_", "");

        return new AdminProfileResponse(email, role);
    }
}