
package com.portfolio.project;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, unique = true, length = 180)
    private String slug;

    @Column(name = "short_description", nullable = false, length = 320)
    private String shortDescription;

    @Column(name = "full_description", columnDefinition = "nvarchar(max)")
    private String fullDescription;

    @Column(length = 255)
    private String category;

    @Column(name = "thumbnail_url", columnDefinition = "nvarchar(max)")
    private String thumbnailUrl;

    @Column(name = "live_url", columnDefinition = "nvarchar(max)")
    private String liveUrl;

    @Column(name = "github_url", columnDefinition = "nvarchar(max)")
    private String githubUrl;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "completion_date")
    private LocalDate completionDate;

    @Column(nullable = false)
    private boolean featured = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectStatus status = ProjectStatus.DRAFT;

    @ElementCollection
    @CollectionTable(
        name = "project_technologies",
        joinColumns = @JoinColumn(name = "project_id")
    )
    @Column(name = "technology", nullable = false, length = 255)
    private Set<String> technologies = new LinkedHashSet<>();

    @OneToMany(
        mappedBy = "project",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    @OrderBy("displayOrder ASC")
    private List<ProjectImage> images = new ArrayList<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Project() {
    }

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID();
        }

        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public void update(
        String title,
        String slug,
        String shortDescription,
        String fullDescription,
        String category,
        String thumbnailUrl,
        String liveUrl,
        String githubUrl,
        LocalDate startDate,
        LocalDate completionDate,
        boolean featured,
        ProjectStatus status,
        Set<String> technologies
    ) {
        this.title = title;
        this.slug = slug;
        this.shortDescription = shortDescription;
        this.fullDescription = fullDescription;
        this.category = category;
        this.thumbnailUrl = thumbnailUrl;
        this.liveUrl = liveUrl;
        this.githubUrl = githubUrl;
        this.startDate = startDate;
        this.completionDate = completionDate;
        this.featured = featured;
        this.status = status;

        this.technologies.clear();

        if (technologies != null) {
            this.technologies.addAll(technologies);
        }
    }

    public void addImage(ProjectImage image) {
        images.add(image);
        image.setProject(this);
    }

    public void removeImage(ProjectImage image) {
        images.remove(image);
        image.setProject(null);
    }

    public void replaceImages(List<ProjectImage> newImages) {
        images.clear();

        if (newImages != null) {
            newImages.forEach(this::addImage);
        }
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSlug() {
        return slug;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public String getFullDescription() {
        return fullDescription;
    }

    public String getCategory() {
        return category;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public String getLiveUrl() {
        return liveUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getCompletionDate() {
        return completionDate;
    }

    public boolean isFeatured() {
        return featured;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public Set<String> getTechnologies() {
        return technologies;
    }

    public List<ProjectImage> getImages() {
        return images;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
