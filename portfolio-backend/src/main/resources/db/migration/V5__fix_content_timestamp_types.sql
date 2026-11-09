-- Temporarily remove the index that depends on inquiries.created_at
DROP INDEX IF EXISTS IX_inquiries_status_created
ON dbo.inquiries;

-- Align content module timestamps with Hibernate Instant mapping

ALTER TABLE dbo.site_profile
ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.skills
ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.skills
ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.services
ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.services
ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.testimonials
ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.testimonials
ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.inquiries
ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.inquiries
ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

-- Recreate the original index
CREATE INDEX IX_inquiries_status_created
ON dbo.inquiries (status ASC, created_at DESC);