package com.portfolio.validation;

import com.portfolio.content.ExperienceRequest;
import com.portfolio.content.FaqRequest;
import com.portfolio.content.Inquiry;
import com.portfolio.content.InquiryController;
import com.portfolio.content.InquiryRepository;
import com.portfolio.content.InquiryRequest;
import com.portfolio.content.PricingPackageRequest;
import com.portfolio.content.ProcessStepRequest;
import com.portfolio.content.PublicInquiryAckResponse;
import com.portfolio.content.ServicePolicyRequest;
import com.portfolio.content.ServiceRequest;
import com.portfolio.content.SiteProfileRequest;
import com.portfolio.content.TeamMemberRequest;
import com.portfolio.content.TestimonialRequest;
import com.portfolio.project.ProjectImageRequest;
import com.portfolio.project.ProjectRequest;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Proxy;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
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

    @Test
    void experienceRejectsInvalidRoleTypeEndDateBeforeStartDateAndUnsafeUrl() {
        assertInvalid(new ExperienceRequest(
            "Webora",
            "https://webora.dev",
            "Software Engineer",
            "Remote",
            "INVALID_ROLE",
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 6, 1),
            false,
            "Built enterprise web software",
            "Java, React",
            0,
            true
        ));

        assertInvalid(new ExperienceRequest(
            "Webora",
            "javascript:alert(1)",
            "Software Engineer",
            "Remote",
            "FULL_TIME",
            LocalDate.of(2025, 1, 1),
            LocalDate.of(2025, 6, 1),
            false,
            "Built enterprise web software",
            "Java, React",
            0,
            true
        ));

        assertInvalid(new ExperienceRequest(
            "Webora",
            "https://webora.dev",
            "Software Engineer",
            "Remote",
            "CONTRACT",
            LocalDate.of(2025, 6, 1),
            LocalDate.of(2025, 1, 1),
            false,
            "Built enterprise web software",
            "Java, React",
            0,
            true
        ));

        assertValid(new ExperienceRequest(
            "Webora",
            "https://webora.dev",
            "Software Engineer",
            "Remote",
            "FULL_TIME",
            LocalDate.of(2025, 6, 1),
            LocalDate.of(2025, 1, 1),
            true,
            "Built enterprise web software",
            "Java, React",
            0,
            true
        ));
    }

    @Test
    void profileAndTestimonialRejectJavascriptUrls() {
        assertInvalid(new SiteProfileRequest(
            "WEBORA",
            null,
            null,
            null,
            null,
            null,
            "javascript:alert(1)",
            null,
            null,
            null,
            null
        ));

        assertInvalid(new TestimonialRequest(
            "Client",
            "Founder",
            "Acme",
            "Great software delivery.",
            "data:text/html,<script>",
            0,
            true
        ));
    }

    @Test
    void extendedCompanyProfileAndTeamMemberValidation() {
        assertValid(new SiteProfileRequest(
            "WEBORA",
            "Software Development & Digital Solutions",
            "We engineer custom software.",
            "hello@webora.example",
            "+91 9876543210",
            "India",
            "https://res.cloudinary.com/demo/image/upload/logo.png",
            null,
            "https://github.com/webora",
            "https://linkedin.com/company/webora",
            "https://webora.example",
            "Practical digital solutions built around your business.",
            "Full-cycle web engineering.",
            "[{\"title\":\"Practical Architecture\",\"description\":\"Right-sized stack.\"}]",
            "+919876543210",
            "support@webora.example",
            "Mon-Sat, 10 AM - 7 PM IST",
            "Within 1 business day",
            "Built for reliability.",
            "https://res.cloudinary.com/demo/image/upload/brand.png"
        ));

        assertInvalid(new SiteProfileRequest(
            "WEBORA", null, null, null, null, null, null, null, null, null, null,
            null, null, null, "not-a-phone-number!!", null, null, null, null, null
        ));

        assertInvalid(new SiteProfileRequest(
            "WEBORA", null, null, null, null, null, null, null, null, null, null,
            null, null, null, "+919876543210", null, null, null, null, "javascript:alert(1)"
        ));

        assertValid(new TeamMemberRequest(
            "Rohan Verma",
            "Lead Systems Engineer",
            "Backend & APIs",
            "Architects maintainable Spring Boot and SQL Server systems.",
            "https://res.cloudinary.com/demo/image/upload/rohan.jpg",
            "https://linkedin.com/in/rohan",
            "https://github.com/rohan",
            1,
            true
        ));

        assertInvalid(new TeamMemberRequest(
            "Rohan Verma",
            "Lead Systems Engineer",
            "Backend & APIs",
            "Bio",
            null,
            "javascript:alert(1)",
            null,
            1,
            true
        ));
    }

    @Test
    void serviceSlugAndProcessStepValidation() {
        assertValid(new ServiceRequest(
            "Website Development",
            "Full company website delivery",
            "globe",
            1,
            true,
            "website-development",
            "Responsive business websites",
            "Service businesses",
            "[\"Responsive UI\"]",
            "[\"Live website\"]",
            "Starting ₹4,000",
            "1 - 3 weeks",
            "Explore Service",
            "Detailed overview"
        ));

        assertInvalid(new ServiceRequest(
            "Website Development",
            "Full company website delivery",
            "globe",
            1,
            true,
            "Invalid Slug!",
            null, null, null, null, null, null, null, null
        ));

        assertValid(new ProcessStepRequest(1, "Discovery", "Align on goals.", "Brief", true));
        assertInvalid(new ProcessStepRequest(0, "Discovery", "Align on goals.", "Brief", true));
    }

    @Test
    void pricingPackageAndServicePolicyValidation() {
        assertValid(new PricingPackageRequest(
            "Business Website",
            "business-website",
            "MOST POPULAR",
            "₹5,000 – ₹6,000",
            "Domain & hosting separate",
            "Growing businesses",
            "[\"CMS control\"]",
            "Hosting separate",
            "6 Months Basic Support Included",
            true,
            "Request Business Quote",
            2,
            true
        ));

        assertInvalid(new PricingPackageRequest(
            "Business Website", "Bad Slug", null, "₹5,000",
            null, null, null, null, null, false, null, 1, true
        ));

        assertValid(new ServicePolicyRequest(
            "6 Months Basic Support",
            "SUPPORT_INCLUDED",
            "Includes bug fixes within scope.",
            "[\"Minor copy edits\"]",
            1,
            true
        ));

        assertInvalid(new ServicePolicyRequest(
            "Invalid Policy",
            "ARBITRARY_TYPE",
            "Summary",
            null,
            1,
            true
        ));
    }

    @Test
    void writtenAndVideoTestimonialValidation() {
        assertValid(new TestimonialRequest(
            "Ananya", "Founder", "Retail Co", "", null, 1, true,
            "VIDEO", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", null, "Storefront"
        ));

        assertInvalid(new TestimonialRequest(
            "Ananya", "Founder", "Retail Co", "", null, 1, true,
            "VIDEO", null, null, "Storefront"
        ));

        assertInvalid(new TestimonialRequest(
            "Ananya", "Founder", "Retail Co", "", null, 1, true,
            "VIDEO", "javascript:alert(1)", null, "Storefront"
        ));

        assertInvalid(new TestimonialRequest(
            "Ananya", "Founder", "Retail Co", "   ", null, 1, true,
            "WRITTEN", null, null, null
        ));
    }

    @Test
    void quoteInquiryValidationAndControllerProtection() {
        assertValid(new InquiryRequest(
            "Rohan Verma",
            "rohan@example.com",
            null,
            null,
            "QUOTE",
            "+91 98765 43210",
            "Verma Logistics",
            "Business Website",
            "Business Website (Rs. 5,000 - 6,000)",
            "₹5,000 - ₹6,000",
            "2 - 4 Weeks",
            "Need a 6-page company site with lead form and CMS control.",
            "https://example.com",
            "WHATSAPP",
            null
        ));

        assertInvalid(new InquiryRequest(
            "Rohan Verma",
            "rohan@example.com",
            null,
            " ",
            "QUOTE",
            "not-a-phone!!!",
            null, null, null, null, null,
            " ",
            "javascript:alert(1)",
            "FAX",
            null
        ));

        AtomicInteger saveCalls = new AtomicInteger();
        InquiryRepository repoProxy = (InquiryRepository) Proxy.newProxyInstance(
            InquiryRepository.class.getClassLoader(),
            new Class<?>[]{InquiryRepository.class},
            (proxy, method, args) -> {
                if ("save".equals(method.getName())) {
                    saveCalls.incrementAndGet();
                    return args[0];
                }
                throw new UnsupportedOperationException(method.getName());
            }
        );

        InquiryController controller = new InquiryController(repoProxy);
        MockHttpServletRequest mockRequest = new MockHttpServletRequest();
        mockRequest.setRemoteAddr("203.0.113.10");

        // Honeypot hit should never persist to repository
        PublicInquiryAckResponse botAck = controller.create(
            new InquiryRequest(
                "Bot", "bot@example.com", "Spam", "Buy now",
                "GENERAL", null, null, null, null, null, null, null, null, null, "https://spam.example"
            ),
            mockRequest
        );
        assertEquals("NEW", botAck.status());
        assertEquals(0, saveCalls.get());

        InquiryRequest legit = new InquiryRequest("Client", "client@example.com", "Scope", "Need website");
        for (int i = 0; i < 6; i++) {
            PublicInquiryAckResponse ack = controller.create(legit, mockRequest);
            assertEquals("GENERAL", ack.inquiryType());
        }
        assertEquals(6, saveCalls.get());

        // 7th submission within 10-minute window triggers HTTP 429
        ResponseStatusException rateLimitEx = assertThrows(
            ResponseStatusException.class,
            () -> controller.create(legit, mockRequest)
        );
        assertEquals(429, rateLimitEx.getStatusCode().value());
    }

    @Test
    void faqRequestValidation() {
        assertValid(new FaqRequest(
            "What is the starting price?",
            "Static websites start at ₹4,000 with 6 months basic support included.",
            "Pricing",
            1,
            true
        ));

        assertInvalid(new FaqRequest(
            " ",
            "Answer body",
            "Pricing",
            0,
            true
        ));
    }
}