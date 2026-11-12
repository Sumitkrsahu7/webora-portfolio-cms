import { useEffect, useState } from 'react'
import { getProcessSteps, subscribeApiCache, type ProcessStep } from '../api'

const DEFAULT_PROCESS_STEPS: Array<{
  stepNumber: number
  title: string
  description: string
  deliverableHint: string
}> = [
  {
    stepNumber: 1,
    title: 'Discovery',
    description: 'We align on your business goals, target users, operational pain points, and technical constraints.',
    deliverableHint: 'Requirement Brief',
  },
  {
    stepNumber: 2,
    title: 'Planning & Strategy',
    description: 'Scope definition, transparent INR estimate, milestone breakdown, and technology selection.',
    deliverableHint: 'Architecture & Scope Plan',
  },
  {
    stepNumber: 3,
    title: 'UI/UX Design',
    description: 'Clean information architecture, responsive layouts, and intuitive user flows before coding begins.',
    deliverableHint: 'Interactive Wireframes & UI System',
  },
  {
    stepNumber: 4,
    title: 'Engineering & Development',
    description: 'Modular frontend, validated APIs, database schema migrations, and CMS integration built cleanly.',
    deliverableHint: 'Staging Build & CMS Setup',
  },
  {
    stepNumber: 5,
    title: 'QA & Launch',
    description: 'Cross-device testing, security validation, performance tuning, and production deployment.',
    deliverableHint: 'Live Production Release',
  },
  {
    stepNumber: 6,
    title: 'Post-Launch Support',
    description: 'Six months of included basic support for bug fixes and minor updates, with long-term options.',
    deliverableHint: '6-Month Basic Support Window',
  },
]

export default function ProcessSection() {
  const [steps, setSteps] = useState<ProcessStep[]>([])

  useEffect(() => {
    let active = true
    getProcessSteps()
      .then((data) => {
        if (active) setSteps(data.filter((s) => s.published))
      })
      .catch(() => {
        // Fallback to standard 6-stage workflow below
      })

    const unsub = subscribeApiCache<ProcessStep[]>('/public/process-steps', (data) => {
      if (active) setSteps(data.filter((s) => s.published))
    })

    return () => {
      active = false
      unsub()
    }
  }, [])

  const displaySteps =
    steps.length > 0
      ? [...steps].sort((a, b) => a.stepNumber - b.stepNumber)
      : DEFAULT_PROCESS_STEPS

  return (
    <section className="process-section section" aria-labelledby="process-heading">
      <p className="eyebrow">HOW WE DELIVER</p>

      <h2 id="process-heading">
        A structured 6-stage path from
        <br />
        <span>idea to launch &amp; support.</span>
      </h2>

      <div className="process-six-grid">
        {displaySteps.map((step) => (
          <article className="process-stage-card" key={step.stepNumber + step.title}>
            <div className="process-stage-top">
              <span className="process-stage-num">
                {String(step.stepNumber).padStart(2, '0')}
              </span>
              {step.deliverableHint && (
                <span className="process-stage-hint">{step.deliverableHint}</span>
              )}
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
