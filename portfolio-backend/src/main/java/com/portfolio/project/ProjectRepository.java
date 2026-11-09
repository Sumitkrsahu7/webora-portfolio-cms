
package com.portfolio.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    // Admin: Get all projects with pagination
    Page<Project> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // Admin: Filter projects by status with pagination
    Page<Project> findAllByStatusOrderByCreatedAtDesc(
        ProjectStatus status,
        Pageable pageable
    );

    // Admin: Check whether a slug already exists
    boolean existsBySlug(String slug);

    // Admin: Check whether another project uses this slug
    boolean existsBySlugAndIdNot(String slug, UUID id);

    // Public: Get all published projects
    List<Project> findAllByStatusOrderByCreatedAtDesc(
        ProjectStatus status
    );

    // Public: Get up to six featured published projects
    List<Project> findTop6ByStatusAndFeaturedTrueOrderByCreatedAtDesc(
        ProjectStatus status
    );

    // Public: Find a published project by slug
    Optional<Project> findBySlugAndStatus(
        String slug,
        ProjectStatus status
    );

    // Admin: Find a project by slug regardless of publication status
    Optional<Project> findBySlug(String slug);
}
