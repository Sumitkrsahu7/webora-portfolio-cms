
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Wrench,
  MonitorSmartphone,
  Workflow,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'


import {
  getSkills,
  getServices,
  getTestimonials,
  assetUrl,
  submitInquiry,
} from '../api'

import type {
  Skill,
  ServiceItem,
  Testimonial,
} from '../api'


function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: React.ReactNode
  description: string
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title">{title}</h1>
      <p className="page-intro">{description}</p>
    </div>
  )
}

export function About() {
  return (
    <section className="page-section">
      <PageHeading
        eyebrow="ABOUT WEBORA"
        title={
          <>
            Thoughtful technology.
            <br />
            <span>Practical outcomes.</span>
          </>
        }
        description="We believe good software starts with understanding the people and problems it is meant to serve."
      />

      <div className="content-columns">
        <div>
          <h2>What we believe</h2>
          <p>
            Technology should solve problems, simplify work and create
            experiences people can use with confidence. Our approach is
            centred on understanding requirements, choosing appropriate
            solutions and building with maintainability in mind.
          </p>
        </div>

        <div>
          <h2>What we do</h2>
          <p>
            Webora focuses on web development, software development and
            software maintenance. We aim to make digital products useful,
            reliable and easier to evolve as requirements change.
          </p>
        </div>
      </div>

      <Link className="button primary" to="/services">
        Explore services <ArrowUpRight size={16} />
      </Link>
    </section>
  )
}

const serviceIconMap: Record<string, LucideIcon> = {
  code: Code2,
  code2: Code2,
  software: Code2,
  development: Code2,
  monitor: MonitorSmartphone,
  monitorSmartphone: MonitorSmartphone,
  website: MonitorSmartphone,
  web: MonitorSmartphone,
  wrench: Wrench,
  maintenance: Wrench,
  workflow: Workflow,
  integration: Workflow,
}

function getServiceIcon(icon?: string | null): LucideIcon {
  if (!icon) return Code2

  return serviceIconMap[icon.trim()] ??
    serviceIconMap[icon.trim().toLowerCase()] ??
    Code2
}

export function Services() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getServices()
      .then((data) => {
        if (active) {
          setServices(
            data
              .filter((service) => service.published)
              .sort((a, b) => a.displayOrder - b.displayOrder),
          )
        }
      })
      .catch(() => {
        if (active) {
          setError('Services are temporarily unavailable.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="page-section">
      <PageHeading
        eyebrow="OUR SERVICES"
        title={
          <>
            Digital solutions
            <br />
            <span>that do the work.</span>
          </>
        }
        description="Practical development and maintenance services for digital products and business workflows."
      />

      {loading && (
        <div className="static-card-grid" aria-busy="true" aria-label="Loading services">
          {[1, 2, 3, 4].map((i) => (
            <article className="static-card skeleton-card" key={i}>
              <div className="skeleton-icon skeleton-shimmer" />
              <div className="skeleton-line skeleton-title skeleton-shimmer" />
              <div className="skeleton-line skeleton-shimmer" />
              <div className="skeleton-line skeleton-short skeleton-shimmer" />
            </article>
          ))}
        </div>
      )}

      {error && (
        <div className="empty-state error-state">{error}</div>
      )}

      {!loading && !error && services.length === 0 && (
        <div className="empty-state">
          Services will appear here when published through the CMS.
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <div className="static-card-grid">
          {services.map((service) => {
            const Icon = getServiceIcon(service.icon)

            return (
              <article className="static-card" key={service.id}>
                <Icon size={27} />
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </article>
            )
          })}
        </div>
      )}

      <Link className="button primary" to="/contact">
        Discuss a project <ArrowUpRight size={16} />
      </Link>
    </section>
  )
}

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getSkills()
      .then((data) => {
        if (active) {
          setSkills(
            data
              .filter((skill) => skill.published)
              .sort((a, b) => a.displayOrder - b.displayOrder),
          )
        }
      })
      .catch(() => {
        if (active) {
          setError('Skills are temporarily unavailable.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const groups = skills.reduce<Record<string, Skill[]>>(
    (result, skill) => {
      const category = skill.category?.trim() || 'Other'

      if (!result[category]) {
        result[category] = []
      }

      result[category].push(skill)
      return result
    },
    {},
  )

  return (
    <section className="page-section">
      <PageHeading
        eyebrow="CAPABILITIES"
        title={
          <>
            The tools behind
            <br />
            <span>the solutions.</span>
          </>
        }
        description="A selection of technologies and engineering areas relevant to the work Webora presents. Specific project stacks are listed on their individual pages."
      />

      {loading && (
        <div className="empty-state">Loading skills...</div>
      )}

      {error && (
        <div className="empty-state error-state">{error}</div>
      )}

      {!loading && !error && skills.length === 0 && (
        <div className="empty-state">
          Skills will appear here when published through the CMS.
        </div>
      )}

      {!loading && !error && skills.length > 0 && (
        <div className="skill-grid">
          {Object.entries(groups).map(([name, categorySkills]) => (
            <div className="skill-card" key={name}>
              <h2>{name}</h2>

              <div className="tags">
                {categorySkills.map((skill) => (
                  <span key={skill.id}>{skill.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="page-note">
        Technology choices depend on each project's requirements. This list
        is a general capability overview, not a claim that every technology
        is used in every project.
      </p>
    </section>
  )
}


export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadTestimonials() {
      try {
        const data = await getTestimonials()

        if (active) {
          setTestimonials(
            [...data].sort(
              (a, b) => a.displayOrder - b.displayOrder
            )
          )
        }
      } catch {
        if (active) {
          setError('Unable to load client feedback. Please try again later.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadTestimonials()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="page-section">
      <PageHeading
        eyebrow="CLIENT STORIES"
        title={
          <>
            Trust is built
            <br />
            <span>through the work.</span>
          </>
        }
        description="We believe feedback should be genuine, specific and shared with permission."
      />

      {loading ? (
        <div className="testimonial-empty">
          <MessageSquare size={30} />
          <h2>Loading client stories...</h2>
          <p>Please wait while we retrieve the latest feedback.</p>
        </div>
      ) : error ? (
        <div className="testimonial-empty">
          <MessageSquare size={30} />
          <h2>Something went wrong.</h2>
          <p>{error}</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="testimonial-empty">
          <MessageSquare size={30} />
          <h2>Client stories are coming soon.</h2>
          <p>
            We are not displaying placeholder reviews or invented client
            endorsements. This space will feature authentic feedback as it
            becomes available.
          </p>
        </div>
      ) : (
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.id}>
              <div className="testimonial-card-content">
                <MessageSquare size={23} />
                <p>{item.content}</p>
              </div>

              <div className="testimonial-author">
                {item.avatarUrl ? (
                  <img
                    src={assetUrl(item.avatarUrl)}
                    alt={item.name}
                    className="testimonial-avatar"
                  />
                ) : (
                  <div className="testimonial-avatar-placeholder">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <h3>{item.name}</h3>
                  {(item.role || item.company) && (
                    <span>
                      {[item.role, item.company]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}



export function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setSuccess('')
    setError('')
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSubmitting(true)
    setSuccess('')
    setError('')

    try {
      await submitInquiry(form)

      setSuccess(
        'Your message has been submitted successfully. We will get back to you soon.'
      )

      setForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page-section">
      <PageHeading
        eyebrow="CONTACT"
        title={
          <>
            Have something
            <br />
            <span>in mind?</span>
          </>
        }
        description="Share what you want to build, improve or maintain. We can start by understanding the problem and discussing the next steps."
      />

      <div className="contact-card">
        <ShieldCheck size={28} />

        <h2>Let's start a conversation.</h2>

        <p>
          Tell us a little about your project, its goals and what kind of help
          you are looking for.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-grid">
            <div className="contact-field">
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field">
              <label htmlFor="contact-email">Email address</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field contact-field-full">
              <label htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What would you like to discuss?"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-field contact-field-full">
              <label htmlFor="contact-message">Your message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={6}
                placeholder="Tell us about your project or requirements..."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {success && (
            <div className="contact-feedback success" role="status" aria-live="polite">
              {success}
            </div>
          )}

          {error && (
            <div className="contact-feedback error" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="button primary contact-submit"
            disabled={submitting}
          >
            {submitting ? 'Sending message...' : 'Send message'}
            {!submitting && <ArrowUpRight size={16} />}
          </button>
        </form>
      </div>
    </section>
  )
}


export function Profile() {
  return (
    <section className="page-section">
      <PageHeading
        eyebrow="WEBORA PROFILE"
        title={
          <>
            A practical partner
            <br />
            <span>for digital work.</span>
          </>
        }
        description="Webora is focused on building, improving and maintaining software and digital experiences."
      />

      <div className="content-columns">
        <div>
          <h2>Focus</h2>
          <p>
            Web development, software development, integrations and ongoing
            software maintenance.
          </p>
        </div>

        <div>
          <h2>Approach</h2>
          <p>
            Understand the requirement, plan the solution, build carefully
            and improve based on feedback.
          </p>
        </div>
      </div>

      <Link className="button primary" to="/contact">
        Work with us <ArrowRight size={16} />
      </Link>
    </section>
  )
}

export function NotFound() {
  return (
    <section className="page-section not-found">
      <p className="eyebrow">404 — PAGE NOT FOUND</p>
      <h1 className="page-title">
        This page <span>isn't here.</span>
      </h1>
      <Link className="button primary" to="/">
        Return home <ArrowUpRight size={16} />
      </Link>
    </section>
  )
}
