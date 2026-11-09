
import type { Project } from './types'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api'

export const API_ORIGIN = new URL(API_BASE).origin

export function assetUrl(path?: string) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`)
  }

  return response.json() as Promise<T>
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
  description: string
  icon: string | null
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
  content: string
  avatarUrl: string | null
  displayOrder: number
  published: boolean
  createdAt: string
  updatedAt: string
}

export const getProfile = () =>
  request<SiteProfile>('/public/profile')

export const getProjects = () =>
  request<Project[]>('/public/projects')

export const getProject = (slug: string) =>
  request<Project>(`/public/projects/${encodeURIComponent(slug)}`)

export const getSkills = () =>
  request<Skill[]>('/public/skills')

export const getServices = () =>
  request<ServiceItem[]>('/public/services')

export const getTestimonials = () =>
  request<Testimonial[]>('/public/testimonials')


export interface InquiryRequest {
  name: string
  email: string
  subject: string
  message: string
}

export async function submitInquiry(data: InquiryRequest): Promise<void> {
  const response = await fetch(`${API_BASE}/public/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    let message = 'Unable to submit your message. Please try again.'

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
}

