ALTER TABLE dbo.inquiries
    ADD inquiry_type NVARCHAR(30) NOT NULL
            CONSTRAINT DF_inquiries_inquiry_type DEFAULT ('GENERAL'),
        phone NVARCHAR(40) NULL,
        company_name NVARCHAR(160) NULL,
        project_category NVARCHAR(120) NULL,
        selected_package NVARCHAR(160) NULL,
        budget_range NVARCHAR(120) NULL,
        target_timeline NVARCHAR(120) NULL,
        project_requirements NVARCHAR(MAX) NULL,
        website_or_reference_url NVARCHAR(1024) NULL,
        preferred_contact_method NVARCHAR(40) NULL,
        internal_notes NVARCHAR(MAX) NULL;
GO
