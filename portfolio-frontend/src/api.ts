import type { Project } from './types'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export const API_ORIGIN = new URL(API_BASE).origin

const TRANSFORM_PREFIX_RE = /^(?:[a-z]{1,3}_[^/]+)(?:,[a-z]{1,3}_[^/]+)*$/

/**
 * Rewrites eligible Cloudinary image URLs for responsive delivery (f_auto, q_auto, w_N, c_limit)
 * while preserving already-transformed image URLs, raw documents (PDFs), local uploads, and external URLs.
 */
export function assetUrl(path?: string, width?: number): string {
  if (!path) return ''
  const trimmed = path.trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed)
      if (
        parsed.hostname === 'res.cloudinary.com' &&
        parsed.pathname.includes('/image/upload/')
      ) {
        const marker = '/image/upload/'
        const idx = parsed.pathname.indexOf(marker)
        const afterMarker = parsed.pathname.slice(idx + marker.length)
        const firstSegment = afterMarker.split('/')[0] || ''

        const alreadyTransformed =
          firstSegment.includes('f_auto') ||
          firstSegment.includes('q_auto') ||
          TRANSFORM_PREFIX_RE.test(firstSegment)

        if (!alreadyTransformed) {
          const transform = `f_auto,q_auto${width ? `,w_${width},c_limit` : ',w_1200,c_limit'}`
          const updatedPath =
            parsed.pathname.slice(0, idx + marker.length) +
            transform +
            '/' +
            afterMarker
          parsed.pathname = updatedPath
          return parsed.toString()
        }
      }
    } catch {
      return trimmed
    }
    return trimmed
  }

  return `${API_ORIGIN}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`
}

interface CacheEntry<T> {
  data: T
  freshUntil: number
  expiresAt: number
}

const SESSION_STORAGE_PREFIX = 'webora_api_cache_'
const FRESH_TTL_MS = 60_000   // 60s fresh window matching backend Cache-Control max-age=60
const STALE_TTL_MS = 300_000  // 5m stale-while-revalidate window matching backend swr=300
const FETCH_TIMEOUT_MS = 20_000
const PREFETCH_ERROR_COOLDOWN_MS = 15_000

const cache = new Map<string, CacheEntry<unknown>>()
const inFlightRequests = new Map<string, Promise<unknown>>()
const recentFailures = new Map<string, number>()
const subscribers = new Map<string, Set<(data: unknown) => void>>()

function notifySubscribers<T>(path: string, data: T): void {
  const listeners = subscribers.get(path)
  if (!listeners) return
  for (const listener of listeners) {
    try {
      listener(data)
    } catch {
      // keep notifier resilient
    }
  }
}

export function subscribeApiCache<T>(
  path: string,
  callback: (data: T) => void
): () => void {
  let listeners = subscribers.get(path)
  if (!listeners) {
    listeners = new Set()
    subscribers.set(path, listeners)
  }
  const wrapped = callback as (data: unknown) => void
  listeners.add(wrapped)
  return () => {
    listeners?.delete(wrapped)
    if (listeners && listeners.size === 0) {
      subscribers.delete(path)
    }
  }
}

function getSessionCached<T>(path: string): CacheEntry<T> | null {
  try {
    const raw = sessionStorage.getItem(`${SESSION_STORAGE_PREFIX}${path}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<CacheEntry<T>>
    if (
      parsed &&
      'data' in parsed &&
      typeof parsed.expiresAt === 'number' &&
      parsed.expiresAt > Date.now()
    ) {
      return {
        data: parsed.data as T,
        freshUntil:
          typeof parsed.freshUntil === 'number'
            ? parsed.freshUntil
            : parsed.expiresAt,
        expiresAt: parsed.expiresAt,
      }
    }
    sessionStorage.removeItem(`${SESSION_STORAGE_PREFIX}${path}`)
  } catch {
    // sessionStorage unavailable or restricted
  }
  return null
}

function setSessionCached<T>(path: string, entry: CacheEntry<T>): void {
  try {
    sessionStorage.setItem(`${SESSION_STORAGE_PREFIX}${path}`, JSON.stringify(entry))
  } catch {
    // sessionStorage quota or restricted
  }
}

export function clearApiCache(pathPrefix?: string) {
  if (!pathPrefix) {
    cache.clear()
    recentFailures.clear()
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key?.startsWith(SESSION_STORAGE_PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((k) => sessionStorage.removeItem(k))
    } catch {
      // ignore
    }
    return
  }

  for (const key of cache.keys()) {
    if (key.startsWith(pathPrefix)) {
      cache.delete(key)
    }
  }
  for (const key of recentFailures.keys()) {
    if (key.startsWith(pathPrefix)) {
      recentFailures.delete(key)
    }
  }
  try {
    const prefix = `${SESSION_STORAGE_PREFIX}${pathPrefix}`
    const keysToRemove: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key?.startsWith(prefix)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k))
  } catch {
    // ignore
  }
}

async function fetchAndStore<T>(
  path: string,
  options?: { freshMs?: number; staleMs?: number; skipCache?: boolean; revalidate?: boolean }
): Promise<T> {
  const skipCache = options?.skipCache ?? false
  const freshMs = options?.freshMs ?? FRESH_TTL_MS
  const staleMs = options?.staleMs ?? STALE_TTL_MS

  if (!skipCache) {
    const existing = inFlightRequests.get(path)
    if (existing) {
      return existing as Promise<T>
    }
  }

  const fetchPromise = (async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
      const response = await fetch(`${API_BASE}${path}`, {
        signal: controller.signal,
        cache: options?.revalidate ? 'no-cache' : 'default',
      })

      if (!response.ok) {
        throw new Error(`API request failed (${response.status})`)
      }

      const data = (await response.json()) as T
      recentFailures.delete(path)

      if (!skipCache && staleMs > 0) {
        const fetchedAt = Date.now()
        const entry: CacheEntry<T> = {
          data,
          freshUntil: fetchedAt + freshMs,
          expiresAt: fetchedAt + staleMs,
        }
        cache.set(path, entry)
        setSessionCached(path, entry)
        notifySubscribers(path, data)
      }

      return data
    } catch (err) {
      recentFailures.set(path, Date.now())
      throw err
    } finally {
      clearTimeout(timeoutId)
      if (!skipCache) {
        inFlightRequests.delete(path)
      }
    }
  })()

  if (!skipCache) {
    inFlightRequests.set(path, fetchPromise)
  }

  return fetchPromise
}

async function request<T>(
  path: string,
  options?: { freshMs?: number; staleMs?: number; skipCache?: boolean }
): Promise<T> {
  const skipCache = options?.skipCache ?? false
  const now = Date.now()

  if (!skipCache) {
    let entry = cache.get(path) as CacheEntry<T> | undefined
    if (!entry || entry.expiresAt <= now) {
      const sessionEntry = getSessionCached<T>(path)
      if (sessionEntry) {
        cache.set(path, sessionEntry)
        entry = sessionEntry
      }
    }

    if (entry && entry.expiresAt > now) {
      if (entry.freshUntil <= now) {
        // True Stale-While-Revalidate: return stale data immediately and revalidate in background
        fetchAndStore<T>(path, { ...options, revalidate: true }).catch(() => {
          // Keep usable stale cache intact if background revalidation fails
        })
      }
      return entry.data
    }
  } else {
    cache.delete(path)
    try {
      sessionStorage.removeItem(`${SESSION_STORAGE_PREFIX}${path}`)
    } catch {
      // ignore
    }
  }

  return fetchAndStore<T>(path, options)
}

function safePrefetch(path: string, fn: () => Promise<unknown>) {
  const lastFail = recentFailures.get(path)
  if (lastFail && Date.now() - lastFail < PREFETCH_ERROR_COOLDOWN_MS) {
    return
  }
  fn().catch(() => {})
}

export function prefetchProject(slug: string) {
  if (!slug) return
  safePrefetch(`/public/projects/${encodeURIComponent(slug)}`, () => getProject(slug))
}

export function prefetchService(slug: string) {
  if (!slug) return
  safePrefetch(`/public/services/${encodeURIComponent(slug)}`, () => getService(slug))
}

export function prefetchRouteData(route: string) {
  switch (route) {
    case '/':
      safePrefetch('/public/projects', getProjects)
      safePrefetch('/public/services', getServices)
      safePrefetch('/public/profile', getProfile)
      safePrefetch('/public/process-steps', getProcessSteps)
      break
    case '/projects':
    case '/our-work':
      safePrefetch('/public/projects', getProjects)
      safePrefetch('/public/testimonials', getTestimonials)
      break
    case '/services':
      safePrefetch('/public/services', getServices)
      safePrefetch('/public/process-steps', getProcessSteps)
      break
    case '/skills':
      safePrefetch('/public/skills', getSkills)
      break
    case '/testimonials':
      safePrefetch('/public/testimonials', getTestimonials)
      break
    case '/experience':
    case '/careers':
      safePrefetch('/public/experiences', getExperiences)
      safePrefetch('/public/profile', getProfile)
      break
    case '/profile':
    case '/about':
      safePrefetch('/public/profile', getProfile)
      safePrefetch('/public/team', getTeamMembers)
      break
    case '/pricing':
      safePrefetch('/public/pricing', getPricingPackages)
      safePrefetch('/public/policies', getServicePolicies)
      safePrefetch('/public/faqs', getFaqs)
      break
    case '/faq':
      safePrefetch('/public/faqs', getFaqs)
      break
    case '/contact':
      safePrefetch('/public/profile', getProfile)
      break
    case '/request-quote':
      safePrefetch('/public/profile', getProfile)
      safePrefetch('/public/services', getServices)
      safePrefetch('/public/pricing', getPricingPackages)
      break
    case '/resume':
    case '/cv':
      safePrefetch('/public/profile', getProfile)
      safePrefetch('/public/experiences', getExperiences)
      safePrefetch('/public/skills', getSkills)
      safePrefetch('/public/projects', getProjects)
      break
    default:
      break
  }
}

export interface SiteProfile {
  id: string
  name: string
  headline: string | null
  bio: string | null
  email: string | null
  phone: string | null
  location: string | null
  avatarUrl: string | null
  resumeUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  websiteUrl: string | null
  companyTagline: string | null
  companyStory: string | null
  differentiatorsJson: string | null
  whatsappNumber: string | null
  supportEmail: string | null
  businessHours: string | null
  responseSla: string | null
  footerTagline: string | null
  logoUrl: string | null
  updatedAt: string
}

export interface TeamMember {
  id: string
  name: string
  roleTitle: string
  specialty: string | null
  bio: string | null
  avatarUrl: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Skill {
  id: string
  name: string
  category: string | null
  proficiency: number | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceItem {
  id: string
  title: string
  slug: string | null
  shortDescription: string | null
  description: string
  targetAudience: string | null
  keyFeaturesJson: string | null
  deliverablesJson: string | null
  startingPriceLabel: string | null
  deliveryTimeline: string | null
  ctaLabel: string | null
  overviewDetails: string | null
  icon: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface ProcessStep {
  id: string
  stepNumber: number
  title: string
  description: string
  deliverableHint: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface PricingPackage {
  id: string
  name: string
  slug: string
  categoryLabel: string | null
  priceLabel: string
  billingNote: string | null
  idealFor: string | null
  featuresJson: string | null
  excludedNote: string | null
  supportPeriodLabel: string | null
  highlighted: boolean
  ctaLabel: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface ServicePolicy {
  id: string
  title: string
  policyType: 'SEPARATE_COSTS' | 'SUPPORT_INCLUDED' | 'SUPPORT_EXCLUDED' | 'GENERAL'
  summary: string
  bulletPointsJson: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  company: string | null
  content: string | null
  avatarUrl: string | null
  mediaType?: 'WRITTEN' | 'VIDEO'
  videoUrl?: string | null
  thumbnailUrl?: string | null
  projectTitle?: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Experience {
  id: string
  company: string
  companyUrl: string | null
  roleTitle: string
  location: string | null
  roleType: string
  startDate: string
  endDate: string | null
  currentRole: boolean
  description: string
  technologies: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export const getProfile = (options?: { skipCache?: boolean }) =>
  request<SiteProfile>('/public/profile', options)

export const getExperiences = (options?: { skipCache?: boolean }) =>
  request<Experience[]>('/public/experiences', options)

export const getProjects = (options?: { skipCache?: boolean }) =>
  request<Project[]>('/public/projects', options)

export const getProject = (slug: string, options?: { skipCache?: boolean }) =>
  request<Project>(`/public/projects/${encodeURIComponent(slug)}`, options)

export const getSkills = (options?: { skipCache?: boolean }) =>
  request<Skill[]>('/public/skills', options)

export const getServices = (options?: { skipCache?: boolean }) =>
  request<ServiceItem[]>('/public/services', options)

export const getService = (slug: string, options?: { skipCache?: boolean }) =>
  request<ServiceItem>(`/public/services/${encodeURIComponent(slug)}`, options)

export const getProcessSteps = (options?: { skipCache?: boolean }) =>
  request<ProcessStep[]>('/public/process-steps', options)

export const getPricingPackages = (options?: { skipCache?: boolean }) =>
  request<PricingPackage[]>('/public/pricing', options)

export const getServicePolicies = (options?: { skipCache?: boolean }) =>
  request<ServicePolicy[]>('/public/policies', options)

export const getTestimonials = (options?: { skipCache?: boolean }) =>
  request<Testimonial[]>('/public/testimonials', options)

export const getTeamMembers = (options?: { skipCache?: boolean }) =>
  request<TeamMember[]>('/public/team', options)

export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string
  displayOrder: number
  published: boolean
  createdAt?: string
  updatedAt?: string
}

export const getFaqs = (options?: { skipCache?: boolean }) =>
  request<FaqItem[]>('/public/faqs', options)

export interface InquiryRequest {
  name: string
  email: string
  subject?: string
  message?: string
  inquiryType?: 'GENERAL' | 'QUOTE'
  phone?: string
  companyName?: string
  projectCategory?: string
  selectedPackage?: string
  budgetRange?: string
  targetTimeline?: string
  projectRequirements?: string
  websiteOrReferenceUrl?: string
  preferredContactMethod?: 'EMAIL' | 'WHATSAPP' | 'PHONE' | ''
  hpField?: string
}

export interface PublicInquiryAck {
  id: string
  inquiryType: string
  status: string
  createdAt: string
  message: string
}

export async function submitInquiry(data: InquiryRequest): Promise<PublicInquiryAck> {
  const response = await fetch(`${API_BASE}/public/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    let message = 'Unable to submit your request. Please try again.'

    try {
      const errorData = await response.json()
      message =
        errorData.message ||
        errorData.detail ||
        message
    } catch {
      // Keep the default error message if the response isn't JSON.
    }

    throw new Error(message)
  }

  return (await response.json()) as PublicInquiryAck
}
