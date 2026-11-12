package com.portfolio.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    // Public: Lightweight list query excluding fullDescription LOB & collection joins
    @Query("""
        select
            p.id as id,
            p.title as title,
            p.slug as slug,
            p.shortDescription as shortDescription,
            p.category as category,
            p.thumbnailUrl as thumbnailUrl,
            p.liveUrl as liveUrl,
            p.githubUrl as githubUrl,
            p.startDate as startDate,
            p.completionDate as completionDate,
            p.featured as featured,
            p.status as status,
            p.createdAt as createdAt,
            p.updatedAt as updatedAt
        from Project p
        where p.status = :status
        order by p.createdAt desc
    """)
    List<ProjectSummaryProjection> findSummaryByStatus(
        @Param("status") ProjectStatus status
    );

    // Public: Lightweight featured query using SQL paging without collection join multiplication
    @Query("""
        select
            p.id as id,
            p.title as title,
            p.slug as slug,
            p.shortDescription as shortDescription,
            p.category as category,
            p.thumbnailUrl as thumbnailUrl,
            p.liveUrl as liveUrl,
            p.githubUrl as githubUrl,
            p.startDate as startDate,
            p.completionDate as completionDate,
            p.featured as featured,
            p.status as status,
            p.createdAt as createdAt,
            p.updatedAt as updatedAt
        from Project p
        where p.status = :status and p.featured = true
        order by p.createdAt desc
    """)
    List<ProjectSummaryProjection> findFeaturedSummaryByStatus(
        @Param("status") ProjectStatus status,
        Pageable pageable
    );

    // Public: Batch fetch technology tags in 1 query for summary rows
    @Query("select p.id, t from Project p join p.technologies t where p.id in :ids")
    List<Object[]> findTechnologiesByProjectIds(@Param("ids") List<UUID> ids);

    // Public: Find a published project by slug with eager technologies join
    @EntityGraph(attributePaths = {"technologies"})
    Optional<Project> findBySlugAndStatus(
        String slug,
        ProjectStatus status
    );

    // Admin: Find a project by slug regardless of publication status
    @EntityGraph(attributePaths = {"technologies"})
    Optional<Project> findBySlug(String slug);
}
