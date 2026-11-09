CREATE TABLE dbo.admin_users (
    id UNIQUEIDENTIFIER NOT NULL,
    email NVARCHAR(255) NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    role NVARCHAR(30) NOT NULL
        CONSTRAINT DF_admin_users_role DEFAULT ('ADMIN'),
    enabled BIT NOT NULL
        CONSTRAINT DF_admin_users_enabled DEFAULT (1),
    created_at DATETIMEOFFSET(6) NOT NULL,
    updated_at DATETIMEOFFSET(6) NOT NULL,

    CONSTRAINT PK_admin_users PRIMARY KEY (id),
    CONSTRAINT UQ_admin_users_email UNIQUE (email),
    CONSTRAINT CHK_admin_users_role CHECK (role IN ('ADMIN'))
);