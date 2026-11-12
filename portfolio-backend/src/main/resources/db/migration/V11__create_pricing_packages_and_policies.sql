IF OBJECT_ID('dbo.pricing_packages', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.pricing_packages (
        id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        name NVARCHAR(160) NOT NULL,
        slug NVARCHAR(160) NOT NULL,
        category_label NVARCHAR(120) NULL,
        price_label NVARCHAR(120) NOT NULL,
        billing_note NVARCHAR(255) NULL,
        ideal_for NVARCHAR(500) NULL,
        features_json NVARCHAR(MAX) NULL,
        excluded_note NVARCHAR(500) NULL,
        support_period_label NVARCHAR(120) NULL,
        highlighted BIT NOT NULL DEFAULT (0),
        cta_label NVARCHAR(80) NULL,
        display_order INT NOT NULL DEFAULT (0),
        published BIT NOT NULL DEFAULT (1),
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    CREATE UNIQUE INDEX UQ_pricing_packages_slug
        ON dbo.pricing_packages (slug);

    INSERT INTO dbo.pricing_packages (
        id, name, slug, category_label, price_label, billing_note, ideal_for,
        features_json, excluded_note, support_period_label, highlighted, cta_label,
        display_order, published, created_at, updated_at
    ) VALUES
    (
        NEWID(),
        'Static Website',
        'static-website',
        'STARTER PRESENCE',
        '₹4,000',
        'One-time development fee · Domain & hosting billed separately',
        'Freelancers, local shops, consultants, and early-stage ventures needing a fast online profile.',
        '["Up to 5 responsive pages","Mobile & tablet layout optimization","Contact inquiry form integration","Basic on-page SEO metadata","SSL & production deployment setup"]',
        'Domain registration, hosting renewals, and custom CMS admin panels are billed/scoped separately.',
        '6 Months Basic Support Included',
        0,
        'Choose Static Plan',
        1,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        'Business Website',
        'business-website',
        'MOST POPULAR',
        '₹5,000 – ₹6,000',
        'One-time development fee · Final quote based on page & content scope',
        'Growing businesses, service agencies, and brands wanting CMS control and lead generation.',
        '["Everything in Static Website","Dynamic CMS-managed services & work","WhatsApp & quote request routing","Structured pricing & FAQ sections","Performance & asset optimization"]',
        'Domain, cloud hosting, and paid third-party integrations remain under client ownership.',
        '6 Months Basic Support Included',
        1,
        'Request Business Quote',
        2,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        'Advanced Website',
        'advanced-website',
        'DYNAMIC & SCALABLE',
        '₹8,000 – ₹10,000',
        'One-time development fee · Tailored to custom modules & admin tools',
        'Established firms needing multi-section dynamic portals, role-based CMS, and rich media galleries.',
        '["Full CMS administration dashboard","Custom database models & REST APIs","Cloudinary image optimization","Interactive quote & filtering workflows","Cross-browser QA & speed tuning"]',
        'Third-party API subscriptions, cloud hosting plans, and domain renewals are billed separately.',
        '6 Months Basic Support Included',
        0,
        'Request Advanced Quote',
        3,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        'E-commerce & Custom Software',
        'ecommerce-custom-software',
        'BESPOKE ENGINEERING',
        'Custom Quote',
        'Scoped milestone-by-milestone based on functional complexity',
        'D2C stores, SaaS founders, and teams requiring custom backends, checkouts, or workflow automation.',
        '["Full product catalog or portal architecture","Payment gateway & webhook integration","Admin analytics & role-based security","Relational SQL Server schema & migrations","Dedicated architecture planning"]',
        'External infrastructure, payment gateway transaction fees, and domain/DNS costs billed separately.',
        '6 Months Basic Support Included',
        0,
        'Scope Custom Project',
        4,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    );
END
GO

IF OBJECT_ID('dbo.service_policies', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.service_policies (
        id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        title NVARCHAR(160) NOT NULL,
        policy_type NVARCHAR(60) NOT NULL,
        summary NVARCHAR(2000) NOT NULL,
        bullet_points_json NVARCHAR(MAX) NULL,
        display_order INT NOT NULL DEFAULT (0),
        published BIT NOT NULL DEFAULT (1),
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    INSERT INTO dbo.service_policies (
        id, title, policy_type, summary, bullet_points_json, display_order, published, created_at, updated_at
    ) VALUES
    (
        NEWID(),
        'Domain, Hosting & Third-Party Costs (Billed Separately)',
        'SEPARATE_COSTS',
        'To maintain 100% client ownership and avoid hidden markups, recurring infrastructure and external licenses remain directly billed to the client account.',
        '["Domain registration and annual DNS renewals","Cloud server, database, or managed hosting plans","Paid email, SMS, WhatsApp Business API, or payment gateway fees","Premium fonts, stock media, or paid third-party SaaS plugins"]',
        1,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        '6 Months Basic Support (Included)',
        'SUPPORT_INCLUDED',
        'Every launched website or software engagement includes a complimentary 6-month basic support window starting from production handover.',
        '["Fixing functional bugs within originally delivered features","Minor text, pricing label, and image updates via CMS or config","Security & runtime health checks on deployed endpoints","Technical guidance for domain/DNS verification issues"]',
        2,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    ),
    (
        NEWID(),
        'What Is Outside Basic Support (Separately Scoped)',
        'SUPPORT_EXCLUDED',
        'Clear boundaries prevent surprise invoices. Items outside initial delivered scope are estimated cleanly before any billable work starts.',
        '["Building brand-new pages, e-commerce modules, or workflow features","Complete visual redesigns after final sign-off","Troubleshooting third-party provider outages or unpaid hosting renewals","Major platform migrations or custom enterprise SLA retainers beyond 6 months"]',
        3,
        1,
        SYSUTCDATETIME(),
        SYSUTCDATETIME()
    );
END
GO
