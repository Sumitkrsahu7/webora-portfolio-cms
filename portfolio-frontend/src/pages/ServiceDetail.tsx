import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock, Users } from 'lucide-react'
import { getService, getServices, type ServiceItem } from '../api'
import { parseJsonStringList, resolveServiceIcon } from './Services'

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [service, setService] = useState<ServiceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) {
      setError('Service not specified.')
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)
    setError('')

    getService(slug)
      .then((data) => {
        if (active) setService(data)
      })
      .catch(async () => {
        try {
          const all = await getServices()
          const matched = all.find(
            (item) => item.published && (item.slug === slug || item.id === slug)
          )
          if (active) {
            if (matched) setService(matched)
            else setError('The requested service could not be found.')
          }
        } catch {
          if (active) setError('Unable to load service details.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <section className="page-section">
        <div className="empty-state">Loading service overview...</div>
      </section>
    )
  }

  if (error || !service) {
    return (
      <section className="page-section">
        <div className="empty-state error-state">{error || 'Service not found.'}</div>
        <Link className="button secondary" to="/services" style={{ marginTop: '20px' }}>
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </section>
    )
  }

  const Icon = resolveServiceIcon(service.icon)
  const features = parseJsonStringList(service.keyFeaturesJson)
  const deliverables = parseJsonStringList(service.deliverablesJson)

  return (
    <section className="page-section service-detail-page">
      <Link className="back-link" to="/services">
        <ArrowLeft size={15} /> All Services
      </Link>

      <div className="service-detail-hero">
        <div className="service-detail-badge">
          <Icon size={20} />
          <span>WEBORA SERVICE</span>
        </div>

        <h1 className="page-title">{service.title}</h1>
        <p className="page-intro">
          {service.shortDescription || service.description}
        </p>
      </div>

      <div className="service-detail-layout">
        <div className="service-detail-main">
          <div className="service-detail-block">
            <h2>Overview</h2>
            <p className="detail-prose">
              {service.overviewDetails || service.description}
            </p>
          </div>

          {service.targetAudience && (
            <div className="service-detail-block audience-box">
              <div className="audience-header">
                <Users size={18} />
                <h3>Who This Service Is Built For</h3>
              </div>
              <p>{service.targetAudience}</p>
            </div>
          )}

          {features.length > 0 && (
            <div className="service-detail-block">
              <h2>Key Capabilities &amp; Features</h2>
              <ul className="service-checklist">
                {features.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={17} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {deliverables.length > 0 && (
            <div className="service-detail-block">
              <h2>What You Receive (Deliverables)</h2>
              <ul className="service-checklist">
                {deliverables.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={17} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="service-detail-sidebar">
          <div className="service-summary-card">
            <p className="eyebrow">ENGAGEMENT SNAPSHOT</p>

            {service.startingPriceLabel && (
              <div className="snapshot-row">
                <span>Starting Investment</span>
                <strong>{service.startingPriceLabel}</strong>
              </div>
            )}

            {service.deliveryTimeline && (
              <div className="snapshot-row">
                <span>Typical Timeline</span>
                <strong>
                  <Clock size={14} /> {service.deliveryTimeline}
                </strong>
              </div>
            )}

            <div className="snapshot-row">
              <span>Included Post-Launch Support</span>
              <strong>6 Months Basic Support</strong>
            </div>

            <div className="snapshot-actions">
              <Link
                className="button primary full-btn"
                to={`/request-quote?service=${encodeURIComponent(service.title)}`}
              >
                Request a Quote <ArrowUpRight size={16} />
              </Link>
              <Link className="button secondary full-btn" to="/pricing">
                View INR Packages
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
