import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchTournaments, flattenMatches, teamCode } from './api'
import type { ApiMatch } from './api'
import { useAuth } from './authStore'
import { EmptyState } from './components'
import { useUserStore } from './userStore'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.replace(/\D/g, '').length !== 10) {
      setError('Valid 10-digit mobile number daalo')
      return
    }
    signIn()
    navigate('/')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          JBMR<span>SPORTS</span>
        </h1>
        <p className="muted">Live Cricket &amp; More</p>
        <form onSubmit={submit}>
          <label>
            Mobile (+91)
            <input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
              inputMode="numeric"
            />
          </label>
          {error ? <p className="login-error">{error}</p> : null}
          <button type="submit" className="reel-btn primary" style={{ width: '100%' }}>
            Get OTP
          </button>
        </form>
        <p className="login-legal muted">
          By continuing you agree to our{' '}
          <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>. OTP demo mode — no SMS
          sent.
        </p>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">RS</div>
        <div>
          <h2>Rahul Sharma</h2>
          <p className="muted">rahul.sharma@email.com</p>
          <span className="profile-badge">Premium Member</span>
        </div>
      </div>

      <nav className="profile-menu">
        <button type="button" className="profile-menu-item" onClick={() => navigate('/search')}>
          <span>🔖</span> Search Matches
        </button>
        <Link to="/library" className="profile-menu-item">
          <span>🕐</span> Watch History
        </Link>
        <button type="button" className="profile-menu-item" onClick={() => navigate('/schedule')}>
          <span>📅</span> Match Schedule
        </button>
        <div className="profile-menu-item muted">
          <span>💳</span> Subscription &amp; Plans
        </div>
        <div className="profile-menu-item muted">
          <span>⚙️</span> App Settings
        </div>
        <Link to="/privacy" className="profile-menu-item">
          <span>🔒</span> Privacy Policy
        </Link>
        <Link to="/terms" className="profile-menu-item">
          <span>📄</span> Terms of Service
        </Link>
        <a href="mailto:support@jbmrsports.com" className="profile-menu-item">
          <span>?</span> Help &amp; Support
        </a>
        <button
          type="button"
          className="profile-menu-item danger"
          onClick={() => {
            signOut()
            navigate('/login')
          }}
        >
          <span>↪</span> Log Out
        </button>
      </nav>
      <p className="profile-version muted">JBMR Sports OTT · Web</p>
    </div>
  )
}

export function LibraryPage() {
  const { watchHistory } = useUserStore()
  const [matches, setMatches] = useState<ApiMatch[]>([])

  useEffect(() => {
    fetchTournaments(true)
      .then((t) => setMatches(flattenMatches(t)))
      .catch(() => setMatches([]))
  }, [])

  const historyMatches = useMemo(
    () => watchHistory.map((id) => matches.find((m) => m.matchId === id)).filter(Boolean) as ApiMatch[],
    [watchHistory, matches],
  )

  return (
    <div className="library-page">
      <h1>Watch History</h1>
      {!historyMatches.length ? (
        <EmptyState icon="🕐" title="No history" body="Matches dekho — yahan save honge." />
      ) : (
        <div className="library-list">
          {historyMatches.map((m) => (
            <Link key={m.matchId} to={`/match/${m.matchId}`} className="library-row link">
              <div>
                <strong>
                  {teamCode(m.team1)} vs {teamCode(m.team2)}
                </strong>
                <p className="muted">{m.tournamentName}</p>
              </div>
              <span>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState<ApiMatch[]>([])

  useEffect(() => {
    fetchTournaments(true)
      .then((t) => setMatches(flattenMatches(t)))
      .catch(() => setMatches([]))
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return matches.slice(0, 20)
    return matches.filter((m) => {
      const hay = [
        m.team1?.name,
        m.team2?.name,
        m.team1?.shortName,
        m.team2?.shortName,
        m.tournamentName,
        m.venue,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [matches, query])

  return (
    <div className="search-page">
      <h1>Search</h1>
      <input
        className="search-input"
        placeholder="Search matches, teams, tournaments…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div className="search-results">
        {results.map((m) => (
          <Link key={m.matchId} to={`/match/${m.matchId}`} className="search-result">
            <strong>
              {teamCode(m.team1)} vs {teamCode(m.team2)}
            </strong>
            <span className="muted">
              {m.tournamentName} · {m.venue || 'India'}
            </span>
          </Link>
        ))}
        {!results.length ? <p className="muted">No matches found</p> : null}
      </div>
    </div>
  )
}
