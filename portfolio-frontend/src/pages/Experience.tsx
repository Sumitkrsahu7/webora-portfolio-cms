import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Download,
  CheckCircle2
} from 'lucide-react'
import {
  getExperiences,
  getProfile,
  subscribeApiCache,
  type Experience,
  type SiteProfile
} from '../api'
import { formatMonthYear, isSafeExternalUrl } from '../utils'

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [profile, setProfile] = useState<SiteProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const applyExperiences = (data: Experience[]) => {
      if (!active) return
      setExperiences(
        data
          .filter((e) => e.published)
          .sort((a, b) => a.displayOrder - b.displayOrder)
      )
    }

    const unsubExp = subscribeApiCache<Experience[]>('/public/experiences', applyExperiences)
    const unsubProfile = subscribeApiCache<SiteProfile>('/public/profile', (data) => {
      if (active) setProfile(data)
    })

    Promise.allSettled([getExperiences(), getProfile()]).then(([expRes, profRes]) => {
      if (!active) return

      if (expRes.status === 'fulfilled') {
        applyExperiences(expRes.value)
      } else {
        setError('Unable to load career history. Please try again later.')
      }

      if (profRes.status === 'fulfilled') {
        setProfile(profRes.value)
      }

      setLoading(false)
    })

    return () => {
      active = false
      unsubExp()
      unsubProfile()
    }
  }, [])

  return (
    <section className="page-section experience-page">
      <div className="page-heading">
        <p className="eyebrow">CAREER TIMELINE</p>
        <h1 className="page-title">
          Engineering <span>experience.</span>
        </h1>
        <p className="page-intro">
          Published milestones and engineering experience managed through the WEBORA CMS.
        </p>

        <div className="experience-heading-actions">
          <Link to="/resume" className="button primary">
            <Sparkles size={15} /> View Profile Summary
          </Link>
          {isSafeExternalUrl(profile?.resumeUrl, true) && (
            <a
              href={profile!.resumeUrl!.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="button secondary"
            >
              <Download size={15} /> Download PDF
            </a>
          )}
        </div>
      </div>

      {loading && (
        <div className="timeline-loading" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-timeline-card skeleton-shimmer" />
          ))}
        </div>
      )}

      {error && <div className="empty-state error-state">{error}</div>}

      {!loading && !error && experiences.length === 0 && (
        <div className="empty-state">
          No published experience entries are available right now.
        </div>
      )}

      {!loading && !error && experiences.length > 0 && (
        <div className="timeline-container">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="timeline-item">
              <div className="timeline-marker">
                <span className={`timeline-dot ${exp.currentRole ? 'timeline-dot-active' : ''}`} />
                {index < experiences.length - 1 && <span className="timeline-line" />}
              </div>

              <article className="timeline-card">
                <div className="timeline-card-header">
                  <div>
                    <div className="timeline-meta-badges">
                      <span className="timeline-badge-role">{exp.roleType.replace('_', ' ')}</span>
                      {exp.currentRole && (
                        <span className="timeline-badge-current">
                          <CheckCircle2 size={11} /> Current Role
                        </span>
                      )}
                    </div>

                    <h3 className="timeline-role">{exp.roleTitle}</h3>
                    <p className="timeline-company">
                      {isSafeExternalUrl(exp.companyUrl) ? (
                        <a
                          href={exp.companyUrl!.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="company-link"
                        >
                          {exp.company} <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        exp.company
                      )}
                      {exp.location && (
                        <span className="company-location">
                          <MapPin size={12} /> {exp.location}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="timeline-dates">
                    <Calendar size={13} />
                    <span>
                      {formatMonthYear(exp.startDate)} —{' '}
                      {exp.currentRole ? 'Present' : exp.endDate ? formatMonthYear(exp.endDate) : ''}
                    </span>
                  </div>
                </div>

                <div className="timeline-description">
                  {exp.description.split('\n').filter(Boolean).map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {exp.technologies && (
                  <div className="timeline-tech-stack">
                    {exp.technologies
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tech) => (
                        <span key={tech} className="timeline-tech-pill">
                          {tech}
                        </span>
                      ))}
                  </div>
                )}
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
