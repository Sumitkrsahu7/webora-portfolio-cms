-- Hibernate 6.6 expects DATETIMEOFFSET(6) for Java Instant timestamps.
-- Drop auto-generated inline DEFAULT SYSUTCDATETIME() constraints before altering column types.

DECLARE @dropDefaultsSql NVARCHAR(MAX) = N'';

SELECT @dropDefaultsSql = @dropDefaultsSql +
    N'ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(dc.parent_object_id)) + N'.' + QUOTENAME(OBJECT_NAME(dc.parent_object_id)) +
    N' DROP CONSTRAINT ' + QUOTENAME(dc.name) + N';' + CHAR(10)
FROM sys.default_constraints dc
INNER JOIN sys.columns c
    ON dc.parent_object_id = c.object_id
   AND dc.parent_column_id = c.column_id
WHERE dc.parent_object_id IN (
    OBJECT_ID(N'dbo.team_members'),
    OBJECT_ID(N'dbo.process_steps'),
    OBJECT_ID(N'dbo.pricing_packages'),
    OBJECT_ID(N'dbo.service_policies'),
    OBJECT_ID(N'dbo.faqs')
)
AND c.name IN (N'created_at', N'updated_at');

IF LEN(@dropDefaultsSql) > 0
BEGIN
    EXEC sp_executesql @dropDefaultsSql;
END;
GO

ALTER TABLE dbo.team_members ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;
ALTER TABLE dbo.team_members ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.process_steps ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;
ALTER TABLE dbo.process_steps ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.pricing_packages ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;
ALTER TABLE dbo.pricing_packages ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.service_policies ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;
ALTER TABLE dbo.service_policies ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;

ALTER TABLE dbo.faqs ALTER COLUMN created_at DATETIMEOFFSET(6) NOT NULL;
ALTER TABLE dbo.faqs ALTER COLUMN updated_at DATETIMEOFFSET(6) NOT NULL;
GO

ALTER TABLE dbo.team_members
    ADD CONSTRAINT DF_team_members_created_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR created_at,
        CONSTRAINT DF_team_members_updated_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR updated_at;

ALTER TABLE dbo.process_steps
    ADD CONSTRAINT DF_process_steps_created_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR created_at,
        CONSTRAINT DF_process_steps_updated_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR updated_at;

ALTER TABLE dbo.pricing_packages
    ADD CONSTRAINT DF_pricing_packages_created_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR created_at,
        CONSTRAINT DF_pricing_packages_updated_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR updated_at;

ALTER TABLE dbo.service_policies
    ADD CONSTRAINT DF_service_policies_created_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR created_at,
        CONSTRAINT DF_service_policies_updated_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR updated_at;

ALTER TABLE dbo.faqs
    ADD CONSTRAINT DF_faqs_created_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR created_at,
        CONSTRAINT DF_faqs_updated_at DEFAULT (TODATETIMEOFFSET(SYSUTCDATETIME(), '+00:00')) FOR updated_at;
GO
