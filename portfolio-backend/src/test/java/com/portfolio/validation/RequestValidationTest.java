package com.portfolio.validation;

import com.portfolio.content.InquiryRequest;
import com.portfolio.content.ServiceRequest;
import com.portfolio.content.SiteProfileRequest;
import com.portfolio.content.TestimonialRequest;
import com.portfolio.project.ProjectImageRequest;
import com.portfolio.project.ProjectRequest;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

class RequestValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        factory.close();
    }

    private void assertInvalid(Object request) {
        assertFalse(
            validator.validate(request).isEmpty(),
            "Expected validation errors for " + request.getClass().getSimpleName()
        );
    }

    private void assertValid(Object request) {
        assertTrue(
            validator.validate(request).isEmpty(),
            "Expected no validation errors for " + request.getClass().getSimpleName()
        );
    }

    private ProjectRequest project(
        String fullDescription,
        String category,
        String thumbnailUrl,
        Set<String> technologies,
        List<ProjectImageRequest> images
    ) {
        return new ProjectRequest(
            "Portfolio Project",
            "portfolio-project",
            "A valid short description",
            fullDescription,
            category,
            thumbnailUrl,
            null,
            null,
            null,
            null,
            false,
            null,
            technologies,
            images
        );
    }

    @Test
    void inquiryMessageAcceptsMaximumLength() {
        assertValid(new InquiryRequest(
            "Test User",
            "test@example.com",
            "Test subject",
            "x".repeat(10000)
        ));
    }

    @Test
    void inquiryMessageRejectsExcessiveLength() {
        assertInvalid(new InquiryRequest(
            "Test User",
            "test@example.com",
            "Test subject",
            "x".repeat(10001)
        ));
    }

    @Test
    void serviceDescriptionRejectsExcessiveLength() {
        assertInvalid(new ServiceRequest(
            "Web Development",
            "x".repeat(10001),
            "code",
            1,
            true
        ));
    }

    @Test
    void profileBioRejectsExcessiveLength() {
        assertInvalid(new SiteProfileRequest(
            "Test User",
            "Software Developer",
            "x".repeat(20001),
            "test@example.com",
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ));
    }

    @Test
    void profileUrlRejectsExcessiveLength() {
        assertInvalid(new SiteProfileRequest(
            "Test User",
            null,
            null,
            null,
            null,
            null,
            "x".repeat(2049),
            null,
            null,
            null,
            null
        ));
    }

    @Test
    void testimonialContentRejectsExcessiveLength() {
        assertInvalid(new TestimonialRequest(
            "Test User",
            "Developer",
            "Example Company",
            "x".repeat(5001),
            null,
            1,
            true
        ));
    }

    @Test
    void projectDescriptionAcceptsMaximumLength() {
        assertValid(project(
            "x".repeat(50000),
            "Web",
            null,
            Set.of("Java", "Spring Boot"),
            List.of(new ProjectImageRequest(
                "https://example.com/image.png",
                "Project image",
                1
            ))
        ));
    }

    @Test
    void projectDescriptionRejectsExcessiveLength() {
        assertInvalid(project(
            "x".repeat(50001),
            "Web",
            null,
            Set.of(),
            List.of()
        ));
    }

    @Test
    void projectCategoryRejectsExcessiveLength() {
        assertInvalid(project(
            null,
            "x".repeat(256),
            null,
            Set.of(),
            List.of()
        ));
    }

    @Test
    void projectUrlRejectsExcessiveLength() {
        assertInvalid(project(
            null,
            null,
            "x".repeat(2049),
            Set.of(),
            List.of()
        ));
    }

    @Test
    void projectRejectsMoreThanThirtyTechnologies() {
        Set<String> technologies = IntStream.range(0, 31)
            .mapToObj(i -> "Technology-" + i)
            .collect(LinkedHashSet::new, Set::add, Set::addAll);

        assertInvalid(project(null, null, null, technologies, List.of()));
    }

    @Test
    void projectRejectsTechnologyEntryLongerThan255Characters() {
        assertInvalid(project(
            null,
            null,
            null,
            Set.of("x".repeat(256)),
            List.of()
        ));
    }

    @Test
    void projectRejectsMoreThanTenImages() {
        List<ProjectImageRequest> images = new ArrayList<>();

        for (int i = 0; i < 11; i++) {
            images.add(new ProjectImageRequest(
                "https://example.com/image-" + i + ".png",
                "Project image",
                i
            ));
        }

        assertInvalid(project(null, null, null, Set.of(), images));
    }

    @Test
    void projectRejectsInvalidNestedImageUrl() {
        assertInvalid(project(
            null,
            null,
            null,
            Set.of(),
            List.of(new ProjectImageRequest(
                "x".repeat(2049),
                "Project image",
                1
            ))
        ));
    }

    @Test
    void projectImageRequestRejectsExcessiveUrlLength() {
        assertInvalid(new ProjectImageRequest(
            "x".repeat(2049),
            "Project image",
            1
        ));
    }
}