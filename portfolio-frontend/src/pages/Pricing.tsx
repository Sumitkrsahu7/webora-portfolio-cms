import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, Info, ShieldCheck, AlertCircle } from 'lucide-react'
import {
  getPricingPackages,
  getServicePolicies,
  subscribeApiCache,
  type PricingPackage,
  type ServicePolicy,
} from '../api'
import { parseJsonStringList } from './Services'
import FaqSection from '../components/FaqSection'

const DEFAULT_PACKAGES: Omit<PricingPackage, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Static Website',
    slug: 'static-website',
    categoryLabel: 'STARTER PRESENCE',
    priceLabel: '₹4,000',
    billingNote: 'One-time development fee · Domain & hosting billed separately',
    idealFor: 'Freelancers, local shops, consultants, and early-stage ventures needing a fast online profile.',
    featuresJson: JSON.stringify([
      'Up to 5 responsive pages',
      'Mobile & tablet layout optimization',
      'Contact inquiry form integration',
      'Basic on-page SEO metadata',
      'SSL & production deployment setup',
    ]),
    excludedNote: 'Domain registration, hosting renewals, and custom CMS panels billed separately.',
    supportPeriodLabel: '6 Months Basic Support Included',
    highlighted: false,
    ctaLabel: 'Choose Static Plan',
    displayOrder: 1,
    published: true,
  },
  {
    name: 'Business Website',
    slug: 'business-website',
    categoryLabel: 'MOST POPULAR',
    priceLabel: '₹5,000 – ₹6,000',
    billingNote: 'One-time development fee · Final quote based on page & content scope',
    idealFor: 'Growing businesses, service agencies, and brands wanting CMS control and lead generation.',
    featuresJson: JSON.stringify([
      'Everything in Static Website',
      'Dynamic CMS-managed services & work',
      'WhatsApp & quote request routing',
      'Structured pricing & FAQ sections',
      'Performance & asset optimization',
    ]),
    excludedNote: 'Domain, cloud hosting, and paid third-party integrations remain under client ownership.',
    supportPeriodLabel: '6 Months Basic Support Included',
    highlighted: true,
    ctaLabel: 'Request Business Quote',
    displayOrder: 2,
    published: true,
  },
  {
    name: 'Advanced Website',
    slug: 'advanced-website',
    categoryLabel: 'DYNAMIC & SCALABLE',
    priceLabel: '₹8,000 – ₹10,000',
    billingNote: 'One-time development fee · Tailored to custom modules & admin tools',
    idealFor: 'Established firms needing multi-section dynamic portals, role-based CMS, and rich media galleries.',
    featuresJson: JSON.stringify([
      'Full CMS administration dashboard',
      'Custom database models & REST APIs',
      'Cloudinary image optimization',
      'Interactive quote & filtering workflows',
      'Cross-browser QA & speed tuning',
    ]),
    excludedNote: 'Third-party API subscriptions, cloud hosting plans, and domain renewals billed separately.',
    supportPeriodLabel: '6 Months Basic Support Included',
    highlighted: false,
    ctaLabel: 'Request Advanced Quote',
    displayOrder: 3,
    published: true,
  },
  {
    name: 'E-commerce & Custom Software',
    slug: 'ecommerce-custom-software',
    categoryLabel: 'BESPOKE ENGINEERING',
    priceLabel: 'Custom Quote',
    billingNote: 'Scoped milestone-by-milestone based on functional complexity',
    idealFor: 'D2C stores, SaaS founders, and teams requiring custom backends, checkouts, or workflow automation.',
    featuresJson: JSON.stringify([
      'Full product catalog or portal architecture',
      'Payment gateway & webhook integration',
      'Admin analytics & role-based security',
      'Relational SQL Server schema & migrations',
      'Dedicated architecture planning',
    ]),
    excludedNote: 'External infrastructure, payment gateway fees, and domain/DNS costs billed separately.',
    supportPeriodLabel: '6 Months Basic Support Included',
    highlighted: false,
    ctaLabel: 'Scope Custom Project',
    displayOrder: 4,
    published: true,
  },
]

const DEFAULT_POLICIES: Omit<ServicePolicy, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Domain, Hosting & Third-Party Costs (Billed Separately)',
    policyType: 'SEPARATE_COSTS',
    summary:
      'To maintain 100% client ownership and avoid hidden markups, recurring infrastructure and external licenses remain billed directly to your business.',
    bulletPointsJson: JSON.stringify([
      'Domain registration and annual DNS renewals',
      'Cloud server, database, or managed hosting plans',
      'Paid email, SMS, WhatsApp Business API, or payment gateway fees',
      'Premium fonts, stock media, or paid third-party SaaS plugins',
    ]),
    displayOrder: 1,
    published: true,
  },
  {
    title: '6 Months Basic Support (Included)',
    policyType: 'SUPPORT_INCLUDED',
    summary:
      'Every launched website or software engagement includes a complimentary 6-month basic support window starting from production handover.',
    bulletPointsJson: JSON.stringify([
      'Fixing functional bugs within originally delivered features',
      'Minor text, pricing label, and image updates via CMS or config',
      'Security & runtime health checks on deployed endpoints',
      'Technical guidance for domain/DNS verification issues',
    ]),
    displayOrder: 2,
    published: true,
  },
  {
    title: 'What Is Outside Basic Support (Separately Scoped)',
    policyType: 'SUPPORT_EXCLUDED',
    summary:
      'Clear boundaries prevent surprise invoices. Items outside initial delivered scope are estimated cleanly before any billable work begins.',
    bulletPointsJson: JSON.stringify([
      'Building brand-new pages, e-commerce modules, or workflow features',
      'Complete visual redesigns after final sign-off',
      'Troubleshooting third-party provider outages or unpaid hosting renewals',
      'Major platform migrations or custom SLA retainers beyond 6 months',
    ]),
    displayOrder: 3,
    published: true,
  },
]

function policyIcon(type: ServicePolicy['policyType']) {
  switch (type) {
    case 'SUPPORT_INCLUDED':
      return ShieldCheck
    case 'SUPPORT_EXCLUDED':
      return AlertCircle
    default:
      return Info
  }
}

export default function Pricing() {
  const [packages, setPackages] = useState<PricingPackage[]>([])
  const [policies, setPolicies] = useState<ServicePolicy[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true

    Promise.allSettled([getPricingPackages(), getServicePolicies()])
      .then(([pkgRes, polRes]) => {
        if (!active) return
        if (pkgRes.status === 'fulfilled') {
          setPackages(pkgRes.value.filter((p) => p.published))
        }
        if (polRes.status === 'fulfilled') {
          setPolicies(polRes.value.filter((p) => p.published))
        }
      })
      .finally(() => {
        if (active) setLoaded(true)
      })

    const unsubPkg = subscribeApiCache<PricingPackage[]>('/public/pricing', (data) => {
      if (active) setPackages(data.filter((p) => p.published))
    })
    const unsubPol = subscribeApiCache<ServicePolicy[]>('/public/policies', (data) => {
      if (active) setPolicies(data.filter((p) => p.published))
    })

    return () => {
      active = false
      unsubPkg()
      unsubPol()
    }
  }, [])

  const activePackages =
    packages.length > 0
      ? [...packages].sort((a, b) => a.displayOrder - b.displayOrder)
      : DEFAULT_PACKAGES

  const activePolicies =
    policies.length > 0
      ? [...policies].sort((a, b) => a.displayOrder - b.displayOrder)
      : DEFAULT_POLICIES

  return (
    <section className="page-section pricing-page">
      <div className="page-heading">
        <p className="eyebrow">TRANSPARENT INR PRICING</p>
        <h1 className="page-title">
          Clear investment tiers,
          <br />
          <span>zero hidden retainers.</span>
        </h1>
        <p className="page-intro">
          Start with a right-sized static, business, or advanced package—with 6 months of basic post-launch support included and domain/hosting costs kept transparently in your name.
        </p>
      </div>

      {!loaded && (
        <div className="pricing-grid" aria-busy="true">
          {[1, 2, 3, 4].map((i) => (
            <div className="pricing-card skeleton-shimmer" style={{ minHeight: '380px' }} key={i} />
          ))}
        </div>
      )}

      {loaded && (
        <div className="pricing-grid">
          {activePackages.map((pkg) => {
            const features = parseJsonStringList(pkg.featuresJson)
            return (
              <article
                className={`pricing-card ${pkg.highlighted ? 'pricing-card-featured' : ''}`}
                key={pkg.slug + pkg.name}
              >
                <div className="pricing-card-head">
                  {pkg.categoryLabel && (
                    <span className="pricing-badge">{pkg.categoryLabel}</span>
                  )}
                  <h2>{pkg.name}</h2>
                  <div className="pricing-amount">{pkg.priceLabel}</div>
                  {pkg.billingNote && (
                    <p className="pricing-billing-note">{pkg.billingNote}</p>
                  )}
                </div>

                {pkg.idealFor && <p className="pricing-ideal">{pkg.idealFor}</p>}

                {pkg.supportPeriodLabel && (
                  <div className="pricing-support-pill">
                    <ShieldCheck size={14} />
                    <span>{pkg.supportPeriodLabel}</span>
                  </div>
                )}

                {features.length > 0 && (
                  <ul className="pricing-features">
                    {features.map((feat) => (
                      <li key={feat}>
                        <CheckCircle2 size={15} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {pkg.excludedNote && (
                  <p className="pricing-exclusion">{pkg.excludedNote}</p>
                )}

                <Link
                  className={`button ${pkg.highlighted ? 'primary' : 'secondary'} full-btn`}
                  to={`/request-quote?package=${encodeURIComponent(pkg.name)}`}
                >
                  {pkg.ctaLabel || 'Request a Quote'} <ArrowUpRight size={16} />
                </Link>
              </article>
            )
          })}
        </div>
      )}

      <div className="policies-section">
        <div className="section-subhead">
          <p className="eyebrow">SEPARATE COSTS &amp; SUPPORT TERMS</p>
          <h2>
            What is separate &amp; how <span>6-month support works.</span>
          </h2>
        </div>

        <div className="policy-grid">
          {activePolicies.map((pol) => {
            const Icon = policyIcon(pol.policyType)
            const bullets = parseJsonStringList(pol.bulletPointsJson)
            return (
              <article className={`policy-card policy-${pol.policyType.toLowerCase()}`} key={pol.title}>
                <div className="policy-icon-row">
                  <Icon size={20} />
                  <span>{pol.policyType.replace('_', ' ')}</span>
                </div>
                <h3>{pol.title}</h3>
                <p className="policy-summary">{pol.summary}</p>
                {bullets.length > 0 && (
                  <ul className="policy-bullets">
                    {bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            )
          })}
        </div>
      </div>

      <FaqSection
        limit={4}
        showAllLink
        eyebrow="PRICING & SUPPORT FAQ"
        titlePrefix="Questions on billing & "
        titleAccent="6-month support."
      />
    </section>
  )
}
