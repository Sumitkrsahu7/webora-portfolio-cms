package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    private UUID id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(length = 120)
    private String category;

    private Integer proficiency;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Skill() {}

    public static Skill create(UUID id, SkillRequest request) {
        Skill skill = new Skill();
        skill.id = id;
        skill.createdAt = Instant.now();
        skill.update(request);
        return skill;
    }

    public void update(SkillRequest request) {
        this.name = request.name().trim();
        this.category = request.category();
        this.proficiency = request.proficiency();
        this.displayOrder = request.displayOrder();
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public Integer getProficiency() { return proficiency; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}