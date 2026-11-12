package com.portfolio.project;

import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageRequest;

import java.lang.reflect.Proxy;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class ProjectServiceTest {

    @Test
    void getFeaturedProjectsUsesSqlPageableOfSixAndSingleBatchTechQuery() {
        UUID id = UUID.randomUUID();
        ProjectSummaryProjection row = projection(id, "Webora Commerce", "webora-commerce", true);
        List<String> calls = new ArrayList<>();

        ProjectRepository repository = (ProjectRepository) Proxy.newProxyInstance(
            ProjectRepository.class.getClassLoader(),
            new Class<?>[]{ProjectRepository.class},
            (proxy, method, args) -> {
                calls.add(method.getName());
                if ("findFeaturedSummaryByStatus".equals(method.getName())) {
                    assertEquals(ProjectStatus.PUBLISHED, args[0]);
                    assertEquals(PageRequest.of(0, 6), args[1]);
                    return List.of(row);
                }
                if ("findTechnologiesByProjectIds".equals(method.getName())) {
                    assertEquals(List.of(id), args[0]);
                    return List.of(
                        new Object[]{id, "Java 21"},
                        new Object[]{id, "Spring Boot"}
                    );
                }
                throw new UnsupportedOperationException("Unexpected call: " + method.getName());
            }
        );

        ProjectService service = new ProjectService(repository);
        List<ProjectResponse> result = service.getFeaturedProjects();

        assertEquals(1, result.size());
        assertEquals("Webora Commerce", result.get(0).title());
        assertNull(result.get(0).fullDescription());
        assertTrue(result.get(0).images().isEmpty());
        assertEquals(Set.of("Java 21", "Spring Boot"), result.get(0).technologies());
        assertEquals(List.of("findFeaturedSummaryByStatus", "findTechnologiesByProjectIds"), calls);
    }

    @Test
    void getPublishedProjectsSkipsTechQueryWhenEmpty() {
        List<String> calls = new ArrayList<>();
        ProjectRepository repository = (ProjectRepository) Proxy.newProxyInstance(
            ProjectRepository.class.getClassLoader(),
            new Class<?>[]{ProjectRepository.class},
            (proxy, method, args) -> {
                calls.add(method.getName());
                if ("findSummaryByStatus".equals(method.getName())) {
                    assertEquals(ProjectStatus.PUBLISHED, args[0]);
                    return List.of();
                }
                throw new UnsupportedOperationException("Unexpected call: " + method.getName());
            }
        );

        ProjectService service = new ProjectService(repository);
        List<ProjectResponse> result = service.getPublishedProjects();

        assertTrue(result.isEmpty());
        assertEquals(List.of("findSummaryByStatus"), calls);
    }

    private ProjectSummaryProjection projection(UUID id, String title, String slug, boolean featured) {
        Instant now = Instant.now();
        return new ProjectSummaryProjection() {
            @Override public UUID getId() { return id; }
            @Override public String getTitle() { return title; }
            @Override public String getSlug() { return slug; }
            @Override public String getShortDescription() { return "Short summary"; }
            @Override public String getCategory() { return "Web App"; }
            @Override public String getThumbnailUrl() { return "https://res.cloudinary.com/demo/image/upload/v1/a.jpg"; }
            @Override public String getLiveUrl() { return "https://webora.example"; }
            @Override public String getGithubUrl() { return null; }
            @Override public LocalDate getStartDate() { return LocalDate.of(2025, 1, 1); }
            @Override public LocalDate getCompletionDate() { return LocalDate.of(2025, 3, 1); }
            @Override public boolean isFeatured() { return featured; }
            @Override public ProjectStatus getStatus() { return ProjectStatus.PUBLISHED; }
            @Override public Instant getCreatedAt() { return now; }
            @Override public Instant getUpdatedAt() { return now; }
        };
    }
}
