package com.portfolio.auth;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    public AdminUserDetailsService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        AdminUser admin = adminUserRepository.findByEmail(
            email.trim().toLowerCase()
        ).orElseThrow(() ->
            new UsernameNotFoundException("Admin account not found")
        );

        return new AdminPrincipal(
            admin.getEmail(),
            admin.getPasswordHash(),
            admin.isEnabled(),
            admin.getTokenVersion(),
            List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole()))
        );
    }
}