import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  absoluteUrl,
  featuredCarousel,
  fetchHighlights,
  fetchTournaments,
  flattenMatches,
  formatWhen,
  logoOf,
  scoreFor,
  statusOf,
  teamCode,
  type ApiHighlight,
} from './api'
import type { ApiMatch, ApiTournament } from './api'
import { Logo } from './components'

const CHIP_BORDERS = ['#ff8000', '#33b24d', '#3380e5', '#33cc66', '#e5334d', '#804dcc']

export function HomePage() {
  const [tournaments, setTournaments] = useState<ApiTournament[]>([])
  const [highlights, setHighlights] = useState<ApiHighlight[]>([])
  const [heroIndex, setHeroIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [data, clips] = await Promise.all([
          fetchTournaments(true).catch(() => [] as ApiTournament[]),
          fetchHighlights().catch(() => [] as ApiHighlight[]),
        ])
        if (alive) {
          setTournaments(data)
          setHighlights(clips)
          if (!data.length) setError('No tournaments on Firebase — Admin se tournament ON karo')
        }
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const matches = useMemo(() => flattenMatches(tournaments), [tournaments])
  const featured = useMemo(() => featuredCarousel(matches), [matches])
  const railMatches = useMemo(() => {
    const live = matches.filter((m) => statusOf(m) === 'live')
    const upcoming = matches.filter((m) => statusOf(m) === 'upcoming')
    return [...live, ...upcoming].slice(0, 8)
  }, [matches])
  const tournamentById = useMemo(
    () => new Map(tournaments.map((t) => [t.tournamentId, t])),
    [tournaments],
  )

  useEffect(() => {
    if (featured.length <= 1) return
    const t = window.setInterval(() => setHeroIndex((i) => (i + 1) % featured.length), 6000)
    return () => window.clearInterval(t)
  }, [featured.length])

  if (loading) return <div className="web-loading">Loading live cricket…</div>
  if (error) return <div className="web-error">{error}</div>

  return (
    <div className="web-home">
      <section className="web-hero-carousel" aria-label="Featured match">
        {featured.length ? (
          <>
            <div className="web-hero-viewport">
              <div
                className="web-hero-track"
                style={{ transform: `translateX(-${heroIndex * 100}%)` }}
              >
                {featured.map((match) => (
                  <div key={match.matchId} className="web-hero-pane">
                    <FigmaHeroCard
                      match={match}
                      tournament={match.tournamentId ? tournamentById.get(match.tournamentId) : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
            {featured.length > 1 ? (
              <div className="figma-hero-dots" aria-label="Featured matches">
                {featured.map((m, i) => (
                  <button
                    key={m.matchId}
                    type="button"
                    className={i === heroIndex ? 'on' : ''}
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setHeroIndex(i)}
                  />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <div className="figma-hero-empty">No featured matches</div>
        )}
      </section>

      {railMatches.length ? (
        <section className="web-section">
          <div className="web-section-head">
            <h2>Live &amp; Upcoming</h2>
            <Link to="/schedule">View All</Link>
          </div>
          <div className="web-match-rail">
            {railMatches.map((match) => (
              <WebMatchCard key={match.matchId} match={match} />
            ))}
          </div>
        </section>
      ) : null}

      {tournaments.length ? (
        <section className="web-section web-section-tight">
          <div className="web-section-head sm">
            <h2>Popular Tournaments</h2>
            <Link to="/tournaments">View All</Link>
          </div>
          <div className="web-chips">
            {tournaments.map((t, i) => (
              <Link
                key={t.tournamentId}
                to={`/tournament/${t.tournamentId}`}
                className="web-chip"
                style={{ borderColor: CHIP_BORDERS[i % CHIP_BORDERS.length] }}
              >
                {chipLabel(t.name)}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {highlights.length ? (
        <section className="web-section">
          <div className="web-section-head">
            <h2 className="lg">Top Highlights</h2>
            <Link to="/schedule">View All</Link>
          </div>
          <div className="web-highlight-grid">
            {highlights.slice(0, 4).map((h) => (
              <a key={h.id} className="web-highlight-card" href={h.url} target="_blank" rel="noreferrer">
                <div className="web-highlight-thumb">
                  <span className="dur">{h.type?.replace(/_/g, ' ') || 'clip'}</span>
                  <span className="play">
                    <img src="/figma/play-sm.svg" alt="" width={14} height={14} />
                  </span>
                </div>
                <div className="web-highlight-body">
                  <h4>{h.title || 'Highlight'}</h4>
                  <p>{h.tournamentName || 'JBMR Sports'}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function chipLabel(title: string) {
  const parts = title.split(/\s+/)
  if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
    return parts
      .slice(0, -1)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || title.slice(0, 6)
  }
  return title.slice(0, 8)
}

function shortLeagueName(name: string) {
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length <= 3) return name
  return words.slice(0, 3).join(' ')
}

function tournamentYear(tournament?: ApiTournament, scheduledAt?: string) {
  const raw = tournament?.startDate || scheduledAt
  if (!raw) return '2026'
  const year = new Date(raw).getFullYear()
  return Number.isNaN(year) ? '2026' : String(year)
}

function heroTeamColor(code: string, side: 'home' | 'away') {
  const key = code.toUpperCase()
  if (key.includes('MSD')) return '#004b8d'
  if (key.includes('KP')) return '#b55418'
  if (key.includes('KK')) return '#801222'
  if (key.includes('RA')) return '#146e48'
  return side === 'home' ? '#0d2b6e' : '#3b1a00'
}

function heroTeamTheme(team: ApiMatch['team1'], side: 'home' | 'away') {
  const themed = (team as { themeColor?: string }).themeColor
  if (themed && /^#?[0-9a-f]{3,8}$/i.test(themed)) {
    return themed.startsWith('#') ? themed : `#${themed}`
  }
  return heroTeamColor(teamCode(team), side)
}

function liveScoreLabel(match: ApiMatch) {
  const s1 = scoreFor(match, match.team1)
  const s2 = scoreFor(match, match.team2)
  if (!s1 && !s2) return ''
  return [s1, s2].filter(Boolean).join(' · ')
}

function heroDetailLabel(match: ApiMatch, st: ReturnType<typeof statusOf>) {
  const parts: string[] = []
  if (match.matchSeq) parts.push(`Match ${match.matchSeq}`)
  const stage = match.stage?.trim()
  if (stage && !['t20', 'odi'].includes(stage.toLowerCase())) {
    parts.push(stage)
  } else if (st === 'live') {
    const score = liveScoreLabel(match)
    if (score) parts.push(score)
  } else if (st === 'upcoming') {
    const when = formatWhen(match.scheduledAt)
    if (when) parts.push(when)
  }
  return parts.join(' • ')
}

function heroTrailingLabel(match: ApiMatch, st: ReturnType<typeof statusOf>) {
  if (st === 'live') return liveScoreLabel(match) || 'Live Now'
  if (st === 'upcoming') return formatWhen(match.scheduledAt)
  return match.result?.summaryText?.trim() || 'Full Match'
}

function FigmaHeroCard({ match, tournament }: { match: ApiMatch; tournament?: ApiTournament }) {
  const st = statusOf(match)
  const thumb = absoluteUrl(match.thumbnailUrl) || absoluteUrl(match.highlightUrl)
  const [showThumb, setShowThumb] = useState(Boolean(thumb))
  const league = shortLeagueName(match.tournamentName || 'JBMR Sports')
  const year = tournamentYear(tournament, match.scheduledAt)
  const detail = heroDetailLabel(match, st)
  const trailing = heroTrailingLabel(match, st)
  const homeName = (match.team1.shortName || match.team1.name || teamCode(match.team1)).toUpperCase()
  const awayName = (match.team2.shortName || match.team2.name || teamCode(match.team2)).toUpperCase()
  const homeColor = heroTeamTheme(match.team1, 'home')
  const awayColor = heroTeamTheme(match.team2, 'away')

  useEffect(() => {
    setShowThumb(Boolean(thumb))
  }, [thumb])

  return (
    <Link
      to={`/match/${match.matchId}`}
      className="figma-hero-card"
      style={{ '--hero-c1': homeColor, '--hero-c2': awayColor } as CSSProperties}
    >
      <div className="figma-hero-media" aria-hidden>
        <div className="figma-hero-team-gradient" />
        {thumb && showThumb ? (
          <img
            className="figma-hero-cover"
            src={thumb}
            alt=""
            onError={() => setShowThumb(false)}
          />
        ) : null}
        <div className="figma-hero-logos">
          <HeroTeamLogo src={logoOf(match.team1)} code={teamCode(match.team1)} />
          <span className="figma-hero-logo-vs">VS</span>
          <HeroTeamLogo src={logoOf(match.team2)} code={teamCode(match.team2)} />
        </div>
        <div className="figma-hero-gradient" />
      </div>

      <div className="figma-hero-badge">
        <span className="figma-hero-status">
          {st === 'live' ? <span className="figma-hero-pulse" /> : null}
          <strong>{st === 'live' ? 'LIVE' : st === 'completed' ? 'RESULT' : 'UPCOMING'}</strong>
        </span>
        {trailing ? <span className="figma-hero-badge-trail">{trailing}</span> : null}
      </div>

      <div className="figma-hero-layout">
        <div className="figma-hero-copy">
          <h3 className="figma-hero-title">{homeName}</h3>
          <span className="figma-hero-vs">VS</span>
          <h3 className="figma-hero-title">{awayName}</h3>
          <p className="figma-hero-meta">
            <span>{league} {year}</span>
            {detail ? (
              <>
                <span className="sep">•</span>
                <span className="accent">{detail}</span>
              </>
            ) : null}
          </p>
          <p className="figma-hero-sport">Cricket</p>
        </div>
      </div>
    </Link>
  )
}

function HeroTeamLogo({ src, code }: { src?: string; code: string }) {
  const [broken, setBroken] = useState(false)
  const label = code.slice(0, 3).toUpperCase()

  if (!src || broken) {
    return <div className="figma-hero-logo fallback">{label}</div>
  }

  return (
    <img
      className="figma-hero-logo"
      src={src}
      alt={code}
      onError={() => setBroken(true)}
    />
  )
}

function WebMatchCard({ match }: { match: ApiMatch }) {
  const st = statusOf(match)
  const s1 = scoreFor(match, match.team1) || '-'
  const s2 = scoreFor(match, match.team2) || '-'
  const footer =
    st === 'live'
      ? [match.result?.summaryText, match.venue].filter(Boolean).join(' • ') ||
        `${teamCode(match.team1)} vs ${teamCode(match.team2)}`
      : `${formatWhen(match.scheduledAt)}${match.venue ? ` • ${match.venue}` : ''}`

  return (
    <Link to={`/match/${match.matchId}`} className="web-match-card">
      <span className={`web-match-badge ${st}`}>
        {st === 'live' ? 'LIVE' : st === 'completed' ? 'RESULT' : 'UPCOMING'}
      </span>
      <div className="web-match-team">
        <Logo className="flag" src={logoOf(match.team1)} fallback={teamCode(match.team1)} />
        <span className="name">{match.team1.shortName || teamCode(match.team1)}</span>
        <span className="score">{s1}</span>
      </div>
      <div className="web-match-team">
        <Logo className="flag" src={logoOf(match.team2)} fallback={teamCode(match.team2)} />
        <span className="name">{match.team2.shortName || teamCode(match.team2)}</span>
        <span className="score">{s2}</span>
      </div>
      <p className="web-match-foot" title={footer}>{footer}</p>
    </Link>
  )
}

export function MatchCard({ match }: { match: ApiMatch }) {
  const st = statusOf(match)
  return (
    <Link to={`/match/${match.matchId}`} className="card match-card">
      <div className="top">
        <span>
          {match.stage || (match.matchSeq ? `Match ${match.matchSeq}` : 'Match')}
          {match.venue ? `  •  ${match.venue}` : ''}
        </span>
        {st === 'live' ? <span className="badge live">● LIVE</span> : null}
      </div>
      <div className="team-row">
        <div className="team-left">
          <Logo className="sm" src={logoOf(match.team1)} fallback={teamCode(match.team1)} />
          <span>{match.team1.name}</span>
        </div>
        {scoreFor(match, match.team1) ? <span className="score">{scoreFor(match, match.team1)}</span> : null}
      </div>
      <div className="team-row">
        <div className="team-left">
          <Logo className="sm" src={logoOf(match.team2)} fallback={teamCode(match.team2)} />
          <span>{match.team2.name}</span>
        </div>
        {scoreFor(match, match.team2) ? <span className="score">{scoreFor(match, match.team2)}</span> : null}
      </div>
      <div className="footer-row">
        <span className={st === 'live' ? 'live-line' : st === 'completed' ? 'result' : ''}>
          {st === 'completed' ? match.result?.summaryText || 'Completed' : st === 'live' ? 'Live' : 'Upcoming'}
        </span>
        <span>{formatWhen(match.scheduledAt)}</span>
      </div>
    </Link>
  )
}
