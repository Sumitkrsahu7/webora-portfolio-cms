/**
 * Validates URLs before rendering them in anchor hrefs or media tags.
 * Allows http(s) URLs cleanly, and optionally permits root-relative paths.
 */
export function isSafeExternalUrl(url?: string | null, allowRelative = false): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed || /[\r\n\s]/.test(trimmed)) return false

  if (allowRelative && trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return true
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false
    }
    const lower = trimmed.toLowerCase()
    return (
      !lower.includes('example.com') &&
      !lower.includes('example.org') &&
      !lower.includes('github.com/example')
    )
  } catch {
    return false
  }
}

/**
 * Parses YYYY-MM-DD (or ISO timestamps) in UTC so negative client timezones
 * never shift a date back to the previous month.
 */
export function formatMonthYear(dateStr?: string | null): string {
  if (!dateStr) return ''
  const isoDateMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr.trim())
  if (isoDateMatch) {
    const year = Number(isoDateMatch[1])
    const month = Number(isoDateMatch[2]) - 1
    const day = Number(isoDateMatch[3])
    const utcDate = new Date(Date.UTC(year, month, day))
    return utcDate.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }
  const parsed = new Date(dateStr)
  if (Number.isNaN(parsed.getTime())) {
    return dateStr
  }
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export type ParsedVideoEmbed =
  | { kind: 'iframe'; embedUrl: string; posterUrl?: string }
  | { kind: 'video'; streamUrl: string; posterUrl?: string }
  | { kind: 'external'; href: string }

export function parseVideoEmbed(rawUrl?: string | null): ParsedVideoEmbed | null {
  if (!isSafeExternalUrl(rawUrl)) return null
  const trimmed = rawUrl!.trim()
  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase()

    // YouTube
    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0]
      if (/^[a-zA-Z0-9_-]{6,20}$/.test(id)) {
        return {
          kind: 'iframe',
          embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`,
          posterUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        }
      }
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      let id = parsed.searchParams.get('v') || ''
      if (!id && parsed.pathname.startsWith('/shorts/')) {
        id = parsed.pathname.slice('/shorts/'.length).split('/')[0]
      }
      if (!id && parsed.pathname.startsWith('/embed/')) {
        id = parsed.pathname.slice('/embed/'.length).split('/')[0]
      }
      if (/^[a-zA-Z0-9_-]{6,20}$/.test(id)) {
        return {
          kind: 'iframe',
          embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`,
          posterUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        }
      }
    }

    // Vimeo
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const segments = parsed.pathname.split('/').filter(Boolean)
      const id = segments[segments.length - 1]
      if (/^\d{5,15}$/.test(id)) {
        return {
          kind: 'iframe',
          embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
        }
      }
    }

    // Direct video file (.mp4 / .webm / Cloudinary video)
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(parsed.pathname) || parsed.pathname.includes('/video/upload/')) {
      return { kind: 'video', streamUrl: trimmed }
    }

    return { kind: 'external', href: trimmed }
  } catch {
    return null
  }
}

export function buildWhatsAppUrl(rawNumber?: string | null, text?: string): string | null {
  if (!rawNumber) return null
  let digits = rawNumber.replace(/\D/g, '')
  if (!digits) return null
  if (digits.length === 10) {
    digits = `91${digits}`
  }
  if (digits.length < 8 || digits.length > 15) return null
  const base = `https://wa.me/${digits}`
  return text && text.trim()
    ? `${base}?text=${encodeURIComponent(text.trim())}`
    : base
}
