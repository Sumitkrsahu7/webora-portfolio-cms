import HeroVisual from '../components/HeroVisual'
import ProcessSection from '../components/ProcessSection'
import FaqSection from '../components/FaqSection'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Layers3,
  MonitorSmartphone,
  Workflow,
  Database,
  Palette,
  ShieldCheck,
  Cloud,
  Smartphone,
  Globe,
  Settings,
  Wrench,
  Briefcase,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import {
  getProjects,
  getProfile,
  getServices,
  assetUrl,
  prefetchProject,
  prefetchRouteData,
  subscribeApiCache,
} from '../api'

import type { Project } from '../types'
import type { SiteProfile, ServiceItem } from '../api'

// Match CMS icon names to Lucide icons.
// The default icon is used when the CMS icon is empty or unrecognised.
const serviceIconMap: Record<string, LucideIcon> = {
  code: Code2,
  code2: Code2,
  software: Code2,
  development: Code2,
  monitorsmartphone: MonitorSmartphone,
  webdevelopment: MonitorSmartphone,
  smartphone: Smartphone,
  mobile: Smartphone,
  database: Database,
  data: Database,
  palette: Palette,
  design: Palette,
  shieldcheck: ShieldCheck,
  security: ShieldCheck,
  cloud: Cloud,
  globe: Globe,
  web: Globe,
  settings: Settings,
  maintenance: Wrench,
  wrench: Wrench,
  workflow: Workflow,
  briefcase: Briefcase,
  layers: Layers3,
  layers3: Layers3,
}

function getServiceIcon(iconName: string | null): LucideIcon {
  const key = (iconName || '')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()

  return serviceIconMap[key] || Layers3
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [profile, setProfile] = useState<SiteProfile | null>(null)

  const [loading, setLoading] = useState(true)
  const [servicesLoading, setServicesLoading] = useState(true)

  const [error, setError] = useState('')
  const [servicesError, setServicesError] = useState('')

  useEffect(() => {
    let active = true

    getProjects()
      .then((data) => {
        if (active) {
          setProjects(
            data.filter((project) => project.status === 'PUBLISHED')
          )
        }
      })
      .catch(() => {
        if (active) {
          setError('Projects are temporarily unavailable.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    getServices()
      .then((data) => {
        if (active) {
          setServices(
            data
              .filter((service) => service.published)
              .sort(
                (a, b) => a.displayOrder - b.displayOrder
              )
          )
        }
      })
      .catch(() => {
        if (active) {
          setServicesError('Services are temporarily unavailable.')
        }
      })
      .finally(() => {
        if (active) setServicesLoading(false)
      })

    getProfile()
      .then((data) => {
        if (active) setProfile(data)
      })
      .catch(() => {
        if (active) setProfile(null)
      })

    const unsubProjects = subscribeApiCache<Project[]>('/public/projects', (data) => {
      if (active) setProjects(data)
    })
    const unsubServices = subscribeApiCache<ServiceItem[]>('/public/services', (data) => {
      if (active) {
        setServices(
          data
            .filter((service) => service.published)
            .sort((a, b) => a.displayOrder - b.displayOrder)
        )
      }
    })
    const unsubProfile = subscribeApiCache<SiteProfile>('/public/profile', (data) => {
      if (active) setProfile(data)
    })

    return () => {
      active = false
      unsubProjects()
      unsubServices()
      unsubProfile()
    }
  }, [])

  const featured = projects
    .filter((project) => project.featured)
    .slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="hero-glow" />

        <div className="hero-grid">
          <div className="hero-content">
          <div className="hero-label">
            <span className="status-dot" />
            SOFTWARE DEVELOPMENT & DIGITAL SOLUTIONS
          </div>

          <h1>
            We build
            <br />
            <span>what moves</span>
            <br />
            business forward.
          </h1>

          <p className="hero-copy">
            {profile?.companyTagline ||
              'Webora builds reliable websites, e-commerce platforms, and custom web applications designed to help businesses scale.'}
          </p>

          <div className="hero-actions">
            <Link
              className="button primary"
              to="/request-quote"
              onPointerEnter={() => prefetchRouteData('/request-quote')}
              onFocus={() => prefetchRouteData('/request-quote')}
            >
              Request a Quote <ArrowUpRight size={16} />
            </Link>

            <Link
              className="button secondary"
              to="/our-work"
              onPointerEnter={() => prefetchRouteData('/our-work')}
              onFocus={() => prefetchRouteData('/our-work')}
            >
              Explore Our Work <ArrowRight size={16} />
            </Link>
          </div>
        </div>
          <HeroVisual />
        </div>

        <div className="hero-bottom">
          <span>THOUGHTFUL ENGINEERING. PRACTICAL RESULTS.</span>
          <a href="#services">
            SCROLL TO EXPLORE <ArrowDown size={13} />
          </a>
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHAT WE DO</p>
            <h2>
              Solutions built
              <br />
              <span>around your needs.</span>
            </h2>
          </div>

          <p className="section-intro">
            From creating digital products to maintaining existing systems,
            we focus on useful, maintainable software.
          </p>
        </div>

        {servicesLoading && (
          <div className="services-grid" aria-busy="true" aria-label="Loading services">
            {[1, 2, 3, 4].map((i) => (
              <article className="service-card skeleton-card" key={i}>
                <div className="service-top">
                  <div className="skeleton-line skeleton-shimmer" style={{ width: '80px', height: '10px' }} />
                  <div className="skeleton-icon skeleton-shimmer" style={{ width: '22px', height: '22px' }} />
                </div>
                <div className="skeleton-line skeleton-title skeleton-shimmer" style={{ margin: '14px 0' }} />
                <div className="skeleton-line skeleton-shimmer" />
                <div className="skeleton-line skeleton-short skeleton-shimmer" />
              </article>
            ))}
          </div>
        )}

        {servicesError && (
          <div className="empty-state error-state">
            {servicesError}
          </div>
        )}

        {!servicesLoading &&
          !servicesError &&
          services.length === 0 && (
            <div className="empty-state">
              Services will appear here when published through the CMS.
            </div>
          )}

        {!servicesLoading &&
          !servicesError &&
          services.length > 0 && (
            <div className="services-grid">
              {services.map((service, index) => {
                const Icon = getServiceIcon(service.icon)

                return (
                  <article className="service-card" key={service.id}>
                    <div className="service-top">
                      <Icon size={24} />
                      <span>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <h3>
                      <Link to={`/services/${service.slug || service.id}`}>
                        {service.title}
                      </Link>
                    </h3>

                    <p>{service.shortDescription || service.description}</p>
                  </article>
                )
              })}
            </div>
          )}

        <Link className="text-link" to="/services">
          Explore our services <ArrowUpRight size={15} />
        </Link>
      </section>

      <section className="section work-section" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SELECTED WORK</p>
            <h2>
              Work that speaks
              <br />
              <span>for itself.</span>
            </h2>
          </div>

          <Link className="text-link" to="/projects">
            View all projects <ArrowUpRight size={15} />
          </Link>
        </div>

        {loading && (
          <div className="project-grid" aria-busy="true" aria-label="Loading featured projects">
            {[1, 2].map((i) => (
              <article className="project-card skeleton-project-card" key={i}>
                <div className="project-image skeleton-shimmer" />
                <div className="project-meta">
                  <div className="skeleton-line skeleton-shimmer" style={{ width: '60px', height: '10px' }} />
                  <div className="skeleton-line skeleton-shimmer" style={{ width: '80px', height: '10px' }} />
                </div>
                <div className="skeleton-line skeleton-title skeleton-shimmer" style={{ height: '24px' }} />
                <div className="skeleton-line skeleton-shimmer" />
              </article>
            ))}
          </div>
        )}

        {error && (
          <div className="empty-state error-state">{error}</div>
        )}

        {!loading && !error && featured.length === 0 && (
          <div className="empty-state">
            Featured projects will appear here when published through the CMS.
          </div>
        )}

        {!loading && !error && featured.length > 0 && (
          <div className="project-grid">
            {featured.map((project) => (
              <article className="project-card" key={project.id}>
                <Link
                  className="project-image"
                  to={`/projects/${project.slug}`}
                  onPointerEnter={() => prefetchProject(project.slug)}
                  onFocus={() => prefetchProject(project.slug)}
                >
                  {project.thumbnailUrl ? (
                    <img
                      src={assetUrl(project.thumbnailUrl, 800)}
                      alt={project.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <Layers3 size={38} />
                      <span>PROJECT PREVIEW</span>
                    </div>
                  )}

                  <span className="image-arrow">
                    <ArrowUpRight size={19} />
                  </span>
                </Link>

                <div className="project-meta">
                  <span>{project.category || 'PROJECT'}</span>
                  <span>
                    {project.technologies?.length || 0} TECHNOLOGIES
                  </span>
                </div>

                <h3>
                  <Link to={`/projects/${project.slug}`}>
                    {project.title}
                  </Link>
                </h3>

                <p>{project.shortDescription}</p>

                <div className="tags">
                  {project.technologies?.slice(0, 5).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="about-section" id="about">
        <div className="about-inner">
          <div>
            <p className="eyebrow">A LITTLE ABOUT WEBORA</p>

            <h2>
              {profile?.name || 'WEBORA'}
              <br />
              <span>
                {profile?.headline || 'Thoughtful software solutions.'}
              </span>
            </h2>
          </div>

          <div className="about-content">
            <p>
              {profile?.bio ||
                'We approach software with a focus on clarity, usability and long-term maintainability.'}
            </p>

            <p>
              {profile?.location && `Based in ${profile.location}. `}
              Webora works across web development, software solutions and
              maintenance, with an emphasis on understanding the problem
              before choosing the technology.
            </p>

            <Link className="text-link" to="/about">
              More about us <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <ProcessSection />

      <FaqSection limit={4} showAllLink />

      <section className="contact-section" id="contact">
        <div className="contact-orb" />

        <p className="eyebrow">HAVE A PROJECT IN MIND?</p>

        <h2>
          Let's make
          <br />
          <span>it happen.</span>
        </h2>

        <p>
          Tell us what you are looking to build, improve or maintain.
          Let's start with a conversation.
        </p>

        <Link className="button primary" to="/contact">
          Start a conversation <ArrowUpRight size={16} />
        </Link>
      </section>
    </>
  )
}