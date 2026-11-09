-- Drop the index that depends on created_at before changing its type.
DROP INDEX IX_projects_status_created ON dbo.projects;

-- Hibernate 6.6 expects DATETIMEOFFSET(6) for Java Instant.
ALTER TABLE dbo.projects
ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.projects
ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

-- Recreate the original index.
CREATE INDEX IX_projects_status_created
ON dbo.projects(status, created_at DESC);