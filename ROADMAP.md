# WEBORA — Development Roadmap

This document tracks the implementation progress, production readiness, and future enhancements of the WEBORA portfolio CMS.

## Milestone 1 — Application Foundation

- [x] React public frontend
- [x] Angular admin application
- [x] Spring Boot backend
- [x] SQL Server database integration
- [x] Flyway database migrations
- [x] Initial project structure and application configuration

## Milestone 2 — Authentication and Project CMS

- [x] Admin authentication
- [x] JWT-based authentication
- [x] Spring Security configuration
- [x] Project creation
- [x] Project listing
- [x] Project editing
- [x] Project deletion
- [x] Project image management
- [x] Public project listing and details

## Milestone 3 — Media Management

- [x] Image upload validation
- [x] Supported image formats (PNG, JPG, WEBP)
- [x] Maximum upload size validation
- [x] Local image storage support
- [x] Cloudinary integration
- [x] Cloudinary image upload verification
- [x] Image deletion support

## Milestone 4 — CMS Modules

- [x] Profile management
- [x] Skills management
- [x] Bulk skills import
- [x] Services management
- [x] Testimonials management
- [x] Contact inquiry management
- [x] Public profile integration
- [x] Public skills integration
- [x] Public services integration
- [x] Public testimonials integration

## Milestone 5 — Local Quality and Verification

- [x] React frontend build verification
- [x] Angular admin build verification
- [x] Spring Boot backend build verification
- [x] SQL Server connectivity verification
- [x] Swagger API accessibility
- [x] Cloudinary upload verification
- [x] Local application startup verification

## Milestone 6 — GitHub and Production Deployment

- [ ] Final source code review
- [ ] Environment and secret verification
- [ ] Git repository initialization and cleanup
- [ ] First Git commit
- [ ] Create GitHub repository
- [ ] Push source code to GitHub
- [ ] Configure production SQL Server database
- [ ] Configure production environment variables
- [ ] Deploy Spring Boot backend
- [ ] Deploy React frontend
- [ ] Deploy Angular admin dashboard
- [ ] Configure production API URLs
- [ ] Configure production CORS origins
- [ ] Verify Cloudinary uploads in production
- [ ] Production authentication verification
- [ ] End-to-end production testing
- [ ] Custom domain configuration
- [ ] HTTPS configuration

## Milestone 7 — Security, Performance & UI Enhancements

- [x] Backend HTTP security headers (CSP, Permissions-Policy, HSTS preload, X-Content-Type-Options, X-Frame-Options)
- [x] Backend request limits (Tomcat POST/swallow size limits and multipart limits)
- [x] Centralized REST error handling via `@RestControllerAdvice` (sanitized 413, 400, 404, 500 payloads)
- [x] API response caching & deduplication (In-memory 60s cache in React `api.ts` + `PublicCacheFilter`)
- [x] Skeleton shimmer loading states (instant visual feedback on Services, Home, and Projects)
- [x] Bug fix: Duplicate project description on project detail page resolved at source
- [x] Developer-focused Hero visual (Pure SVG/CSS Architecture Terminal with live telemetry, zero human portraits)
- [x] Project image bounding & aspect ratios (Constrained `.detail-image`, `.detail-gallery`, and `.project-image`)
- [x] Typography and spacing normalization (`hero h1` and `page-title` clamping, consistent section padding)
- [x] Responsive navigation & drawer usability (React hamburger toggle fix, admin backdrop & Escape handling)
- [x] Cross-device responsive tuning across all 9 viewports (320px to 1920px)
- [x] Responsive CSS media query cascade order normalization (1500px -> 960px -> 900px -> 700px -> 650px -> 390px)
- [x] WCAG 2.2 accessibility improvements (:focus-visible high-contrast rings, 44px min touch targets, ARIA live regions)
- [x] Zero-CLS skeleton shimmer states across Homepage featured projects, Capabilities, and Testimonials
- [x] Project card baseline flexbox alignment (equalized vertical tag alignment across rows)
- [x] Typography hierarchy balancing (`.contact-section h2` normalized to maintain Hero headline prominence)
- [x] Angular Admin UI polish (styled horizontal scrollbars for tables, refined empty states, offline production bundling)

## Milestone 8 — Premium Developer Expansion & Performance (In Progress)

- [x] Backend database query optimization: Added `@BatchSize(size = 25)` and `@EntityGraph` to eliminate N+1 WAN latency
- [x] Client-side Stale-While-Revalidate (SWR) cache engine with `sessionStorage` fallback & 5-minute fresh TTL
- [x] Responsive Cloudinary image transformation integration (`f_auto,q_auto,w_*`)
- [x] Route hover prefetching (`prefetchRouteData`) across all navigation items and footer links
- [x] Dedicated interactive Curriculum Vitae / Resume page (`/resume`, `/cv`) with custom `@media print` recruiter PDF layout
- [x] Career Journey & Experience timeline module (`/experience`, `/careers`) with Flyway `V7__create_experiences.sql`
- [x] Dynamic profile integration on `/profile` connecting live backend profile data with social links
- [x] Global Command Palette (`Ctrl+K` / `Cmd+K`) with fuzzy navigation, email copying, and print triggers
- [ ] Inquiry CRM enhancement (Extended statuses, priority, internal notes, follow-up dates)
- [ ] Native cookieless portfolio privacy analytics engine
- [ ] Technical engineering blog & case study publisher

---

**Current Status:** Performance optimization pass (N+1 query resolution, SWR caching, Cloudinary delivery, route prefetching), Interactive Resume with Print CSS, Experience Timeline (`V7` Flyway migration & APIs), Dynamic Profile, and Global Command Palette (`Ctrl+K`) are fully implemented and verified. Backend unit tests pass 32/32 (`BUILD SUCCESS`), React Vite bundle compiles in 7.8s (`321 kB / 98 kB gzip`), and Angular Admin builds cleanly.