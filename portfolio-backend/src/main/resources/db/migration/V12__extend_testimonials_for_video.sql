ALTER TABLE dbo.testimonials
    ALTER COLUMN content NVARCHAR(MAX) NULL;
GO

ALTER TABLE dbo.testimonials
    ADD media_type NVARCHAR(20) NOT NULL CONSTRAINT DF_testimonials_media_type DEFAULT ('WRITTEN'),
        video_url NVARCHAR(2048) NULL,
        thumbnail_url NVARCHAR(MAX) NULL,
        project_title NVARCHAR(160) NULL;
GO
