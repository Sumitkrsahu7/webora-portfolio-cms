
package com.portfolio.project;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/projects")
public class PublicProjectController {

    private final ProjectService projectService;

    public PublicProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Public: Get all published projects
    @GetMapping
    public List<ProjectResponse> all() {
        return projectService.getPublishedProjects();
    }

    // Public: Get featured published projects
    @GetMapping("/featured")
    public List<ProjectResponse> featured() {
        return projectService.getFeaturedProjects();
    }

    // Public: Get a published project by slug
    @GetMapping("/{slug}")
    public ProjectResponse bySlug(@PathVariable String slug) {
        return projectService.getPublishedProjectBySlug(slug);
    }
}
