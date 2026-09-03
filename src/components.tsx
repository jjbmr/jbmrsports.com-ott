import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

/** Website nav — match viewing only */
const WEB_NAV = [
  { to: '/', label: 'Home' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/profile', label: 'Profile' },
] as const

export function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const fullBleed =
    pathname === '/' ||
    pathname === '/schedule' ||
    pathname.startsWith('/match/') ||
    pathname.startsWith('/tournament/')

  return (
    <div className="app-shell">
      <header className="web-header">
        <div className="web-header-inner">
          <div className="web-header-left">
            <Link to="/" className="web-brand" aria-label="JBMR Sports home">
              JBMR<span>SPORTS</span>
            </Link>
            <nav className="web-sport-nav" aria-label="Main">
              {WEB_NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="web-header-right">
            <button
              type="button"
              className="web-search"
              aria-label="Search matches and players"
              onClick={() => navigate('/search')}
            >
              <SearchIcon />
              <span>Search matches, players...</span>
            </button>
            <Link to="/profile" className="web-avatar-btn" aria-label="Profile">
              RS
            </Link>
          </div>
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
      {!fullBleed ? (
        <footer className="site-footer">
          <div className="container site-footer-inner">
            <span>JBMR Sports · Live cricket matches &amp; scorecards</span>
            <nav className="site-footer-links" aria-label="Legal">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <a href="mailto:support@jbmrsports.com">Support</a>
            </nav>
          </div>
        </footer>
      ) : (
        <footer className="web-build-stamp" aria-hidden>
          JBMR Web · Match viewing
        </footer>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
