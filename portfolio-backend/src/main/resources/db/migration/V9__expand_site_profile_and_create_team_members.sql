ALTER TABLE dbo.site_profile
    ADD company_tagline NVARCHAR(255) NULL,
        company_story NVARCHAR(MAX) NULL,
        differentiators_json NVARCHAR(MAX) NULL,
        whatsapp_number NVARCHAR(30) NULL,
        support_email NVARCHAR(255) NULL,
        business_hours NVARCHAR(160) NULL,
        response_sla NVARCHAR(160) NULL,
        footer_tagline NVARCHAR(255) NULL,
        logo_url NVARCHAR(MAX) NULL;
GO

IF OBJECT_ID('dbo.team_members', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.team_members (
        id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
        name NVARCHAR(160) NOT NULL,
        role_title NVARCHAR(160) NOT NULL,
        specialty NVARCHAR(255) NULL,
        bio NVARCHAR(2000) NULL,
        avatar_url NVARCHAR(MAX) NULL,
        linkedin_url NVARCHAR(2048) NULL,
        github_url NVARCHAR(2048) NULL,
        display_order INT NOT NULL DEFAULT (0),
        published BIT NOT NULL DEFAULT (1),
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );

    CREATE INDEX IX_team_members_published_order
        ON dbo.team_members (published, display_order ASC);
END
GO
