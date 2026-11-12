import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Github, Linkedin, ShieldCheck, Layers3, Clock, Compass } from 'lucide-react'
import {
  assetUrl,
  getProfile,
  getTeamMembers,
  subscribeApiCache,
  type SiteProfile,
  type TeamMember,
} from '../api'
import { isSafeExternalUrl } from '../utils'

interface DifferentiatorPillar {
  code: string
  title: string
  description: string
}

const DEFAULT_PILLARS: DifferentiatorPillar[] = [
  {
    code: '01',
    title: 'Business-First Engineering',
    description:
      'Every website, application, and integration starts with operational workflow and measurable commercial utility rather than decorative complexity.',
  },
  {
    code: '02',
    title: 'Transparent INR Scoping & Pricing',
    description:
      'Structured package tiers, clear separation between build cost and external domain/hosting bills, and milestone visibility from day one.',
  },
  {
    code: '03',
    title: 'Production Security & Speed',
    description:
      'Clean full-stack architecture, validated APIs, role-based CMS administration, and optimized asset delivery across mobile and desktop.',
  },
  {
    code: '04',
    title: '6-Month Basic Support Window',
    description:
      'Ongoing post-launch basic support covers bug fixes and minor operational adjustments cleanly without locking clients out of their platform.',
  },
]

function parsePillars(rawJson?: string | null): DifferentiatorPillar[] {
  if (!rawJson) return DEFAULT_PILLARS
  try {
    const parsed = JSON.parse(rawJson)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
        .filter((item) => item && typeof item.title === 'string' && typeof item.description === 'string')
        .slice(0, 4)
        .map((item, idx) => ({
          code: typeof item.code === 'string' ? item.code : String(idx + 1).padStart(2, '0'),
          title: item.title,
          description: item.description,
        }))
    }
  } catch {
    // Fall back to default engineering pillars when JSON is absent or malformed
  }
  return DEFAULT_PILLARS
}

const PILLAR_ICONS = [Compass, Layers3, ShieldCheck, Clock]

export default function About() {
  const [profile, setProfile] = useState<SiteProfile | null>(null)
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    Promise.allSettled([getProfile(), getTeamMembers()])
      .then(([profileRes, teamRes]) => {
        if (!active) return
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value)
        if (teamRes.status === 'fulfilled') {
          setTeam(teamRes.value.filter((m) => m.published))
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    const unsubProfile = subscribeApiCache<SiteProfile>('/public/profile', (data) => {
      if (active) setProfile(data)
    })
    const unsubTeam = subscribeApiCache<TeamMember[]>('/public/team', (data) => {
      if (active) setTeam(data.filter((m) => m.published))
    })

    return () => {
      active = false
      unsubProfile()
      unsubTeam()
    }
  }, [])

  const pillars = parsePillars(profile?.differentiatorsJson)

  return (
    <div className="page-section about-page">
      {/* Section 1: About WEBORA */}
      <section className="about-overview-block">
        <div className="page-heading">
          <p className="eyebrow">ABOUT WEBORA</p>
          <h1 className="page-title">
            Software systems built for
            <br />
            <span>real business growth.</span>
          </h1>
          <p className="page-intro">
            {profile?.companyTagline ||
              profile?.headline ||
              'WEBORA is a software development and digital solutions agency focused on practical architecture, clear delivery, and dependable long-term maintenance.'}
          </p>
        </div>

        <div className="content-columns">
          <div>
            <h2>Who we are</h2>
            <p>
              {profile?.companyStory ||
                profile?.bio ||
                'WEBORA partners with startups, growing service businesses, and organizations to design and build reliable websites, e-commerce storefronts, custom web applications, and digital workflows.'}
            </p>
          </div>

          <div>
            <h2>How we partner with clients</h2>
            <p>
              We start by understanding your business operations, target customers, and budget before selecting technology. Every build prioritizes maintainability, fast loading speeds, and straightforward CMS control.
            </p>
            <div className="about-meta-pills">
              {profile?.location && <span>{profile.location}</span>}
              {profile?.businessHours && <span>{profile.businessHours}</span>}
              {profile?.responseSla && <span>Response SLA: {profile.responseSla}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What Makes Us Different */}
      <section className="about-pillars-section">
        <div className="section-subhead">
          <p className="eyebrow">WHY WEBORA</p>
          <h2>
            What makes us <span>different.</span>
          </h2>
        </div>

        <div className="pillars-grid">
          {pillars.map((pillar, idx) => {
            const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length]
            return (
              <article className="pillar-card" key={pillar.code + pillar.title}>
                <div className="pillar-top">
                  <span className="pillar-index">{pillar.code}</span>
                  <Icon size={20} />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      {/* Section 3: Meet the Team */}
      <section className="about-team-section">
        <div className="section-subhead">
          <p className="eyebrow">MEET THE TEAM</p>
          <h2>
            The engineering &amp; product minds <span>behind WEBORA.</span>
          </h2>
        </div>

        {loading && (
          <div className="team-grid" aria-busy="true">
            {[1, 2, 3].map((i) => (
              <div className="team-card skeleton-shimmer" style={{ minHeight: '220px' }} key={i} />
            ))}
          </div>
        )}

        {!loading && team.length === 0 && (
          <div className="empty-state">
            Team profiles are managed through the WEBORA CMS and will appear here as soon as published.
          </div>
        )}

        {!loading && team.length > 0 && (
          <div className="team-grid">
            {team.map((member) => (
              <article className="team-card" key={member.id}>
                <div className="team-card-header">
                  {member.avatarUrl ? (
                    <img
                      className="team-avatar"
                      src={assetUrl(member.avatarUrl, 320)}
                      alt={member.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="team-avatar-fallback" aria-hidden="true">
                      {member.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3>{member.name}</h3>
                    <p className="team-role">{member.roleTitle}</p>
                    {member.specialty && <span className="team-specialty">{member.specialty}</span>}
                  </div>
                </div>

                {member.bio && <p className="team-bio">{member.bio}</p>}

                {(isSafeExternalUrl(member.linkedinUrl) || isSafeExternalUrl(member.githubUrl)) && (
                  <div className="team-links">
                    {isSafeExternalUrl(member.linkedinUrl) && (
                      <a
                        href={member.linkedinUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin size={15} /> LinkedIn
                      </a>
                    )}
                    {isSafeExternalUrl(member.githubUrl) && (
                      <a
                        href={member.githubUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} GitHub`}
                      >
                        <Github size={15} /> GitHub
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="about-cta-row">
        <Link className="button primary" to="/request-quote">
          Request a Quote <ArrowUpRight size={16} />
        </Link>
        <Link className="button secondary" to="/services">
          Explore our services
        </Link>
      </div>
    </div>
  )
}
