ALTER TABLE dbo.admin_users
DROP CONSTRAINT CHK_admin_users_role;

ALTER TABLE dbo.admin_users
WITH CHECK ADD CONSTRAINT CHK_admin_users_role
CHECK ([role] IN ('ADMIN', 'SUPER_ADMIN'));

ALTER TABLE dbo.admin_users
CHECK CONSTRAINT CHK_admin_users_role;

UPDATE dbo.admin_users
SET
    role = 'SUPER_ADMIN',
    updated_at = SYSUTCDATETIME()
WHERE role = 'ADMIN';
