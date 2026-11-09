
import { useState } from 'react'
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

  return (
    <>
      <header className="topbar">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          webora<span>.</span>
        </Link>

        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
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
          className="menu-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

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
