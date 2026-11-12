
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { assetUrl, getProfile, prefetchRouteData, subscribeApiCache, type SiteProfile } from '../api'
import { useRouteSeo } from '../hooks/useRouteSeo'
import CommandPalette from './CommandPalette'

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Our Work', path: '/our-work' },
  { label: 'About Us', path: '/about' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' },
]

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useRouteSeo()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profile, setProfile] = useState<SiteProfile | null>(null)

  useEffect(() => {
    let active = true
    getProfile()
      .then((data) => {
        if (active) setProfile(data)
      })
      .catch(() => {})

    const unsub = subscribeApiCache<SiteProfile>('/public/profile', (data) => {
      if (active) setProfile(data)
    })

    return () => {
      active = false
      unsub()
    }
  }, [])

  // Close the mobile navigation when Escape is pressed.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  // Prevent background scrolling while the mobile menu is open.
  // Restore the previous overflow value when the menu closes.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          {profile?.logoUrl ? (
            <img
              src={assetUrl(profile.logoUrl, 200)}
              alt="WEBORA"
              className="brand-logo"
              style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
            />
          ) : (
            <>webora<span>.</span></>
          )}
        </Link>

        <nav
          id="primary-navigation"
          className={`main-nav ${menuOpen ? 'nav-open' : ''}`}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMenuOpen(false)}
              onPointerEnter={() => prefetchRouteData(item.path)}
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            className="mobile-contact"
            to="/request-quote"
            onClick={() => setMenuOpen(false)}
          >
            Request a Quote <ArrowUpRight size={15} />
          </Link>
        </nav>

        <div className="header-actions">
          <CommandPalette />
          <Link
            className="header-cta"
            to="/request-quote"
            onPointerEnter={() => prefetchRouteData('/request-quote')}
          >
            Request a Quote <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <div
        className={`nav-backdrop ${menuOpen ? 'nav-backdrop-visible' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <main>{children}</main>

      <footer className="footer">
        <Link className="footer-brand" to="/">
          webora<span>.</span>
        </Link>

        <span>{profile?.footerTagline || 'Digital experiences, thoughtfully built.'}</span>

        <div className="footer-links">
          <Link to="/services" onPointerEnter={() => prefetchRouteData('/services')}>Services</Link>
          <Link to="/our-work" onPointerEnter={() => prefetchRouteData('/our-work')}>Our Work</Link>
          <Link to="/about" onPointerEnter={() => prefetchRouteData('/about')}>About Us</Link>
          <Link to="/pricing" onPointerEnter={() => prefetchRouteData('/pricing')}>Pricing</Link>
          <Link to="/request-quote" onPointerEnter={() => prefetchRouteData('/request-quote')}>Request a Quote</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <span>© {new Date().getFullYear()} {profile?.name || 'Webora'}</span>
      </footer>
    </>
  )
}
