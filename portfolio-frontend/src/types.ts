
export type ProjectImage = {
  id: string
  imageUrl: string
  altText?: string
  displayOrder: number
}

export type Project = {
  id: string
  title: string
  slug: string
  shortDescription: string
  fullDescription?: string
  category?: string
  thumbnailUrl?: string
  liveUrl?: string
  githubUrl?: string
  startDate?: string
  completionDate?: string
  featured: boolean
  status: string
  technologies: string[]
  images?: ProjectImage[]
  createdAt?: string
  updatedAt?: string
}
