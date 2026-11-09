
-- ============================================
-- Portfolio CMS - Initial SQL Server Migration
-- Database: PortfolioCMS
-- ============================================

-- Projects
CREATE TABLE dbo.projects (
    id UNIQUEIDENTIFIER NOT NULL,
    title NVARCHAR(160) NOT NULL,
    slug NVARCHAR(180) NOT NULL,
    short_description NVARCHAR(320) NOT NULL,
    full_description NVARCHAR(MAX) NULL,
    category NVARCHAR(255) NULL,
    thumbnail_url NVARCHAR(MAX) NULL,
    live_url NVARCHAR(MAX) NULL,
    github_url NVARCHAR(MAX) NULL,
    start_date DATE NULL,
    completion_date DATE NULL,
    featured BIT NOT NULL
        CONSTRAINT DF_projects_featured DEFAULT (0),
    status NVARCHAR(20) NOT NULL
        CONSTRAINT DF_projects_status DEFAULT ('DRAFT'),
    created_at DATETIME2(7) NOT NULL,
    updated_at DATETIME2(7) NOT NULL,

    CONSTRAINT PK_projects PRIMARY KEY (id),
    CONSTRAINT UQ_projects_slug UNIQUE (slug),
    CONSTRAINT CHK_project_status
        CHECK (status IN ('DRAFT', 'PUBLISHED'))
);

-- Project indexes
CREATE INDEX IX_projects_status_created
ON dbo.projects(status, created_at DESC);

CREATE INDEX IX_projects_featured
ON dbo.projects(featured)
WHERE status = 'PUBLISHED';

-- Project technologies
CREATE TABLE dbo.project_technologies (
    project_id UNIQUEIDENTIFIER NOT NULL,
    technology NVARCHAR(255) NOT NULL,

    CONSTRAINT PK_project_technologies
        PRIMARY KEY (project_id, technology),

    CONSTRAINT FK_project_technologies_project
        FOREIGN KEY (project_id)
        REFERENCES dbo.projects(id)
        ON DELETE CASCADE
);

-- Project images
CREATE TABLE dbo.project_images (
    id UNIQUEIDENTIFIER NOT NULL,
    project_id UNIQUEIDENTIFIER NOT NULL,
    image_url NVARCHAR(MAX) NOT NULL,
    alt_text NVARCHAR(200) NULL,
    display_order INT NOT NULL
        CONSTRAINT DF_project_images_display_order DEFAULT (0),

    CONSTRAINT PK_project_images PRIMARY KEY (id),

    CONSTRAINT FK_project_images_project
        FOREIGN KEY (project_id)
        REFERENCES dbo.projects(id)
        ON DELETE CASCADE
);

CREATE INDEX IX_project_images_project_order
ON dbo.project_images(project_id, display_order);
