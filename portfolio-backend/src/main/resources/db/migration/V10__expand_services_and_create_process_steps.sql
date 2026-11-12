ALTER TABLE dbo.services
    ADD slug NVARCHAR(160) NULL,
        short_description NVARCHAR(500) NULL,
        target_audience NVARCHAR(500) NULL,
        key_features_json NVARCHAR(MAX) NULL,
        deliverables_json NVARCHAR(MAX) NULL,
        starting_price_label NVARCHAR(120) NULL,
        delivery_timeline NVARCHAR(120) NULL,
        cta_label NVARCHAR(80) NULL,
        overview_details NVARCHAR(MAX) NULL;
GO

;WITH ServiceSlugs AS (
    SELECT
        id,
        LOWER(
            REPLACE(
                REPLACE(
                    REPLACE(LTRIM(RTRIM(title)), ' ', '-'),
                    '&', 'and'
                ),
                '/', '-'
            )
        ) AS BaseSlug,
        ROW_NUMBER() OVER (
            PARTITION BY LOWER(
                REPLACE(
                    REPLACE(
                        REPLACE(LTRIM(RTRIM(title)), ' ', '-'),
                        '&', 'and'
                    ),
                    '/', '-'
                )
            )
            ORDER BY created_at, id
        ) AS SlugNumber
    FROM dbo.services
    WHERE slug IS NULL
)
UPDATE s
SET slug = CASE
    WHEN ss.SlugNumber = 1 THEN ss.BaseSlug
    ELSE CONCAT(ss.BaseSlug, '-', ss.SlugNumber)
END
FROM dbo.services s
INNER JOIN ServiceSlugs ss ON ss.id = s.id;
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes WHERE name = 'UQ_services_slug' AND object_id = OBJECT_ID('dbo.services')
)
BEGIN
    CREATE UNIQUE INDEX UQ_services_slug
        ON dbo.services (slug)
        WHERE slug IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.services)
BEGIN
    INSERT INTO dbo.services (
        id, title, slug, short_description, description, target_audience,
        key_features_json, deliverables_json, starting_price_label, delivery_timeline,
        cta_label, overview_details, icon, display_order, published, created_at, updated_at
    ) VALUES
    (
        NEWID(),
        'Website Development',
        'website-development',
        'Fast, mobile-responsive business websites structured for credibility, clarity, and lead capture.',
        'Custom company websites built with clean architecture, SEO metadata, fast load times, and CMS-managed content updates.',
        'Service companies, startups, local enterprises, and consulting firms.',
        '["Responsive mobile-first layout","CMS-managed pages & case studies","Technical SEO & speed optimization","Contact & quote capture workflows"]',
        '["Production React storefront","CMS admin management panel","SSL-ready deployment configuration","6 months basic support"]',
        'Starting ₹4,000',
        '1 - 3 weeks',
        'Explore Service',
        'Designed for organizations that need a credible digital presence without agency bloat. Built around your positioning, services, pricing transparency, and inquiry capture.',
        'globe',
        1,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        'E-commerce Store Development',
        'ecommerce-store-development',
        'Reliable online storefronts with structured product catalogs, order management, and checkout workflows.',
        'End-to-end e-commerce web platforms tailored for growing retail brands, D2C sellers, and catalog businesses.',
        'Retail brands, D2C founders, wholesalers, and specialty merchants.',
        '["Structured product catalog & filtering","Shopping cart & guided checkout","Order & inventory workflow integration","Mobile-ready merchandising layout"]',
        '["Custom storefront & product pages","Payment gateway integration readiness","Admin catalog & order tooling","6 months basic support"]',
        'Custom Quote',
        '3 - 6 weeks',
        'Explore Service',
        'Built to make browsing, filtering, and purchasing effortless across mobile and desktop while giving operations teams clean product and order administration.',
        'layers',
        2,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        'Custom Web Application Development',
        'custom-web-application-development',
        'Tailored web portals, internal dashboards, booking systems, and REST API platforms built to exact workflows.',
        'Full-stack software engineering using React, Angular, Spring Boot, and SQL Server to automate operations and serve customers.',
        'Operations teams, SaaS founders, and businesses outgrowing spreadsheets.',
        '["Role-based authentication & access control","Relational SQL Server database modeling","REST APIs with input validation","Reporting dashboards & workflows"]',
        '["Frontend & admin web portals","Tested Spring Boot backend & schema","API documentation & handover","6 months basic support"]',
        'Custom Quote',
        '4 - 10 weeks',
        'Explore Service',
        'Engineered for companies requiring bespoke business logic, multi-role administration, external integrations, and long-term codebase maintainability.',
        'code',
        3,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        'Software Maintenance & Support',
        'software-maintenance-and-support',
        'Ongoing bug resolution, performance tuning, security updates, and incremental enhancements for existing apps.',
        'Structured technical support and lifecycle stewardship so production websites and web applications remain fast, secure, and dependable.',
        'Businesses running active websites or custom applications needing reliable engineering continuity.',
        '["Security dependency patching","Query & frontend speed optimization","Bug triage & hotfix turnaround","Small iterative feature updates"]',
        '["Baseline technical audit","Scheduled maintenance updates","Root-cause incident resolution","Prioritized ticket turnaround"]',
        'Included 6 Mo Basic / Retainer',
        'Ongoing',
        'Explore Service',
        'Protects your software investment with proactive monitoring guidance, clean database hygiene, API compatibility checks, and dependable technical communication.',
        'wrench',
        4,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        'UI/UX & Website Redesign',
        'ui-ux-and-website-redesign',
        'Modernize outdated interfaces into accessible, high-clarity user journeys that improve trust and conversion.',
        'Interface architecture, layout refinement, responsive CSS engineering, and usability upgrades for existing web products.',
        'Organizations whose current site feels dated, slow, or confusing on mobile devices.',
        '["Visual hierarchy & layout overhaul","Mobile & tablet responsiveness audit","Accessibility & contrast improvements","Conversion-focused CTA architecture"]',
        '["Interactive UI redesign implementation","Unified design tokens & typography","Cross-viewport responsive testing","Handover documentation"]',
        'Starting ₹5,000',
        '2 - 4 weeks',
        'Explore Service',
        'Transforms cluttered pages into cohesive, legible digital experiences aligned with modern brand standards while preserving existing functional routes and SEO equity.',
        'palette',
        5,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID('dbo.process_steps', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.process_steps (
        id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        step_number INT NOT NULL,
        title NVARCHAR(160) NOT NULL,
        description NVARCHAR(2000) NOT NULL,
        deliverable_hint NVARCHAR(255) NULL,
        published BIT NOT NULL DEFAULT (1),
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    INSERT INTO dbo.process_steps (id, step_number, title, description, deliverable_hint, published, created_at, updated_at) VALUES
    (NEWID(), 1, 'Discovery', 'We align on your business goals, target users, operational pain points, and technical constraints.', 'Requirement Brief', 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (NEWID(), 2, 'Planning & Strategy', 'Scope definition, transparent INR estimate, milestone breakdown, and technology selection.', 'Architecture & Scope Plan', 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (NEWID(), 3, 'UI/UX Design', 'Clean information architecture, responsive layouts, and intuitive user flows before coding begins.', 'Interactive Wireframes & UI System', 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (NEWID(), 4, 'Engineering & Development', 'Modular frontend, validated APIs, database schema migrations, and CMS integration built cleanly.', 'Staging Build & CMS Setup', 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (NEWID(), 5, 'QA & Launch', 'Cross-device testing, security validation, performance tuning, and production deployment.', 'Live Production Release', 1, SYSUTCDATETIME(), SYSUTCDATETIME()),
    (NEWID(), 6, 'Post-Launch Support', 'Six months of included basic support for bug fixes and minor updates, with long-term options.', '6-Month Basic Support Window', 1, SYSUTCDATETIME(), SYSUTCDATETIME());
END
GO
