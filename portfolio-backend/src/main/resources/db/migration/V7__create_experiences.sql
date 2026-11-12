-- V7: Career Journey and Experience Timeline

CREATE TABLE dbo.experiences (
    id UNIQUEIDENTIFIER NOT NULL,
    company NVARCHAR(160) NOT NULL,
    company_url NVARCHAR(MAX) NULL,
    role_title NVARCHAR(160) NOT NULL,
    location NVARCHAR(160) NULL,
    role_type NVARCHAR(50) NOT NULL
        CONSTRAINT DF_experiences_role_type DEFAULT ('FULL_TIME'),
    start_date DATE NOT NULL,
    end_date DATE NULL,
    current_role BIT NOT NULL
        CONSTRAINT DF_experiences_current_role DEFAULT (0),
    description NVARCHAR(MAX) NOT NULL,
    technologies NVARCHAR(MAX) NULL,
    display_order INT NOT NULL
        CONSTRAINT DF_experiences_display_order DEFAULT (0),
    published BIT NOT NULL
        CONSTRAINT DF_experiences_published DEFAULT (0),
    created_at DATETIMEOFFSET(6) NOT NULL,
    updated_at DATETIMEOFFSET(6) NOT NULL,

    CONSTRAINT PK_experiences PRIMARY KEY (id),
    CONSTRAINT CHK_experiences_role_type
        CHECK (role_type IN ('FULL_TIME', 'CONTRACT', 'FREELANCE', 'FOUNDER'))
);

CREATE INDEX IX_experiences_published_order
ON dbo.experiences (published ASC, display_order ASC, start_date DESC);
