-- V4: Remaining WEBORA CMS content modules

-- Single editable website profile
CREATE TABLE dbo.site_profile (
    id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(160) NOT NULL,
    headline NVARCHAR(255) NULL,
    bio NVARCHAR(MAX) NULL,
    email NVARCHAR(255) NULL,
    phone NVARCHAR(50) NULL,
    location NVARCHAR(255) NULL,
    avatar_url NVARCHAR(MAX) NULL,
    resume_url NVARCHAR(MAX) NULL,
    github_url NVARCHAR(MAX) NULL,
    linkedin_url NVARCHAR(MAX) NULL,
    website_url NVARCHAR(MAX) NULL,
    updated_at DATETIME2(7) NOT NULL,
    CONSTRAINT PK_site_profile PRIMARY KEY (id)
);

-- Skills
CREATE TABLE dbo.skills (
    id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(120) NOT NULL,
    category NVARCHAR(120) NULL,
    proficiency INT NULL,
    display_order INT NOT NULL DEFAULT (0),
    published BIT NOT NULL DEFAULT (0),
    created_at DATETIME2(7) NOT NULL,
    updated_at DATETIME2(7) NOT NULL,
    CONSTRAINT PK_skills PRIMARY KEY (id),
    CONSTRAINT CHK_skills_proficiency
        CHECK (proficiency IS NULL OR proficiency BETWEEN 0 AND 100)
);

CREATE INDEX IX_skills_published_order
ON dbo.skills(published, display_order);

-- Services
CREATE TABLE dbo.services (
    id UNIQUEIDENTIFIER NOT NULL,
    title NVARCHAR(160) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    icon NVARCHAR(100) NULL,
    display_order INT NOT NULL DEFAULT (0),
    published BIT NOT NULL DEFAULT (0),
    created_at DATETIME2(7) NOT NULL,
    updated_at DATETIME2(7) NOT NULL,
    CONSTRAINT PK_services PRIMARY KEY (id)
);

CREATE INDEX IX_services_published_order
ON dbo.services(published, display_order);

-- Testimonials (only genuine testimonials should be published)
CREATE TABLE dbo.testimonials (
    id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(160) NOT NULL,
    role NVARCHAR(160) NULL,
    company NVARCHAR(160) NULL,
    content NVARCHAR(MAX) NOT NULL,
    avatar_url NVARCHAR(MAX) NULL,
    display_order INT NOT NULL DEFAULT (0),
    published BIT NOT NULL DEFAULT (0),
    created_at DATETIME2(7) NOT NULL,
    updated_at DATETIME2(7) NOT NULL,
    CONSTRAINT PK_testimonials PRIMARY KEY (id)
);

CREATE INDEX IX_testimonials_published_order
ON dbo.testimonials(published, display_order);

-- Public contact form submissions
CREATE TABLE dbo.inquiries (
    id UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(160) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    subject NVARCHAR(255) NULL,
    message NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT ('NEW'),
    created_at DATETIME2(7) NOT NULL,
    updated_at DATETIME2(7) NOT NULL,
    CONSTRAINT PK_inquiries PRIMARY KEY (id),
    CONSTRAINT CHK_inquiries_status
        CHECK (status IN ('NEW', 'READ', 'REPLIED'))
);

CREATE INDEX IX_inquiries_status_created
ON dbo.inquiries(status, created_at DESC);
