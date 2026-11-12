package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "faqs")
public class Faq {

    @Id
    private UUID id;

    @Column(nullable = false, length = 300)
    private String question;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String answer;

    @Column(nullable = false, length = 80)
    private String category;

    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    @Column(nullable = false)
    private boolean published;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Faq() {}

    public static Faq create(UUID id, FaqRequest request) {
        Faq faq = new Faq();
        faq.id = id;
        faq.apply(request);
        faq.createdAt = Instant.now();
        faq.updatedAt = Instant.now();
        return faq;
    }

    public void update(FaqRequest request) {
        apply(request);
        this.updatedAt = Instant.now();
    }

    private void apply(FaqRequest request) {
        this.question = request.question().trim();
        this.answer = request.answer().trim();
        this.category = (request.category() == null || request.category().isBlank())
            ? "General"
            : request.category().trim();
        this.displayOrder = request.displayOrder();
        this.published = request.published();
    }

    public UUID getId() { return id; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public String getCategory() { return category; }
    public int getDisplayOrder() { return displayOrder; }
    public boolean isPublished() { return published; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
