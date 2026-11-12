import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Github, Globe } from 'lucide-react'
import { getProject, assetUrl } from '../api'
import type { Project } from '../types'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return

    getProject(slug)
      .then(setProject)
      .catch(() => setError('This project could not be found.'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <section className="page-section"><div className="empty-state">Loading project...</div></section>
  if (error || !project) {
    return (
      <section className="page-section">
        <div className="empty-state error-state">{error || 'Project not found.'}</div>
        <Link className="text-link" to="/projects"><ArrowLeft size={15} /> Back to projects</Link>
      </section>
    )
  }

  const shortDesc = project.shortDescription?.trim() || ''
  const fullDesc = project.fullDescription?.trim() || ''
  const hasDistinctFullDescription = Boolean(
    fullDesc &&
    fullDesc.toLowerCase() !== shortDesc.toLowerCase()
  )

  const isSafeExternalUrl = (url?: string | null): boolean => {
    if (!url) return false
    const trimmed = url.trim()
    return (
      (trimmed.startsWith('https://') || trimmed.startsWith('http://')) &&
      !trimmed.includes('example.com') &&
      !trimmed.includes('example.org') &&
      !trimmed.includes('github.com/example')
    )
  }

  return (
    <article className="detail">
      <Link className="back-link" to="/projects"><ArrowLeft size={15} /> All projects</Link>
      <p className="eyebrow">{project.category || 'PROJECT'}</p>
      <h1>{project.title}</h1>
      {shortDesc && <p className="detail-intro">{shortDesc}</p>}

      {project.thumbnailUrl && (
        <img className="detail-image" src={assetUrl(project.thumbnailUrl, 1400)} alt={project.title} />
      )}

      <div className="detail-body">
        <div>
          {hasDistinctFullDescription && (
            <p className="detail-full-description">{fullDesc}</p>
          )}
          {!shortDesc && fullDesc && !hasDistinctFullDescription && (
            <p className="detail-intro">{fullDesc}</p>
          )}

          {project.images && project.images.length > 0 && (
            <div className="detail-gallery">
              {project.images.map((image) => (
                <img
                  key={image.id}
                  src={assetUrl(image.imageUrl, 1400)}
                  alt={image.altText || project.title}
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        <aside>
          <p className="eyebrow">TECHNOLOGIES</p>
          <div className="tags">
            {project.technologies?.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>

          <div className="detail-links">
            {isSafeExternalUrl(project.liveUrl) && (
              <a
                className="button primary"
                href={project.liveUrl!.trim()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={16} /> Live application
              </a>
            )}

            {isSafeExternalUrl(project.githubUrl) && (
              <a
                className="button secondary"
                href={project.githubUrl!.trim()}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} /> Source repository
              </a>
            )}
          </div>
        </aside>
      </div>
    </article>
  )
}
