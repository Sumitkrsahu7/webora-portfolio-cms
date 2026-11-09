package com.portfolio.auth;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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

        return User.builder()
            .username(admin.getEmail())
            .password(admin.getPasswordHash())
            .roles(admin.getRole())
            .disabled(!admin.isEnabled())
            .build();
    }
}