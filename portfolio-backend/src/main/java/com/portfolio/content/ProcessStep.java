package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "process_steps")
public class ProcessStep {

    @Id
    private UUID id;

    @Column(name = "step_number", nullable = false)
    private int stepNumber;

    @Column(nullable = false, length = 160)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "deliverable_hint", length = 255)
    private String deliverableHint;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ProcessStep() {}

    public static ProcessStep create(UUID id, ProcessStepRequest request) {
        ProcessStep step = new ProcessStep();
        step.id = id;
        step.createdAt = Instant.now();
        step.update(request);
        return step;
    }

    public void update(ProcessStepRequest request) {
        this.stepNumber = request.stepNumber();
        this.title = request.title().trim();
        this.description = request.description().trim();
        this.deliverableHint = request.deliverableHint() != null ? request.deliverableHint().trim() : null;
        this.published = request.published();
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public int getStepNumber() { return stepNumber; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getDeliverableHint() { return deliverableHint; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
