import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { getFaqs, subscribeApiCache, type FaqItem } from '../api'

const FALLBACK_FAQS: FaqItem[] = [
  {
    id: 'faq-pricing',
    question: 'What is the starting cost for a business website at WEBORA?',
    answer:
      'Static websites start at ₹4,000, multi-page business websites with dynamic CMS control start at ₹5,000 – ₹6,000, and advanced websites with custom modules start at ₹8,000 – ₹10,000. E-commerce and custom software are quoted transparently based on features.',
    category: 'Pricing',
    displayOrder: 1,
    published: true,
  },
  {
    id: 'faq-billing',
    question: 'Are domain name and web hosting included in the package prices?',
    answer:
      'No. Domain registration, cloud hosting, SSL/CDN renewals beyond free tiers, and third-party APIs or payment gateway charges are billed separately so ownership stays 100% in your name.',
    category: 'Billing',
    displayOrder: 2,
    published: true,
  },
  {
    id: 'faq-support',
    question: 'How does the 6-month basic support work after launch?',
    answer:
      'Every launched website includes 6 months of basic post-launch support covering minor text or image guidance, CMS usage help, and bug fixes within the original scope. Major new modules or full redesigns are scoped separately.',
    category: 'Support',
    displayOrder: 3,
    published: true,
  },
  {
    id: 'faq-timeline',
    question: 'How long does it typically take to build and launch a website?',
    answer:
      'Static and starter websites typically launch within 1 – 2 weeks once content is finalized. Business and advanced websites usually take 2 – 4 weeks, while custom platforms follow milestone-based timelines.',
    category: 'Timeline',
    displayOrder: 4,
    published: true,
  },
]

interface FaqSectionProps {
  limit?: number
  showAllLink?: boolean
  showCategoryFilter?: boolean
  eyebrow?: string
  titlePrefix?: string
  titleAccent?: string
}

export default function FaqSection({
  limit,
  showAllLink = false,
  showCategoryFilter = false,
  eyebrow = 'FREQUENTLY ASKED QUESTIONS',
  titlePrefix = 'Answers to common ',
  titleAccent = 'questions.',
}: FaqSectionProps) {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [openId, setOpenId] = useState<string>('')
  const [category, setCategory] = useState<string>('ALL')

  useEffect(() => {
    let active = true
    getFaqs()
      .then((data) => {
        if (!active) return
        const published = data
          .filter((item) => item.published)
          .sort((a, b) => a.displayOrder - b.displayOrder)
        setFaqs(published)
        if (published[0]?.id) setOpenId(published[0].id)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoaded(true)
      })

    const unsub = subscribeApiCache<FaqItem[]>('/public/faqs', (data) => {
      if (!active) return
      setFaqs(
        data
          .filter((item) => item.published)
          .sort((a, b) => a.displayOrder - b.displayOrder),
      )
    })

    return () => {
      active = false
      unsub()
    }
  }, [])

  const sourceList = faqs.length > 0 ? faqs : loaded ? FALLBACK_FAQS : []
  const categories = ['ALL', ...Array.from(new Set(sourceList.map((f) => f.category || 'General')))]

  const filtered =
    showCategoryFilter && category !== 'ALL'
      ? sourceList.filter((item) => (item.category || 'General') === category)
      : sourceList

  const visibleFaqs = typeof limit === 'number' ? filtered.slice(0, limit) : filtered

  return (
    <section className="faq-section">
      <div className="section-subhead">
        <p className="eyebrow">{eyebrow}</p>
        <h2>
          {titlePrefix}
          <span>{titleAccent}</span>
        </h2>
      </div>

      {showCategoryFilter && categories.length > 2 && (
        <div className="filter-pills faq-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`filter-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat === 'ALL' ? 'All topics' : cat}
            </button>
          ))}
        </div>
      )}

      <div className="faq-list">
        {visibleFaqs.map((item) => {
          const isOpen = openId === item.id
          return (
            <article className={`faq-item ${isOpen ? 'open' : ''}`} key={item.id}>
              <button
                type="button"
                className="faq-trigger"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? '' : item.id)}
              >
                <div className="faq-trigger-text">
                  <span className="faq-category-chip">{item.category || 'General'}</span>
                  <span className="faq-question">{item.question}</span>
                </div>
                <ChevronDown size={18} className="faq-chevron" />
              </button>
              {isOpen && <div className="faq-answer">{item.answer}</div>}
            </article>
          )
        })}
      </div>

      {showAllLink && (
        <div className="faq-footer-link">
          <Link className="text-link" to="/faq">
            View all frequently asked questions <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </section>
  )
}
