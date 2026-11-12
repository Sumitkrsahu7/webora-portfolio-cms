import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Briefcase,
  FileText,
  Layers3,
  Wrench,
  Sparkles,
  Mail,
  User,
  Copy,
  Check,
  Printer,
  X,
  ArrowRight
} from 'lucide-react'
import { getProfile, prefetchRouteData } from '../api'

interface CommandItem {
  id: string
  label: string
  category: 'Navigation' | 'Actions'
  icon: React.ReactNode
  keywords: string
  action: () => void
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [contactEmail, setContactEmail] = useState<string>('')
  const navigate = useNavigate()

  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)

  const isMac =
    typeof navigator !== 'undefined' &&
    /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)

  // Listen for Ctrl+K / Cmd+K and Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      } else if (event.key === 'Escape' && open) {
        event.preventDefault()
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Load company contact email from CMS without hardcoding personal defaults
  useEffect(() => {
    if (!open || contactEmail) return
    getProfile()
      .then((profile) => {
        if (profile?.email?.trim()) {
          setContactEmail(profile.email.trim())
        }
      })
      .catch(() => {})
  }, [open, contactEmail])

  // Manage focus, focus restoration, and body scroll lock cleanly with unmount cleanup
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
      setQuery('')
      setSelectedIndex(0)
      setCopyStatus('idle')

      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 20)

      return () => {
        window.clearTimeout(focusTimer)
        document.body.style.overflow = prevOverflow
      }
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false
      triggerRef.current?.focus()
    }
  }, [open])

  const items: CommandItem[] = [
    {
      id: 'nav-home',
      label: 'Home',
      category: 'Navigation',
      icon: <Sparkles size={16} />,
      keywords: 'home main landing start webora',
      action: () => {
        navigate('/')
        setOpen(false)
      },
    },
    {
      id: 'nav-services',
      label: 'Services & Solutions',
      category: 'Navigation',
      icon: <Wrench size={16} />,
      keywords: 'services website ecommerce web application maintenance ui ux design',
      action: () => {
        prefetchRouteData('/services')
        navigate('/services')
        setOpen(false)
      },
    },
    {
      id: 'nav-projects',
      label: 'Our Work & Client Stories',
      category: 'Navigation',
      icon: <Layers3 size={16} />,
      keywords: 'projects our work portfolio showcase case studies client reviews video',
      action: () => {
        prefetchRouteData('/our-work')
        navigate('/our-work')
        setOpen(false)
      },
    },
    {
      id: 'nav-pricing',
      label: 'Pricing & Support Policy',
      category: 'Navigation',
      icon: <Briefcase size={16} />,
      keywords: 'pricing packages cost inr 4000 5000 support policy hosting',
      action: () => {
        prefetchRouteData('/pricing')
        navigate('/pricing')
        setOpen(false)
      },
    },
    {
      id: 'nav-quote',
      label: 'Request a Quote',
      category: 'Navigation',
      icon: <Sparkles size={16} />,
      keywords: 'quote estimate proposal hire project inquiry budget',
      action: () => {
        prefetchRouteData('/request-quote')
        navigate('/request-quote')
        setOpen(false)
      },
    },
    {
      id: 'nav-about',
      label: 'About Us',
      category: 'Navigation',
      icon: <User size={16} />,
      keywords: 'about webora team company mission vision difference',
      action: () => {
        prefetchRouteData('/about')
        navigate('/about')
        setOpen(false)
      },
    },
    {
      id: 'nav-faq',
      label: 'Frequently Asked Questions (FAQ)',
      category: 'Navigation',
      icon: <FileText size={16} />,
      keywords: 'faq questions answers support hosting domain',
      action: () => {
        prefetchRouteData('/faq')
        navigate('/faq')
        setOpen(false)
      },
    },
    {
      id: 'nav-experience',
      label: 'Career Journey & Experience',
      category: 'Navigation',
      icon: <Briefcase size={16} />,
      keywords: 'experience career history milestones',
      action: () => {
        prefetchRouteData('/experience')
        navigate('/experience')
        setOpen(false)
      },
    },
    {
      id: 'nav-skills',
      label: 'Technical Capabilities',
      category: 'Navigation',
      icon: <Sparkles size={16} />,
      keywords: 'skills tech stack capabilities architecture',
      action: () => {
        prefetchRouteData('/skills')
        navigate('/skills')
        setOpen(false)
      },
    },
    {
      id: 'nav-resume',
      label: 'Company Profile Summary / CV',
      category: 'Navigation',
      icon: <FileText size={16} />,
      keywords: 'resume cv pdf document summary capabilities',
      action: () => {
        prefetchRouteData('/resume')
        navigate('/resume')
        setOpen(false)
      },
    },
    {
      id: 'nav-contact',
      label: 'Contact & WhatsApp',
      category: 'Navigation',
      icon: <Mail size={16} />,
      keywords: 'contact message inquiry quote email whatsapp phone',
      action: () => {
        prefetchRouteData('/contact')
        navigate('/contact')
        setOpen(false)
      },
    },
    ...(contactEmail
      ? [
          {
            id: 'action-copy-email',
            label:
              copyStatus === 'copied'
                ? 'Email Copied to Clipboard!'
                : copyStatus === 'error'
                  ? `Email: ${contactEmail}`
                  : `Copy Contact Email (${contactEmail})`,
            category: 'Actions' as const,
            icon:
              copyStatus === 'copied' ? (
                <Check size={16} className="text-emerald-400" />
              ) : (
                <Copy size={16} />
              ),
            keywords: 'copy email address contact reach out clipboard',
            action: async () => {
              try {
                await navigator.clipboard.writeText(contactEmail)
                setCopyStatus('copied')
                window.setTimeout(() => {
                  setCopyStatus('idle')
                  setOpen(false)
                }, 700)
              } catch {
                setCopyStatus('error')
              }
            },
          },
        ]
      : []),
    {
      id: 'action-print-resume',
      label: 'Print / Save Summary as PDF',
      category: 'Actions',
      icon: <Printer size={16} />,
      keywords: 'print resume pdf download save export',
      action: () => {
        prefetchRouteData('/resume')
        setOpen(false)
        navigate('/resume?print=1')
      },
    },
  ]

  const filtered = items.filter((item) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      item.label.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  })

  // Trap Tab focus inside dialog & handle combobox keyboard navigation
  function handleDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Tab' || !dialogRef.current) return
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'input, button, [href], [tabindex]:not([tabindex="-1"])'
    )
    if (focusables.length === 0) return

    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((prev) =>
        prev === 0 ? (filtered.length ? filtered.length - 1 : 0) : prev - 1
      )
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action()
      }
    }
  }

  useEffect(() => {
    if (listRef.current && filtered[selectedIndex]) {
      const activeEl = listRef.current.querySelector(
        `#cmd-option-${filtered[selectedIndex].id}`
      ) as HTMLElement | null
      activeEl?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex, filtered])

  const activeItemId = filtered[selectedIndex]
    ? `cmd-option-${filtered[selectedIndex].id}`
    : undefined

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="cmd-trigger-btn"
        onClick={() => setOpen(true)}
        title={`Open Quick Navigation (${isMac ? 'Cmd+K' : 'Ctrl+K'})`}
        aria-label="Open Quick Navigation Palette"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Search size={13} />
        <span className="cmd-trigger-label">Quick search...</span>
        <kbd className="cmd-trigger-kbd">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>

      {open && (
        <div
          className="cmd-palette-backdrop"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            ref={dialogRef}
            className="cmd-palette-dialog"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleDialogKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Command Navigation Palette"
          >
            <div className="cmd-input-wrap">
              <Search size={18} className="cmd-search-icon" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmd-palette-listbox"
                aria-activedescendant={activeItemId}
                aria-autocomplete="list"
                aria-label="Search navigation and actions"
                className="cmd-input"
                placeholder="Type a command, page, or action..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleInputKeyDown}
              />
              <button
                type="button"
                className="cmd-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close command palette"
              >
                <X size={16} />
              </button>
            </div>

            <div
              id="cmd-palette-listbox"
              className="cmd-list"
              ref={listRef}
              role="listbox"
              aria-label="Command options"
            >
              {filtered.length === 0 ? (
                <div className="cmd-empty">
                  No matching commands found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                filtered.map((item, index) => (
                  <div
                    key={item.id}
                    id={`cmd-option-${item.id}`}
                    role="option"
                    aria-selected={index === selectedIndex}
                    className={`cmd-item ${index === selectedIndex ? 'cmd-item-active' : ''}`}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="cmd-item-icon" aria-hidden="true">{item.icon}</span>
                    <span className="cmd-item-label">{item.label}</span>
                    <span className="cmd-item-category">{item.category}</span>
                    <ArrowRight size={13} className="cmd-item-arrow" aria-hidden="true" />
                  </div>
                ))
              )}
            </div>

            <div className="cmd-footer">
              <span>
                Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate
              </span>
              <span>
                <kbd>↵</kbd> to select
              </span>
              <span>
                <kbd>esc</kbd> to dismiss
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
