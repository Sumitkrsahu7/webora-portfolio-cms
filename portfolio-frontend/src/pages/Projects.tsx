
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Layers3 } from 'lucide-react'
import { getProjects, assetUrl, prefetchProject, subscribeApiCache } from '../api'
import type { Project } from '../types'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getProjects()
      .then((data) => {
        if (active) setProjects(data.filter((p) => p.status === 'PUBLISHED'))
      })
      .catch(() => {
        if (active) setError('Unable to load projects. Please try again later.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    const unsubscribe = subscribeApiCache<Project[]>('/public/projects', (data) => {
      if (active) setProjects(data.filter((p) => p.status === 'PUBLISHED'))
    })

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return (
    <section className="page-section">
      <p className="eyebrow">OUR WORK</p>
      <h1 className="page-title">Selected <span>projects.</span></h1>
      <p className="page-intro">
        A collection of projects and digital solutions published by Webora.
      </p>

      {loading && (
        <div className="project-grid page-project-grid" aria-busy="true" aria-label="Loading projects">
          {[1, 2, 3, 4].map((i) => (
            <article className="project-card skeleton-project-card" key={i}>
              <div className="project-image skeleton-shimmer" />
              <div className="project-meta">
                <div className="skeleton-line skeleton-shimmer" style={{ width: '60px', height: '10px' }} />
                <div className="skeleton-line skeleton-shimmer" style={{ width: '80px', height: '10px' }} />
              </div>
              <div className="skeleton-line skeleton-title skeleton-shimmer" style={{ height: '24px' }} />
              <div className="skeleton-line skeleton-shimmer" />
            </article>
          ))}
        </div>
      )}
      {error && <div className="empty-state error-state">{error}</div>}
      {!loading && !error && projects.length === 0 && (
        <div className="empty-state">No published projects are available yet.</div>
      )}

      {!loading && !error && projects.length > 0 && (
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
                <span className="image-arrow"><ArrowUpRight size={19} /></span>
              </Link>
              <div className="project-meta">
                <span>{project.category || 'PROJECT'}</span>
                <span>{project.featured ? 'FEATURED' : 'SELECTED WORK'}</span>
              </div>
              <h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3>
              <p>{project.shortDescription}</p>
              <div className="tags">
                {project.technologies?.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
