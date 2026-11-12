import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import FaqSection from '../components/FaqSection'

export default function FaqPage() {
  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">HELP CENTER &amp; FAQ</p>
        <h1 className="page-title">
          Clear answers before
          <br />
          <span>we start building.</span>
        </h1>
        <p className="page-subtitle">
          Everything you need to know about our INR packages, domain and hosting transparency, 6-month basic support, and project timelines.
        </p>
      </div>

      <FaqSection
        showCategoryFilter
        eyebrow="KNOWLEDGE BASE"
        titlePrefix="Browse by "
        titleAccent="topic."
      />

      <div className="cta-banner">
        <div>
          <h2>Still have a specific question?</h2>
          <p>Reach out to discuss your website or custom software goals directly.</p>
        </div>
        <div className="cta-banner-actions">
          <Link className="button primary" to="/request-quote">
            Request a Quote <ArrowUpRight size={16} />
          </Link>
          <Link className="button secondary" to="/contact">
            Contact Us <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
