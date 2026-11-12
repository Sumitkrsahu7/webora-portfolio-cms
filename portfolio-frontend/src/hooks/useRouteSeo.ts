import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface RouteSeoMeta {
  title: string
  description: string
}

const ROUTE_SEO: Array<{ match: (path: string) => boolean; meta: RouteSeoMeta }> = [
  {
    match: (p) => p === '/',
    meta: {
      title: 'WEBORA — Software Development & Digital Solutions',
      description:
        'WEBORA designs and builds responsive business websites, e-commerce platforms, custom web applications, and ongoing software maintenance.',
    },
  },
  {
    match: (p) => p === '/about',
    meta: {
      title: 'About Us — WEBORA',
      description:
        'Meet the engineering team behind WEBORA and learn how we deliver maintainable websites, custom software, and dependable client support.',
    },
  },
  {
    match: (p) => p.startsWith('/services'),
    meta: {
      title: 'Services — WEBORA',
      description:
        'Explore WEBORA services including business websites, e-commerce development, custom web applications, UI/UX design, and maintenance.',
    },
  },
  {
    match: (p) => p === '/our-work' || p.startsWith('/projects'),
    meta: {
      title: 'Our Work & Client Results — WEBORA',
      description:
        'Browse real client websites, web application case studies, written reviews, and client video testimonials built by WEBORA.',
    },
  },
  {
    match: (p) => p === '/pricing',
    meta: {
      title: 'Pricing & 6-Month Support Policy — WEBORA',
      description:
        'Transparent INR website pricing from ₹4,000, separate domain and hosting clarity, and 6 months of basic support included with every build.',
    },
  },
  {
    match: (p) => p === '/request-quote',
    meta: {
      title: 'Request a Quote — WEBORA',
      description:
        'Submit your project requirements, package preference, budget range, and timeline to receive a custom proposal from WEBORA.',
    },
  },
  {
    match: (p) => p === '/faq',
    meta: {
      title: 'Frequently Asked Questions — WEBORA',
      description:
        'Answers to common questions on WEBORA website pricing, timelines, CMS ownership, domain/hosting separation, and post-launch support.',
    },
  },
  {
    match: (p) => p === '/contact',
    meta: {
      title: 'Contact Us — WEBORA',
      description:
        'Get in touch with WEBORA via inquiry form, email, or WhatsApp to discuss your website or software project.',
    },
  },
]

const DEFAULT_SEO: RouteSeoMeta = {
  title: 'WEBORA — Software Development & Digital Solutions',
  description:
    'WEBORA — Software development, web applications, e-commerce, UI/UX design, and maintenance solutions.',
}

export function useRouteSeo(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    const matched = ROUTE_SEO.find((entry) => entry.match(pathname))?.meta ?? DEFAULT_SEO
    document.title = matched.title

    let descTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!descTag) {
      descTag = document.createElement('meta')
      descTag.name = 'description'
      document.head.appendChild(descTag)
    }
    descTag.content = matched.description

    if (typeof window !== 'undefined' && window.location?.origin) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = `${window.location.origin}${pathname}`
    }
  }, [pathname])
}
