package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String company;

    @Column(name = "company_url", columnDefinition = "nvarchar(max)")
    private String companyUrl;

    @Column(name = "role_title", nullable = false, length = 160)
    private String roleTitle;

    @Column(length = 160)
    private String location;

    @Column(name = "role_type", nullable = false, length = 50)
    private String roleType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "current_role", nullable = false)
    private boolean currentRole;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String description;

    @Column(columnDefinition = "nvarchar(max)")
    private String technologies;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Experience() {}

    public static Experience create(UUID id, ExperienceRequest request) {
        Experience item = new Experience();
        item.id = id;
        item.createdAt = Instant.now();
        item.update(request);
        return item;
    }

    public void update(ExperienceRequest request) {
        this.company = request.company().trim();
        this.companyUrl = request.companyUrl() != null && !request.companyUrl().isBlank()
            ? request.companyUrl().trim()
            : null;
        this.roleTitle = request.roleTitle().trim();
        this.location = request.location() != null && !request.location().isBlank()
            ? request.location().trim()
            : null;
        this.roleType = request.roleType() != null && !request.roleType().isBlank()
            ? request.roleType().trim()
            : "FULL_TIME";
        this.startDate = request.startDate();
        this.currentRole = request.currentRole();
        this.endDate = this.currentRole ? null : request.endDate();
        this.description = request.description().trim();
        this.technologies = request.technologies() != null && !request.technologies().isBlank()
            ? request.technologies().trim()
            : null;
        this.displayOrder = request.displayOrder();
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getCompany() { return company; }
    public String getCompanyUrl() { return companyUrl; }
    public String getRoleTitle() { return roleTitle; }
    public String getLocation() { return location; }
    public String getRoleType() { return roleType; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public boolean isCurrentRole() { return currentRole; }
    public String getDescription() { return description; }
    public String getTechnologies() { return technologies; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
