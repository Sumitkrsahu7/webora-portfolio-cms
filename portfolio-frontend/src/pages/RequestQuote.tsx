import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react'
import {
  getPricingPackages,
  getProfile,
  getServices,
  submitInquiry,
} from '../api'
import type { PricingPackage, ServiceItem, SiteProfile } from '../api'
import { buildWhatsAppUrl } from '../utils'

const BUDGET_OPTIONS = [
  '₹4,000 (Static Website)',
  '₹5,000 – ₹6,000 (Business Website)',
  '₹8,000 – ₹10,000 (Advanced Website)',
  '₹10,000 – ₹25,000',
  '₹25,000+ (Custom Software / E-Commerce)',
  'Need Consultation',
]

const TIMELINE_OPTIONS = [
  'Urgent (1 – 2 weeks)',
  'Standard (2 – 4 weeks)',
  'Flexible (1 – 2 months)',
  'Ongoing / Retainer',
]

export default function RequestQuotePage() {
  const [searchParams] = useSearchParams()
  const initialPackage = searchParams.get('package') || ''
  const initialService = searchParams.get('service') || ''

  const [packages, setPackages] = useState<PricingPackage[]>([])
  const [services, setServices] = useState<ServiceItem[]>([])
  const [profile, setProfile] = useState<SiteProfile | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    projectCategory: initialService,
    selectedPackage: initialPackage,
    budgetRange: '',
    targetTimeline: 'Standard (2 – 4 weeks)',
    preferredContactMethod: 'EMAIL' as 'EMAIL' | 'WHATSAPP' | 'PHONE',
    websiteOrReferenceUrl: '',
    projectRequirements: '',
    hpField: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [submittedAck, setSubmittedAck] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.allSettled([getPricingPackages(), getServices(), getProfile()]).then(
      ([pkgRes, svcRes, profRes]) => {
        if (!active) return
        if (pkgRes.status === 'fulfilled') {
          setPackages(
            pkgRes.value
              .filter((p) => p.published)
              .sort((a, b) => a.displayOrder - b.displayOrder),
          )
        }
        if (svcRes.status === 'fulfilled') {
          setServices(
            svcRes.value
              .filter((s) => s.published)
              .sort((a, b) => a.displayOrder - b.displayOrder),
          )
        }
        if (profRes.status === 'fulfilled') {
          setProfile(profRes.value)
        }
      },
    )
    return () => {
      active = false
    }
  }, [])

  // Pre-match URL params (?package= or ?service=) once CMS records load
  useEffect(() => {
    if (initialPackage && packages.length > 0) {
      const match = packages.find(
        (p) =>
          p.slug?.toLowerCase() === initialPackage.toLowerCase() ||
          p.name.toLowerCase() === initialPackage.toLowerCase(),
      )
      if (match) {
        setForm((prev) => ({
          ...prev,
          selectedPackage: `${match.name} (${match.priceLabel})`,
          budgetRange: prev.budgetRange || match.priceLabel,
        }))
      }
    }
  }, [initialPackage, packages])

  useEffect(() => {
    if (initialService && services.length > 0) {
      const match = services.find(
        (s) =>
          s.slug?.toLowerCase() === initialService.toLowerCase() ||
          s.title.toLowerCase() === initialService.toLowerCase(),
      )
      if (match) {
        setForm((prev) => ({
          ...prev,
          projectCategory: match.title,
        }))
      }
    }
  }, [initialService, services])

  const whatsappHref = useMemo(() => {
    const context = form.selectedPackage || form.projectCategory || 'a software project'
    return buildWhatsAppUrl(
      profile?.whatsappNumber,
      `Hi WEBORA team, I would like a quote for ${context}.`,
    )
  }, [profile?.whatsappNumber, form.selectedPackage, form.projectCategory])

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSubmittedAck('')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.projectRequirements.trim()) {
      setError('Please describe your project goals, pages, or key features.')
      return
    }

    setSubmitting(true)
    setError('')
    setSubmittedAck('')

    try {
      const ack = await submitInquiry({
        inquiryType: 'QUOTE',
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        companyName: form.companyName || undefined,
        projectCategory: form.projectCategory || undefined,
        selectedPackage: form.selectedPackage || undefined,
        budgetRange: form.budgetRange || undefined,
        targetTimeline: form.targetTimeline || undefined,
        preferredContactMethod: form.preferredContactMethod,
        websiteOrReferenceUrl: form.websiteOrReferenceUrl.trim() || undefined,
        projectRequirements: form.projectRequirements.trim(),
        message: form.projectRequirements.trim(),
        subject: form.selectedPackage
          ? `Quote Request: ${form.selectedPackage}`
          : form.projectCategory
            ? `Quote Request: ${form.projectCategory}`
            : 'Project Quote Request',
        hpField: form.hpField || undefined,
      })

      setSubmittedAck(
        ack.message ||
          'Your quote request has been received. We will review your scope and follow up shortly.',
      )
      setForm({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        projectCategory: '',
        selectedPackage: '',
        budgetRange: '',
        targetTimeline: 'Standard (2 – 4 weeks)',
        preferredContactMethod: 'EMAIL',
        websiteOrReferenceUrl: '',
        projectRequirements: '',
        hpField: '',
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to submit your quote request. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">PROJECT ESTIMATE & CONSULTATION</p>
        <h1 className="page-title">
          Request a tailored
          <br />
          <span>project quote.</span>
        </h1>
        <p className="page-subtitle">
          Share your scope, preferred tier, and timeline. We respond with a transparent breakdown, delivery plan, and exact next steps.
        </p>
      </div>

      <div className="quote-layout">
        <div className="contact-card quote-form-card">
          <div className="quote-form-head">
            <ShieldCheck size={24} />
            <div>
              <h2>Project Brief</h2>
              <p>Fields marked * help us prepare an accurate estimate on the first reply.</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Honeypot input hidden from visual and keyboard users */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="quote-hp">Leave this blank</label>
              <input
                id="quote-hp"
                name="hpField"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.hpField}
                onChange={handleChange}
              />
            </div>

            <div className="contact-form-grid">
              <div className="contact-field">
                <label htmlFor="quote-name">Full name *</label>
                <input
                  id="quote-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="quote-email">Business or personal email *</label>
                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor="quote-phone">Phone / WhatsApp</label>
                <input
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="quote-company">Company / Organization</label>
                <input
                  id="quote-company"
                  name="companyName"
                  type="text"
                  placeholder="Optional company name"
                  value={form.companyName}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="quote-category">Service / Solution type</label>
                <select
                  id="quote-category"
                  name="projectCategory"
                  value={form.projectCategory}
                  onChange={handleChange}
                >
                  <option value="">Select service category</option>
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.title}>
                      {svc.title}
                    </option>
                  ))}
                  <option value="Custom Software / Web App">Custom Software / Web App</option>
                  <option value="Maintenance & Redesign">Maintenance & Redesign</option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="quote-package">Pricing tier (optional)</label>
                <select
                  id="quote-package"
                  name="selectedPackage"
                  value={form.selectedPackage}
                  onChange={handleChange}
                >
                  <option value="">Not decided / Custom scope</option>
                  {packages.map((pkg) => {
                    const label = `${pkg.name} (${pkg.priceLabel})`
                    return (
                      <option key={pkg.id} value={label}>
                        {label}
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="quote-budget">Estimated budget</label>
                <select
                  id="quote-budget"
                  name="budgetRange"
                  value={form.budgetRange}
                  onChange={handleChange}
                >
                  <option value="">Select budget range</option>
                  {BUDGET_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="quote-timeline">Target timeline</label>
                <select
                  id="quote-timeline"
                  name="targetTimeline"
                  value={form.targetTimeline}
                  onChange={handleChange}
                >
                  {TIMELINE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="quote-contact-method">Preferred reply channel</label>
                <select
                  id="quote-contact-method"
                  name="preferredContactMethod"
                  value={form.preferredContactMethod}
                  onChange={handleChange}
                >
                  <option value="EMAIL">Email</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="PHONE">Phone call</option>
                </select>
              </div>

              <div className="contact-field">
                <label htmlFor="quote-ref-url">Existing website or reference URL</label>
                <input
                  id="quote-ref-url"
                  name="websiteOrReferenceUrl"
                  type="url"
                  placeholder="https://example.com"
                  value={form.websiteOrReferenceUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="contact-field contact-field-full">
                <label htmlFor="quote-requirements">Project requirements & goals *</label>
                <textarea
                  id="quote-requirements"
                  name="projectRequirements"
                  rows={5}
                  placeholder="Describe what your business needs (pages, admin controls, payments, integrations, or problem to solve)..."
                  value={form.projectRequirements}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {submittedAck && (
              <div className="contact-feedback success" role="status" aria-live="polite">
                {submittedAck}
              </div>
            )}

            {error && (
              <div className="contact-feedback error" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="button primary contact-submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting quote request...' : 'Submit quote request'}
              {!submitting && <ArrowUpRight size={16} />}
            </button>
          </form>
        </div>

        <aside className="quote-sidebar">
          <div className="quote-aside-card">
            <h3>What happens next?</h3>
            <ul className="quote-steps-list">
              <li>
                <CheckCircle2 size={16} />
                <span>We review your requirements and current reference links.</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>You receive a clear scope, milestone timeline, and fixed or custom estimate.</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span>Every launched site includes 6 months of basic post-launch support.</span>
              </li>
            </ul>
            {(profile?.responseSla || profile?.businessHours) && (
              <div className="quote-sla-box">
                <Clock size={16} />
                <div>
                  {profile?.responseSla && <p>{profile.responseSla}</p>}
                  {profile?.businessHours && <small>{profile.businessHours}</small>}
                </div>
              </div>
            )}
          </div>

          {whatsappHref && (
            <div className="quote-aside-card whatsapp-aside">
              <h3>Prefer WhatsApp?</h3>
              <p>Start a quick conversation directly with our team before sharing a full brief.</p>
              <a
                className="button secondary whatsapp-btn"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
                <ArrowUpRight size={15} />
              </a>
            </div>
          )}

          <div className="quote-aside-card">
            <h3>Comparing packages?</h3>
            <p>Review our transparent INR starting tiers and support policy before finalizing your budget.</p>
            <Link className="text-link" to="/pricing">
              View pricing & support policy <ArrowUpRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
