
package com.portfolio.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    // Admin: Create a project
    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        String slug = normalizeSlug(request.slug());

        if (repository.existsBySlug(slug)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Project slug already exists"
            );
        }

        Project project = new Project();
        applyRequest(project, request, slug);

        return ProjectResponse.from(repository.save(project));
    }

    // Admin: Update a project
    @Transactional
    public ProjectResponse update(UUID id, ProjectRequest request) {
        Project project = getProject(id);
        String slug = normalizeSlug(request.slug());

        if (repository.existsBySlugAndIdNot(slug, id)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Project slug already exists"
            );
        }

        applyRequest(project, request, slug);

        return ProjectResponse.from(repository.save(project));
    }

    // Admin: Get all projects with pagination and optional status filter
    @Transactional(readOnly = true)
    public Page<ProjectResponse> getAll(
        ProjectStatus status,
        Pageable pageable
    ) {
        Page<Project> projects = status == null
            ? repository.findAllByOrderByCreatedAtDesc(pageable)
            : repository.findAllByStatusOrderByCreatedAtDesc(
                status,
                pageable
            );

        return projects.map(ProjectResponse::from);
    }

    // Public: Get all published projects
    @Transactional(readOnly = true)
    public List<ProjectResponse> getPublishedProjects() {
        return repository
            .findAllByStatusOrderByCreatedAtDesc(ProjectStatus.PUBLISHED)
            .stream()
            .map(ProjectResponse::from)
            .toList();
    }

    // Public: Get up to six featured published projects
    @Transactional(readOnly = true)
    public List<ProjectResponse> getFeaturedProjects() {
        return repository
            .findTop6ByStatusAndFeaturedTrueOrderByCreatedAtDesc(
                ProjectStatus.PUBLISHED
            )
            .stream()
            .map(ProjectResponse::from)
            .toList();
    }

    // Public: Get a published project by slug
    @Transactional(readOnly = true)
    public ProjectResponse getPublishedProjectBySlug(String slug) {
        return repository.findBySlugAndStatus(
                slug,
                ProjectStatus.PUBLISHED
            )
            .map(ProjectResponse::from)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Project not found"
            ));
    }

    // Admin: Get a project by ID
    @Transactional(readOnly = true)
    public ProjectResponse getById(UUID id) {
        return ProjectResponse.from(getProject(id));
    }

    // Admin: Get a project by slug, regardless of publication status
    @Transactional(readOnly = true)
    public ProjectResponse getBySlug(String slug) {
        return repository.findBySlug(slug)
            .map(ProjectResponse::from)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Project not found"
            ));
    }

    // Admin: Change project publication status
    @Transactional
    public ProjectResponse changeStatus(UUID id, ProjectStatus status) {
        if (status == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Status is required"
            );
        }

        Project project = getProject(id);

        // Copy technologies before update() clears the existing collection.
        var technologies = new LinkedHashSet<>(project.getTechnologies());

        project.update(
            project.getTitle(),
            project.getSlug(),
            project.getShortDescription(),
            project.getFullDescription(),
            project.getCategory(),
            project.getThumbnailUrl(),
            project.getLiveUrl(),
            project.getGithubUrl(),
            project.getStartDate(),
            project.getCompletionDate(),
            project.isFeatured(),
            status,
            technologies
        );

        return ProjectResponse.from(repository.save(project));
    }

    // Admin: Delete a project
    @Transactional
    public void delete(UUID id) {
        Project project = getProject(id);
        repository.delete(project);
    }

    // Internal: Find a project by ID
    private Project getProject(UUID id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Project not found"
            ));
    }

    // Internal: Apply request data to a project
    private void applyRequest(
        Project project,
        ProjectRequest request,
        String slug
    ) {
        ProjectStatus status = request.status() == null
            ? ProjectStatus.DRAFT
            : request.status();

        project.update(
            request.title().trim(),
            slug,
            request.shortDescription().trim(),
            request.fullDescription(),
            request.category(),
            request.thumbnailUrl(),
            request.liveUrl(),
            request.githubUrl(),
            request.startDate(),
            request.completionDate(),
            request.featured(),
            status,
            request.technologies()
        );

        if (request.images() != null) {
            project.replaceImages(
                request.images().stream()
                    .map(image -> new ProjectImage(
                        image.imageUrl(),
                        image.altText(),
                        image.displayOrder()
                    ))
                    .toList()
            );
        }
    }

    // Internal: Normalize project slug
    private String normalizeSlug(String slug) {
        return slug.trim().toLowerCase(Locale.ROOT);
    }
}
