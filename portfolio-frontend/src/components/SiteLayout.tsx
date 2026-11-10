
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Our work', path: '/projects' },
  { label: 'Skills', path: '/skills' },
]

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)

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
          webora<span>.</span>
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
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            className="mobile-contact"
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Start a project <ArrowUpRight size={15} />
          </Link>
        </nav>

        <Link className="header-cta" to="/contact">
          Start a project <ArrowUpRight size={15} />
        </Link>

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

        <span>Digital experiences, thoughtfully built.</span>

        <div className="footer-links">
          <Link to="/profile">Profile</Link>
          <Link to="/testimonials">Testimonials</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <span>© {new Date().getFullYear()} Webora</span>
      </footer>
    </>
  )
}
