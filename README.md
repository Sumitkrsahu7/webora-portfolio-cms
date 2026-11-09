# WEBORA — Full-Stack Portfolio CMS

WEBORA is a full-stack portfolio platform featuring a dynamic public-facing portfolio website and an Angular-based administration dashboard, powered by a Spring Boot REST API.

The platform allows portfolio owners to manage their professional profile, projects, technical skills, services, testimonials, and contact inquiries through a centralized CMS.

## Technology Stack

| Application | Technologies |
|---|---|
| Public Frontend | React 19, TypeScript, Vite |
| Admin Dashboard | Angular 20, TypeScript |
| Backend | Java 21, Spring Boot 3.5.6 |
| Database | Microsoft SQL Server |
| ORM | Spring Data JPA, Hibernate |
| Database Migrations | Flyway |
| Authentication | Spring Security, JWT |
| Image Storage | Cloudinary |
| API Documentation | Swagger / OpenAPI |
| Build Tools | Maven, npm |

## Project Structure

```text
portfolio-project/
│
├── portfolio-frontend/       # React public portfolio
│
├── portfolio-admin/          # Angular administration dashboard
│
├── portfolio-backend/        # Spring Boot REST API
│
├── database/                 # Database-related files
│
├── scripts/                  # Development scripts
│
├── .env.example              # Environment variable reference
├── .gitignore
├── README.md
└── ROADMAP.md
```

## Implemented Features

### 1. Public Portfolio Website

- Dynamic professional profile information
- Project listing and individual project details
- Technical skills and skill categories
- Services and offerings
- Testimonials
- Contact form and inquiry submission
- Dynamic content retrieved from backend APIs

### 2. Admin Dashboard

- Admin authentication
- Profile management
- Project creation, editing, and deletion
- Project image uploads
- Skills management
- Bulk skills import
- Services management
- Testimonials management
- Contact inquiry management

### 3. Backend and API

- RESTful API architecture
- Spring Boot application
- SQL Server database integration
- Spring Data JPA and Hibernate
- Flyway database migrations
- JWT-based authentication
- Spring Security configuration
- Configurable CORS origins
- Image upload and deletion endpoints
- Cloudinary integration
- Swagger API documentation

### 4. Image Management

- Image upload validation
- Supported image formats: PNG, JPG, and WEBP
- Maximum upload size: 5 MB
- Local storage support
- Cloudinary cloud storage integration
- Secure Cloudinary image URLs

## Local Development Setup

### Prerequisites

Install the following tools:

- Git
- Node.js and npm
- Java 21 JDK
- Apache Maven 3.9+
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- Cloudinary account for cloud image storage

### Application URLs

| Application | Local URL |
|---|---|
| React Portfolio | http://localhost:5173 |
| Angular Admin | http://localhost:4200 |
| Spring Boot API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |

## Environment Configuration

The backend requires environment variables for database connectivity, authentication, and image storage.

Configure the following variables in your local environment:

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD

JWT_SECRET

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

APP_UPLOAD_PROVIDER=cloudinary
```

Use `.env.example` as a reference for the required configuration.

**Important:** Never commit actual passwords, API keys, JWT secrets, or private environment files to GitHub.

The SQL Server database must exist and be accessible using the configured database credentials. Flyway manages the database schema migrations.

## Running the Applications

Start each application in a separate terminal.

### 1. Start the Backend

Open PowerShell:

```powershell
cd portfolio-backend
mvn spring-boot:run
```

The backend will run at:

```text
http://localhost:8080
```

Swagger documentation:

```text
http://localhost:8080/swagger-ui/index.html
```

### 2. Start the React Frontend

Open another terminal:

```powershell
cd portfolio-frontend
npm install
npm run dev
```

The React application will run at:

```text
http://localhost:5173
```

### 3. Start the Angular Admin Dashboard

Open another terminal:

```powershell
cd portfolio-admin
npm install
npm start
```

The Angular application will run at:

```text
http://localhost:4200
```

## Production Deployment

The production deployment architecture is planned around the following services:

| Component | Planned Hosting |
|---|---|
| React Frontend | Vercel |
| Angular Admin | Vercel |
| Spring Boot Backend | Java-compatible hosting provider |
| Database | Managed Microsoft SQL Server |
| Image Storage | Cloudinary |
| Source Code | GitHub |

Production deployment requires:

- Production database configuration
- Secure environment variables
- Production frontend and admin URLs
- Backend CORS configuration
- Cloudinary credentials
- Strong JWT secret
- Production API URLs in both frontend applications
- HTTPS configuration

The production hosting configuration is not yet complete.

## Current Project Status

The core WEBORA portfolio and CMS functionality has been implemented and verified in the local development environment.

The following have been verified:

- React frontend runs successfully.
- Angular admin dashboard runs successfully.
- Spring Boot backend builds and runs successfully.
- SQL Server connectivity works.
- Swagger API documentation is accessible.
- Cloudinary image uploads have been tested.

GitHub publication, production hosting, deployment configuration, and additional testing are part of the next development phase.

Refer to [ROADMAP.md](ROADMAP.md) for planned improvements and deployment milestones.

## Security

- Never commit `.env` files.
- Never expose database passwords.
- Never publish Cloudinary API secrets.
- Keep JWT signing secrets private.
- Configure production CORS with trusted origins.
- Use HTTPS for deployed applications.

---

**WEBORA — A Dynamic Portfolio and Content Management Platform.**