package com.portfolio.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

/**
 * Spring Security principal carrying the administrator's current tokenVersion
 * so stateless JWTs can be invalidated server-side on explicit logout.
 */
public class AdminPrincipal extends User {

    private final int tokenVersion;

    public AdminPrincipal(
        String username,
        String password,
        boolean enabled,
        int tokenVersion,
        Collection<? extends GrantedAuthority> authorities
    ) {
        super(username, password, enabled, true, true, true, authorities);
        this.tokenVersion = tokenVersion;
    }

    public int getTokenVersion() {
        return tokenVersion;
    }
}
