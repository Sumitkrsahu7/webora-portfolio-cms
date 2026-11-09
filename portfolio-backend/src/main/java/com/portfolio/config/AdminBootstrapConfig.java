package com.portfolio.config;

import com.portfolio.auth.AdminUser;
import com.portfolio.auth.AdminUserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrapConfig {

    private static final Logger log =
        LoggerFactory.getLogger(AdminBootstrapConfig.class);

    @Bean
    ApplicationRunner bootstrapAdmin(
        AdminUserRepository adminUserRepository,
        PasswordEncoder passwordEncoder,

        @Value("${app.bootstrap.enabled:false}")
        boolean bootstrapEnabled,

        @Value("${app.bootstrap.email:}")
        String adminEmail,

        @Value("${app.bootstrap.password:}")
        String adminPassword
    ) {
        return args -> {

            if (!bootstrapEnabled) {
                log.info("Admin bootstrap is disabled.");
                return;
            }

            if (adminUserRepository.count() > 0) {
                log.info("An admin account already exists. Bootstrap skipped.");
                return;
            }

            if (adminEmail == null || adminEmail.isBlank() ||
                adminPassword == null || adminPassword.isBlank()) {

                throw new IllegalStateException(
                    "Bootstrap is enabled, but admin email or password is missing."
                );
            }

            String normalizedEmail =
                adminEmail.trim().toLowerCase();

            if (adminUserRepository.existsByEmail(normalizedEmail)) {
                log.info("Bootstrap admin email already exists. Skipping.");
                return;
            }

            String passwordHash =
                passwordEncoder.encode(adminPassword);

            AdminUser admin =
                new AdminUser(normalizedEmail, passwordHash);

            adminUserRepository.save(admin);

            log.info("Initial admin account created successfully.");
        };
    }
}