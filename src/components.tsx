import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const WEB_NAV: Array<{ to: string; label: string; end?: boolean; nav?: boolean }> = [
  { to: '/', label: 'Home', end: true, nav: true },
  { to: '/schedule', label: 'Live Matches', nav: true },
  { to: '/schedule', label: 'Schedule' },
  { to: '/#ball-by-ball', label: 'Ball by Ball' },
  { to: '/#reels', label: 'Reels' },
  { to: '/#features', label: 'Features' },
]

export function BrandMark() {
  return (
    <>
      <img className="web-brand-icon" src="/app-icon.png" alt="" width={36} height={36} />
      JBMR
      <span>SPORTS</span>
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="web-site-footer">
      <div className="web-site-footer-inner">
        <div className="web-site-footer-brand">
          <Link to="/" className="web-brand" aria-label="JBMR Sports home">
            <BrandMark />
          </Link>
          <p>Live cricket, scores, ball-by-ball clips, and reels from JBMR Sports.</p>
        </div>
        <div className="web-site-footer-cols">
          <div>
            <h3>Quick Links</h3>
            <Link to="/">Home</Link>
            <Link to="/schedule">Live Matches</Link>
            <Link to="/schedule">Schedule</Link>
            <a href="/#ball-by-ball">Ball by Ball</a>
            <a href="/#reels">Reels</a>
          </div>
          <div>
            <h3>Features</h3>
            <a href="/#features">Ball by Ball</a>
            <a href="/#reels">Reels</a>
            <a href="/#download">Mobile app</a>
            <a href="/#schedule-home">Schedule</a>
          </div>
          <div>
            <h3>Support</h3>
            <a href="mailto:support@jbmrsports.com">Help Center</a>
            <a href="mailto:support@jbmrsports.com">FAQs</a>
            <a href="mailto:support@jbmrsports.com">Contact Us</a>
            <a href="/#download">App Installation Guide</a>
          </div>
        </div>
      </div>
      <div className="web-site-footer-bottom">
        <p>© 2026 JBMR Sports Network. All Rights Reserved.</p>
        <nav className="web-site-footer-legal" aria-label="Legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  )
}

export function Layout() {
  const { pathname, hash } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const fullBleed =
    pathname === '/' ||
    pathname === '/privacy' ||
    pathname === '/terms' ||
    pathname === '/schedule' ||
    pathname.startsWith('/match/') ||
    pathname.startsWith('/tournament/')

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    if (!hash) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  useEffect(() => {
    if (!hash) return
    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    let timer = 0
    const tick = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      if (tries++ < 40) timer = window.setTimeout(tick, 100)
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return (
    <div className="app-shell">
      <header className="web-header">
        <div className="web-header-inner">
          <Link to="/" className="web-brand" aria-label="JBMR Sports home">
            <BrandMark />
          </Link>
          <button
            type="button"
            className={`web-menu-toggle${menuOpen ? ' open' : ''}`}
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav id="site-nav" className={`web-sport-nav${menuOpen ? ' open' : ''}`} aria-label="Main">
            {WEB_NAV.map((item) => {
              if (item.to.startsWith('/#')) {
                return (
                  <a key={item.label} href={item.to}>
                    {item.label}
                  </a>
                )
              }
              if (!item.nav) {
                return (
                  <Link key={item.label} to={item.to}>
                    {item.label}
                  </Link>
                )
              }
              return (
                <NavLink key={item.label} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
          <a className="web-download-btn" href="/#download">
            <img src="/figma-v2/icon-download.svg" alt="" width={16} height={16} />
            Download App
          </a>
        </div>
      </header>
      <main className={`page ${fullBleed ? 'page-full' : ''}`}>
        {fullBleed ? (
          <Outlet />
        ) : (
          <div className="container">
            <Outlet />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

export function Logo({
  src,
  fallback,
  className = '',
}: {
  src?: string
  fallback: string
  className?: string
}) {
  const text = fallback.slice(0, 3).toUpperCase()
  if (!src) return <div className={`logo fallback ${className}`}>{text}</div>
  return (
    <>
      <img
        className={`logo ${className}`}
        src={src}
        alt={fallback}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          const next = e.currentTarget.nextElementSibling as HTMLElement | null
          if (next) next.style.display = 'grid'
        }}
      />
      <div className={`logo fallback ${className}`} style={{ display: 'none' }}>
        {text}
      </div>
    </>
  )
}

export function EmptyState({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  )
}
