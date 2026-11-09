UPDATE dbo.admin_users
SET
    role = 'SUPER_ADMIN',
    updated_at = SYSUTCDATETIME()
WHERE role = 'ADMIN';