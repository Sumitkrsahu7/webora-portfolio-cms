-- V8: Track server-side JWT token_version per administrator for logout revocation

ALTER TABLE dbo.admin_users
ADD token_version INT NOT NULL
    CONSTRAINT DF_admin_users_token_version DEFAULT (0);
