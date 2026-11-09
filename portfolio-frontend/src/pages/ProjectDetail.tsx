
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Github, Globe } from 'lucide-react'
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

  return (
    <article className="detail">
      <Link className="back-link" to="/projects"><ArrowLeft size={15} /> All projects</Link>
      <p className="eyebrow">{project.category || 'PROJECT'}</p>
      <h1>{project.title}</h1>
      <p className="detail-intro">{project.shortDescription}</p>

      {project.thumbnailUrl && (
        <img className="detail-image" src={assetUrl(project.thumbnailUrl)} alt={project.title} />
      )}

      <div className="detail-body">
        <div>
          <p>{project.fullDescription || project.shortDescription}</p>

          {project.images && project.images.length > 0 && (
            <div className="detail-gallery">
              {project.images.map((image) => (
                <img
                  key={image.id}
                  src={assetUrl(image.imageUrl)}
                  alt={image.altText || project.title}
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
            {project.liveUrl && !project.liveUrl.includes('example.com') && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <Globe size={15} /> Live project <ArrowUpRight size={13} />
              </a>
            )}
            {project.githubUrl && !project.githubUrl.includes('github.com/example') && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer">
                <Github size={15} /> Source code <ArrowUpRight size={13} />
              </a>
            )}
          </div>
        </aside>
      </div>
    </article>
  )
}
