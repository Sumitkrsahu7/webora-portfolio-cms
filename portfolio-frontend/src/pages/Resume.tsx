import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Download,
  Printer,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Globe,
  Briefcase,
  Code2,
  FolderGit2,
  ArrowUpRight,
  Sparkles
} from 'lucide-react'
import {
  getProfile,
  getExperiences,
  getSkills,
  getProjects,
  subscribeApiCache,
  type SiteProfile,
  type Experience,
  type Skill
} from '../api'
import type { Project } from '../types'
import { formatMonthYear, isSafeExternalUrl } from '../utils'

export default function Resume() {
  const [profile, setProfile] = useState<SiteProfile | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

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

    const applySkills = (data: Skill[]) => {
      if (!active) return
      setSkills(
        data
          .filter((s) => s.published)
          .sort((a, b) => a.displayOrder - b.displayOrder)
      )
    }

    const applyProjects = (data: Project[]) => {
      if (!active) return
      setProjects(
        data
          .filter((p) => p.status === 'PUBLISHED')
          .slice(0, 4)
      )
    }

    const unsubProfile = subscribeApiCache<SiteProfile>('/public/profile', (d) => active && setProfile(d))
    const unsubExp = subscribeApiCache<Experience[]>('/public/experiences', applyExperiences)
    const unsubSkills = subscribeApiCache<Skill[]>('/public/skills', applySkills)
    const unsubProjects = subscribeApiCache<Project[]>('/public/projects', applyProjects)

    Promise.allSettled([
      getProfile(),
      getExperiences(),
      getSkills(),
      getProjects(),
    ]).then(([profileRes, expRes, skillsRes, projRes]) => {
      if (!active) return

      if (profileRes.status === 'fulfilled') setProfile(profileRes.value)
      if (expRes.status === 'fulfilled') applyExperiences(expRes.value)
      if (skillsRes.status === 'fulfilled') applySkills(skillsRes.value)
      if (projRes.status === 'fulfilled') applyProjects(projRes.value)

      setLoading(false)
    })

    return () => {
      active = false
      unsubProfile()
      unsubExp()
      unsubSkills()
      unsubProjects()
    }
  }, [])

  // Print only after all dynamic resume sections have finished loading
  useEffect(() => {
    if (!loading && searchParams.get('print') === '1') {
      const raf = requestAnimationFrame(() => {
        window.print()
        navigate('/resume', { replace: true })
      })
      return () => cancelAnimationFrame(raf)
    }
  }, [loading, searchParams, navigate])

  function handlePrint() {
    window.print()
  }

  function formatDateRange(startDateStr: string, endDateStr: string | null, isCurrent: boolean) {
    const start = formatMonthYear(startDateStr)
    if (isCurrent) return `${start} — Present`
    if (!endDateStr) return start
    return `${start} — ${formatMonthYear(endDateStr)}`
  }

  const skillsByCategory = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category?.trim() || 'Core Competencies'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  const displayName = profile?.name?.trim() || 'WEBORA'
  const displayHeadline =
    profile?.headline?.trim() || 'Software Development & Digital Solutions'
  const displayLocation = profile?.location?.trim() || ''
  const displayEmail = profile?.email?.trim() || ''
  const displayBio =
    profile?.bio?.trim() ||
    'Building reliable web applications, e-commerce platforms, and maintainable business software.'

  return (
    <section className="page-section resume-page">
      <div className="resume-toolbar" aria-label="Resume actions">
        <div className="toolbar-info">
          <p className="eyebrow">COMPANY & CAPABILITY SUMMARY</p>
          <h2>{displayName}</h2>
        </div>

        <div className="toolbar-actions">
          {isSafeExternalUrl(profile?.resumeUrl, true) && (
            <a
              href={profile!.resumeUrl!.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="button primary"
            >
              <Download size={15} /> Download PDF
            </a>
          )}

          <button
            type="button"
            className="button secondary"
            onClick={handlePrint}
            disabled={loading}
            title="Print or save as high-resolution PDF"
          >
            <Printer size={15} /> Print / Save PDF
          </button>

          <Link to="/contact" className="button secondary">
            <Mail size={15} /> Contact
          </Link>
        </div>
      </div>

      <article className="resume-paper" id="resume-document">
        <header className="resume-header">
          <div className="resume-header-main">
            <h1 className="resume-name">{displayName}</h1>
            <p className="resume-title">{displayHeadline}</p>
          </div>

          <div className="resume-contact-links">
            {displayLocation && (
              <span className="contact-item">
                <MapPin size={14} /> {displayLocation}
              </span>
            )}
            {displayEmail && (
              <a href={`mailto:${displayEmail}`} className="contact-item">
                <Mail size={14} /> {displayEmail}
              </a>
            )}
            {isSafeExternalUrl(profile?.githubUrl) && (
              <a
                href={profile!.githubUrl!.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
              >
                <Github size={14} /> GitHub
              </a>
            )}
            {isSafeExternalUrl(profile?.linkedinUrl) && (
              <a
                href={profile!.linkedinUrl!.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-item"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
            <Link to="/" className="contact-item">
              <Globe size={14} /> Website
            </Link>
          </div>
        </header>

        <section className="resume-section">
          <h2 className="resume-section-heading">
            <Sparkles size={16} /> Overview
          </h2>
          <p className="resume-summary-text">{displayBio}</p>
        </section>

        {skills.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading">
              <Code2 size={16} /> Technical Competencies & Architecture
            </h2>
            <div className="resume-skills-grid">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div key={category} className="resume-skill-group">
                  <h3 className="resume-skill-cat">{category}</h3>
                  <div className="resume-skill-tags">
                    {items.map((s) => (
                      <span key={s.id} className="resume-skill-badge">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="resume-section">
          <h2 className="resume-section-heading">
            <Briefcase size={16} /> Experience & Milestones
          </h2>

          {loading ? (
            <div className="resume-loading-state">Loading experience entries...</div>
          ) : experiences.length === 0 ? (
            <p className="resume-summary-text">
              No published experience entries are listed yet.
            </p>
          ) : (
            <div className="resume-experience-list">
              {experiences.map((exp) => (
                <article key={exp.id} className="resume-experience-card">
                  <div className="exp-card-header">
                    <div>
                      <h3 className="exp-role">{exp.roleTitle}</h3>
                      <p className="exp-company">
                        {isSafeExternalUrl(exp.companyUrl) ? (
                          <a
                            href={exp.companyUrl!.trim()}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {exp.company} <ArrowUpRight size={13} />
                          </a>
                        ) : (
                          exp.company
                        )}
                        {exp.location && <span className="exp-location"> · {exp.location}</span>}
                      </p>
                    </div>

                    <div className="exp-meta-right">
                      <span className="exp-dates">
                        {formatDateRange(exp.startDate, exp.endDate, exp.currentRole)}
                      </span>
                      {exp.currentRole && <span className="exp-current-pill">Current</span>}
                    </div>
                  </div>

                  <div className="exp-description">
                    {exp.description.split('\n').filter(Boolean).map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  {exp.technologies && (
                    <div className="exp-tech-row">
                      {exp.technologies
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tech) => (
                          <span key={tech} className="exp-tech-pill">
                            {tech}
                          </span>
                        ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {projects.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading">
              <FolderGit2 size={16} /> Selected Delivered Projects
            </h2>

            <div className="resume-projects-grid">
              {projects.map((proj) => (
                <div key={proj.id} className="resume-project-item">
                  <div className="resume-project-header">
                    <h4>{proj.title}</h4>
                    <Link to={`/projects/${proj.slug}`} className="resume-project-link">
                      View Project <ArrowUpRight size={12} />
                    </Link>
                  </div>
                  <p className="resume-project-desc">{proj.shortDescription}</p>
                  <div className="resume-project-tech">
                    {proj.technologies.slice(0, 5).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </section>
  )
}
