import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Cloud,
  Code2,
  Database,
  Globe,
  Layers3,
  MonitorSmartphone,
  Palette,
  ShieldCheck,
  Smartphone,
  Wrench,
  Workflow,
  Clock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  getServices,
  prefetchRouteData,
  prefetchService,
  subscribeApiCache,
  type ServiceItem,
} from '../api'
import ProcessSection from '../components/ProcessSection'

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
  layers: Layers3,
  layers3: Layers3,
  ecommerce: Layers3,
  architecture: Layers3,
  palette: Palette,
  design: Palette,
  uiux: Palette,
  shield: ShieldCheck,
  shieldcheck: ShieldCheck,
  security: ShieldCheck,
  cloud: Cloud,
  globe: Globe,
  website: Globe,
  workflow: Workflow,
  wrench: Wrench,
  maintenance: Wrench,
  support: Wrench,
}

export function resolveServiceIcon(iconName: string | null | undefined): LucideIcon {
  const key = iconName?.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || ''
  return serviceIconMap[key] || Workflow
}

export function parseJsonStringList(raw?: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map((v) => String(v).trim()).filter(Boolean)
    }
  } catch {
    return raw.split(/\r?\n/).map((v) => v.trim()).filter(Boolean)
  }
  return []
}

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getServices()
      .then((data) => {
        if (active) {
          setServices(
            data
              .filter((item) => item.published)
              .sort((a, b) => a.displayOrder - b.displayOrder)
          )
        }
      })
      .catch(() => {
        if (active) setError('Unable to load services. Please try again later.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    const unsub = subscribeApiCache<ServiceItem[]>('/public/services', (data) => {
      if (active) {
        setServices(
          data
            .filter((item) => item.published)
            .sort((a, b) => a.displayOrder - b.displayOrder)
        )
      }
    })

    return () => {
      active = false
      unsub()
    }
  }, [])

  return (
    <>
      <section className="page-section">
        <div className="page-heading">
          <p className="eyebrow">SERVICES &amp; CAPABILITIES</p>
          <h1 className="page-title">
            Software solutions built for
            <br />
            <span>clarity, scale &amp; reliability.</span>
          </h1>
          <p className="page-intro">
            From high-converting company websites and online stores to bespoke web applications and ongoing support, every engagement follows a structured delivery plan.
          </p>
        </div>

        {loading && (
          <div className="services-page-grid" aria-busy="true">
            {[1, 2, 3, 4].map((i) => (
              <div className="service-business-card skeleton-shimmer" style={{ minHeight: '260px' }} key={i} />
            ))}
          </div>
        )}

        {error && <div className="empty-state error-state">{error}</div>}

        {!loading && !error && services.length === 0 && (
          <div className="empty-state">No published services are available yet.</div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="services-page-grid">
            {services.map((service, index) => {
              const Icon = resolveServiceIcon(service.icon)
              const features = parseJsonStringList(service.keyFeaturesJson).slice(0, 3)
              const routeSlug = service.slug || service.id

              return (
                <article className="service-business-card" key={service.id}>
                  <div className="service-card-top">
                    <span className="service-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="service-icon-box" aria-hidden="true">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h2>{service.title}</h2>

                  <p className="service-summary">
                    {service.shortDescription || service.description}
                  </p>

                  {features.length > 0 && (
                    <ul className="service-feature-preview">
                      {features.map((feat) => (
                        <li key={feat}>{feat}</li>
                      ))}
                    </ul>
                  )}

                  <div className="service-card-meta">
                    {service.startingPriceLabel && (
                      <span className="service-pill">{service.startingPriceLabel}</span>
                    )}
                    {service.deliveryTimeline && (
                      <span className="service-pill muted-pill">
                        <Clock size={12} /> {service.deliveryTimeline}
                      </span>
                    )}
                  </div>

                  <div className="service-card-actions">
                    <Link
                      className="button secondary small-btn"
                      to={`/services/${routeSlug}`}
                      onPointerEnter={() => service.slug && prefetchService(service.slug)}
                      onFocus={() => service.slug && prefetchService(service.slug)}
                    >
                      {service.ctaLabel || 'Explore Service'} <ArrowUpRight size={15} />
                    </Link>

                    <Link
                      className="text-link"
                      to={`/request-quote?service=${encodeURIComponent(service.title)}`}
                      onPointerEnter={() => prefetchRouteData('/request-quote')}
                    >
                      Request Quote
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <ProcessSection />
    </>
  )
}
