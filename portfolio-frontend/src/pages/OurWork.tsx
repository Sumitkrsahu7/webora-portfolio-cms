import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ExternalLink, Layers3, Play, Quote } from 'lucide-react'
import {
  assetUrl,
  getProjects,
  getTestimonials,
  prefetchProject,
  subscribeApiCache,
  type Testimonial,
} from '../api'
import type { Project } from '../types'
import { parseVideoEmbed } from '../utils'

type WorkFilter = 'ALL' | 'PROJECTS' | 'WRITTEN' | 'VIDEO'

function VideoTestimonialCard({ item }: { item: Testimonial }) {
  const [playing, setPlaying] = useState(false)
  const parsed = parseVideoEmbed(item.videoUrl)
  const customPoster = item.thumbnailUrl ? assetUrl(item.thumbnailUrl, 800) : undefined
  const poster =
    customPoster || (parsed?.kind === 'iframe' ? parsed.posterUrl : undefined)

  return (
    <article className="video-story-card">
      <div className="video-frame-shell">
        {playing && parsed?.kind === 'iframe' ? (
          <iframe
            src={parsed.embedUrl}
            title={`${item.name} video testimonial`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            loading="lazy"
          />
        ) : playing && parsed?.kind === 'video' ? (
          <video src={parsed.streamUrl} poster={poster} controls autoPlay playsInline />
        ) : (
          <button
            type="button"
            className="video-poster-trigger"
            onClick={() => {
              if (parsed?.kind === 'external') {
                window.open(parsed.href, '_blank', 'noopener,noreferrer')
              } else if (parsed) {
                setPlaying(true)
              }
            }}
            aria-label={`Play video testimonial from ${item.name}`}
          >
            {poster ? (
              <img src={poster} alt={item.name} loading="lazy" />
            ) : (
              <div className="video-poster-placeholder">
                <Play size={34} />
              </div>
            )}
            <span className="video-play-badge">
              {parsed?.kind === 'external' ? <ExternalLink size={18} /> : <Play size={18} />}
              <span>{parsed?.kind === 'external' ? 'Watch Video' : 'Play Story'}</span>
            </span>
          </button>
        )}
      </div>

      <div className="video-story-body">
        {item.projectTitle && (
          <span className="video-project-tag">{item.projectTitle}</span>
        )}
        <h3>{item.name}</h3>
        <p className="video-meta">
          {[item.role, item.company].filter(Boolean).join(' · ') || 'Client Partner'}
        </p>
        {item.content && <p className="video-caption">{item.content}</p>}
      </div>
    </article>
  )
}

export default function OurWork() {
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [filter, setFilter] = useState<WorkFilter>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    Promise.allSettled([getProjects(), getTestimonials()])
      .then(([projRes, testRes]) => {
        if (!active) return
        if (projRes.status === 'fulfilled') {
          setProjects(projRes.value.filter((p) => p.status === 'PUBLISHED'))
        } else {
          setError('Some portfolio items could not be loaded right now.')
        }
        if (testRes.status === 'fulfilled') {
          setTestimonials(
            testRes.value
              .filter((t) => t.published)
              .sort((a, b) => a.displayOrder - b.displayOrder)
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    const unsubProj = subscribeApiCache<Project[]>('/public/projects', (data) => {
      if (active) setProjects(data.filter((p) => p.status === 'PUBLISHED'))
    })
    const unsubTest = subscribeApiCache<Testimonial[]>('/public/testimonials', (data) => {
      if (active) {
        setTestimonials(
          data
            .filter((t) => t.published)
            .sort((a, b) => a.displayOrder - b.displayOrder)
        )
      }
    })

    return () => {
      active = false
      unsubProj()
      unsubTest()
    }
  }, [])

  const writtenReviews = testimonials.filter((t) => t.mediaType !== 'VIDEO')
  const videoStories = testimonials.filter((t) => t.mediaType === 'VIDEO' && parseVideoEmbed(t.videoUrl))

  const showProjects = filter === 'ALL' || filter === 'PROJECTS'
  const showWritten = filter === 'ALL' || filter === 'WRITTEN'
  const showVideo = filter === 'ALL' || filter === 'VIDEO'

  return (
    <section className="page-section our-work-page">
      <div className="page-heading">
        <p className="eyebrow">OUR WORK &amp; CLIENT OUTCOMES</p>
        <h1 className="page-title">
          Delivered platforms &amp;
          <br />
          <span>client stories.</span>
        </h1>
        <p className="page-intro">
          Explore production web software built by WEBORA alongside genuine written feedback and client video stories.
        </p>
      </div>

      <div className="work-filter-bar" role="tablist" aria-label="Filter our work showcase">
        {(
          [
            ['ALL', `All (${projects.length + writtenReviews.length + videoStories.length})`],
            ['PROJECTS', `Projects (${projects.length})`],
            ['WRITTEN', `Client Reviews (${writtenReviews.length})`],
            ['VIDEO', `Video Stories (${videoStories.length})`],
          ] as Array<[WorkFilter, string]>
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            className={`work-filter-pill ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && <div className="empty-state error-state" style={{ marginBottom: '28px' }}>{error}</div>}

      {loading && (
        <div className="project-grid page-project-grid" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div className="project-card skeleton-shimmer" style={{ minHeight: '300px' }} key={i} />
          ))}
        </div>
      )}

      {!loading && showProjects && (
        <div className="work-subsection">
          <div className="section-subhead">
            <p className="eyebrow">PORTFOLIO PROJECTS</p>
            <h2>
              Selected <span>case studies.</span>
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">No published projects are available yet.</div>
          ) : (
            <div className="project-grid page-project-grid">
              {projects.map((project) => (
                <article className="project-card" key={project.id}>
                  <Link
                    className="project-image"
                    to={`/projects/${project.slug}`}
                    onPointerEnter={() => prefetchProject(project.slug)}
                    onFocus={() => prefetchProject(project.slug)}
                  >
                    {project.thumbnailUrl ? (
                      <img src={assetUrl(project.thumbnailUrl, 800)} alt={project.title} loading="lazy" />
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
                    <span>{project.featured ? 'FEATURED' : 'SELECTED WORK'}</span>
                  </div>

                  <h3>
                    <Link
                      to={`/projects/${project.slug}`}
                      onPointerEnter={() => prefetchProject(project.slug)}
                    >
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
        </div>
      )}

      {!loading && showWritten && (
        <div className="work-subsection">
          <div className="section-subhead">
            <p className="eyebrow">CLIENT REVIEWS</p>
            <h2>
              What partners say <span>after launch.</span>
            </h2>
          </div>

          {writtenReviews.length === 0 ? (
            <div className="empty-state">Client reviews will appear here once published in the CMS.</div>
          ) : (
            <div className="reviews-grid">
              {writtenReviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-quote-head">
                    <Quote size={20} />
                    {review.projectTitle && (
                      <span className="video-project-tag">{review.projectTitle}</span>
                    )}
                  </div>
                  <p className="review-body">"{review.content}"</p>
                  <div className="review-author">
                    {review.avatarUrl ? (
                      <img src={assetUrl(review.avatarUrl, 160)} alt={review.name} loading="lazy" />
                    ) : (
                      <div className="team-avatar-fallback" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                        {review.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <strong>{review.name}</strong>
                      <span>{[review.role, review.company].filter(Boolean).join(' · ') || 'Client'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && showVideo && (
        <div className="work-subsection">
          <div className="section-subhead">
            <p className="eyebrow">VIDEO TESTIMONIALS</p>
            <h2>
              Verified video <span>stories.</span>
            </h2>
          </div>

          {videoStories.length === 0 ? (
            <div className="empty-state">
              Video stories will appear here whenever published through the WEBORA CMS.
            </div>
          ) : (
            <div className="video-stories-grid">
              {videoStories.map((story) => (
                <VideoTestimonialCard key={story.id} item={story} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="about-cta-row" style={{ marginTop: '48px' }}>
        <Link className="button primary" to="/request-quote">
          Request a Quote <ArrowUpRight size={16} />
        </Link>
        <Link className="button secondary" to="/pricing">
          Explore INR Pricing
        </Link>
      </div>
    </section>
  )
}
