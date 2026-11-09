
package com.portfolio.project;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "project_images")
public class ProjectImage {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(
        name = "image_url",
        nullable = false,
        columnDefinition = "nvarchar(max)"
    )
    private String imageUrl;

    @Column(name = "alt_text", length = 200)
    private String altText;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    protected ProjectImage() {
    }

    public ProjectImage(
        String imageUrl,
        String altText,
        int displayOrder
    ) {
        this.id = UUID.randomUUID();
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.displayOrder = displayOrder;
    }

    void setProject(Project project) {
        this.project = project;
    }

    public UUID getId() {
        return id;
    }

    public Project getProject() {
        return project;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getAltText() {
        return altText;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }
}
