package com.portfolio.content;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inquiries")
public class Inquiry {

    @Id
    private UUID id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 255)
    private String subject;

    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String message;

    @Column(name = "inquiry_type", nullable = false, length = 30)
    private String inquiryType = "GENERAL";

    @Column(length = 40)
    private String phone;

    @Column(name = "company_name", length = 160)
    private String companyName;

    @Column(name = "project_category", length = 120)
    private String projectCategory;

    @Column(name = "selected_package", length = 160)
    private String selectedPackage;

    @Column(name = "budget_range", length = 120)
    private String budgetRange;

    @Column(name = "target_timeline", length = 120)
    private String targetTimeline;

    @Column(name = "project_requirements", columnDefinition = "nvarchar(max)")
    private String projectRequirements;

    @Column(name = "website_or_reference_url", length = 1024)
    private String websiteOrReferenceUrl;

    @Column(name = "preferred_contact_method", length = 40)
    private String preferredContactMethod;

    @Column(name = "internal_notes", columnDefinition = "nvarchar(max)")
    private String internalNotes;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Inquiry() {}

    public static Inquiry create(UUID id, InquiryRequest request) {
        Inquiry inquiry = new Inquiry();
        inquiry.id = id;
        inquiry.name = request.name().trim();
        inquiry.email = request.email().trim();
        String type = isBlank(request.inquiryType()) ? "GENERAL" : request.inquiryType().trim().toUpperCase();
        inquiry.inquiryType = type;

        String rawSubject = trimToNull(request.subject());
        if (rawSubject == null && "QUOTE".equals(type)) {
            String topic = trimToNull(request.selectedPackage());
            if (topic == null) {
                topic = trimToNull(request.projectCategory());
            }
            rawSubject = topic != null ? "Quote Request: " + topic : "Quote Request";
        }
        if (rawSubject != null && rawSubject.length() > 255) {
            rawSubject = rawSubject.substring(0, 255);
        }
        inquiry.subject = rawSubject;

        String requirements = trimToNull(request.projectRequirements());
        String bodyMessage = trimToNull(request.message());
        inquiry.message = bodyMessage != null ? bodyMessage : (requirements != null ? requirements : "");
        inquiry.phone = trimToNull(request.phone());
        inquiry.companyName = trimToNull(request.companyName());
        inquiry.projectCategory = trimToNull(request.projectCategory());
        inquiry.selectedPackage = trimToNull(request.selectedPackage());
        inquiry.budgetRange = trimToNull(request.budgetRange());
        inquiry.targetTimeline = trimToNull(request.targetTimeline());
        inquiry.projectRequirements = requirements;
        inquiry.websiteOrReferenceUrl = trimToNull(request.websiteOrReferenceUrl());
        inquiry.preferredContactMethod = isBlank(request.preferredContactMethod())
            ? null
            : request.preferredContactMethod().trim().toUpperCase();
        inquiry.internalNotes = null;
        inquiry.status = "NEW";
        inquiry.createdAt = Instant.now();
        inquiry.updatedAt = Instant.now();
        return inquiry;
    }

    public void updateStatus(String status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public void updateInternalNotes(String internalNotes) {
        this.internalNotes = trimToNull(internalNotes);
        this.updatedAt = Instant.now();
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private static String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }
    public String getInquiryType() { return inquiryType; }
    public String getPhone() { return phone; }
    public String getCompanyName() { return companyName; }
    public String getProjectCategory() { return projectCategory; }
    public String getSelectedPackage() { return selectedPackage; }
    public String getBudgetRange() { return budgetRange; }
    public String getTargetTimeline() { return targetTimeline; }
    public String getProjectRequirements() { return projectRequirements; }
    public String getWebsiteOrReferenceUrl() { return websiteOrReferenceUrl; }
    public String getPreferredContactMethod() { return preferredContactMethod; }
    public String getInternalNotes() { return internalNotes; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
