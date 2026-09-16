import { useEffect, useMemo, useState } from 'react'
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
  thumbnailFromMediaUrl,
  type ApiHighlight,
  type FirebaseBall,
} from './api'
import type { ApiMatch, ApiTournament } from './api'
import { Logo } from './components'

export function HomePage() {
  const [tournaments, setTournaments] = useState<ApiTournament[]>([])
  const [highlights, setHighlights] = useState<ApiHighlight[]>([])
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
  const heroMatch = featured[0]
  const completed = useMemo(
    () => matches.filter((m) => statusOf(m) === 'completed').slice(0, 2),
    [matches],
  )
  const bbbMatch = useMemo(() => {
    const withBalls = matches.filter((m) => m.balls && Object.keys(m.balls).length > 0)
    return withBalls.find((m) => statusOf(m) === 'live') || withBalls[0] || featured[0]
  }, [matches, featured])

  if (loading) return <div className="web-loading">Loading live cricket…</div>

  const league = heroMatch?.tournamentName || tournaments[0]?.name || 'JBMR Sports'
  const heroPoster = absoluteUrl(heroMatch?.thumbnailUrl)

  return (
    <div className="web-home">
      {error ? <div className="web-error web-error-inline">{error}</div> : null}
      <section className="web-hero-v2">
        {heroPoster ? (
          <div className="web-hero-v2-bg" aria-hidden>
            <img src={heroPoster} alt="" />
          </div>
        ) : null}
        <div className="web-hero-v2-inner">
          <div className="web-hero-v2-copy">
            <p className="web-pill">{league}</p>
            <h1>
              LIVE CRICKET <span>&amp; MORE</span>
            </h1>
            <p className="web-hero-v2-lead">
              Watch live matches, ball-by-ball clips, and reels from JBMR Sports — same feed as the
              iOS and Android apps.
            </p>
            <div className="web-hero-v2-actions">
              <Link className="web-btn-cta" to={heroMatch ? `/match/${heroMatch.matchId}` : '/schedule'}>
                <img src="/figma-v2/icon-play.svg" alt="" width={20} height={20} />
                {heroMatch ? 'Watch match' : 'Open schedule'}
              </Link>
              <a className="web-btn-ghost" href="#features">
                Explore Features
              </a>
            </div>
          </div>
          {heroMatch ? <HeroHud match={heroMatch} /> : <div className="web-hud web-hud-empty">No matches on the feed yet</div>}
        </div>
      </section>

      <section id="features" className="web-fig-section">
        <SectionHeader
          kicker="JBMR Sports"
          title="What you can watch"
          subtitle="Live scores and video come from your published tournaments — nothing is faked on this page."
        />
        <div className="web-feature-grid">
          <article className="web-feature-card">
            <div className="web-feature-icon orange">
              <img src="/figma-v2/icon-chart.svg" alt="" width={24} height={24} />
            </div>
            <h3>Ball by Ball</h3>
            <p>Each delivery from the live scorecard, with clip video when a ball has been cut.</p>
          </article>
          <article className="web-feature-card featured">
            <div className="web-feature-icon cyan">
              <img src="/figma-v2/icon-scissors.svg" alt="" width={24} height={24} />
            </div>
            <h3>Reels</h3>
            <p>Short highlights published from admin — titles and thumbnails from the real clip URL.</p>
          </article>
          <article className="web-feature-card">
            <div className="web-feature-icon orange">
              <img src="/figma-v2/icon-cloud.svg" alt="" width={24} height={24} />
            </div>
            <h3>App</h3>
            <p>Same cricket on iPhone and Android. Ask support for store links until the apps are live.</p>
          </article>
        </div>
      </section>

      <section id="ball-by-ball" className="web-fig-section">
        <SectionHeader
          kicker="Live feed"
          title="Every ball"
          subtitle="Latest deliveries from a live or scored match. Open the match to watch the clip."
        />
        {bbbMatch ? (
          <BallByBallPanel match={bbbMatch} />
        ) : (
          <p className="web-empty-note">No ball-by-ball data on the feed yet.</p>
        )}
      </section>

      <section id="reels" className="web-fig-section">
        <SectionHeader
          kicker="Shorts"
          title="Reels"
          subtitle="Only clips that are published on JBMR Sports."
        />
        {highlights.length ? (
          <div className="web-reels-grid">
            {highlights.slice(0, 8).map((h) => (
              <ReelCard key={h.id} highlight={h} />
            ))}
          </div>
        ) : (
          <p className="web-empty-note">No reels published yet.</p>
        )}
      </section>

      <section id="schedule-home" className="web-fig-section">
        <SectionHeader
          kicker="Fixtures"
          title="Schedule & results"
          subtitle={
            tournaments[0]
              ? `Matches from ${tournaments[0].name}.`
              : 'Live, upcoming, and completed matches from the app feed.'
          }
        />
        <div className="web-home-schedule">
          <div className="web-home-results">
            <h3>Recent Results</h3>
            {completed.length ? (
              completed.map((match) => <ResultCard key={match.matchId} match={match} />)
            ) : (
              <p className="web-empty-note">No completed matches yet — see Schedule for live and upcoming.</p>
            )}
          </div>
          <aside className="web-home-cal-card">
            <h3>Full schedule</h3>
            <p>Open every live, upcoming, and completed match from the same Firebase feed the apps use.</p>
            <ul>
              <li>
                <img src="/figma-v2/icon-calendar-check.svg" alt="" width={20} height={20} />
                Times shown in your local timezone
              </li>
              <li>
                <img src="/figma-v2/icon-bell.svg" alt="" width={20} height={20} />
                Match alerts in the mobile app
              </li>
            </ul>
            <Link className="web-btn-cyan" to="/schedule">
              <img src="/figma-v2/icon-calendar.svg" alt="" width={20} height={20} />
              Open schedule
            </Link>
          </aside>
        </div>
      </section>

      <section id="download" className="web-fig-section web-download-section">
        <div className="web-download-card">
          <div className="web-download-copy">
            <h2>JBMR Sports on your phone</h2>
            <p>Live cricket, scores, and clips on iOS and Android.</p>
            <div className="web-store-row">
              <a className="web-store-btn" href="mailto:support@jbmrsports.com">
                <img src="/figma-v2/icon-apple.svg" alt="" width={20} height={20} />
                <span>
                  <small>Download on the</small>
                  App Store
                </span>
              </a>
              <a className="web-store-btn" href="mailto:support@jbmrsports.com">
                <img src="/figma-v2/icon-play-store.svg" alt="" width={20} height={20} />
                <span>
                  <small>GET IT ON</small>
                  Google Play
                </span>
              </a>
            </div>
            {tournaments.length ? (
              <div className="web-stats-row">
                <div>
                  <strong>{tournaments.length}</strong>
                  <span>{tournaments.length === 1 ? 'Tournament' : 'Tournaments'}</span>
                </div>
              </div>
            ) : null}
          </div>
          <img className="web-download-icon" src="/app-icon.png" alt="JBMR Sports" width={160} height={160} />
        </div>
      </section>
    </div>
  )
}

function ReelCard({ highlight }: { highlight: ApiHighlight }) {
  const thumb = highlight.thumbnailUrl || thumbnailFromMediaUrl(highlight.url)
  const inner = (
    <>
      <div className={`web-reel-thumb${thumb ? '' : ' empty'}`}>
        {thumb ? <img src={thumb} alt="" /> : null}
        <span className="web-reel-play">
          <img src="/figma-v2/icon-play-reel.svg" alt="" width={20} height={20} />
        </span>
      </div>
      <h3>{highlight.title || 'Highlight'}</h3>
      <p>{highlight.tournamentName || 'JBMR Sports'}</p>
    </>
  )
  return (
    <a className="web-reel-card" href={highlight.url} target="_blank" rel="noreferrer">
      {inner}
    </a>
  )
}

function SectionHeader({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <header className="web-fig-head">
      <p className="web-pill sm">{kicker}</p>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </header>
  )
}

function HeroHud({ match }: { match: ApiMatch }) {
  const st = statusOf(match)
  const label = st === 'live' ? 'LIVE MATCH' : st === 'completed' ? 'RESULT' : 'UPCOMING MATCH'
  const when = match.matchSeq ? `Match ${match.matchSeq}` : ''
  const date = formatWhen(match.scheduledAt)
  const cta =
    st === 'live' ? 'WATCH LIVE' : st === 'upcoming' ? 'SET REMINDER' : 'WATCH MATCH'
  const home = match.team1.shortName || match.team1.name
  const away = match.team2.shortName || match.team2.name

  return (
    <div className="web-hud">
      <div className="web-hud-top">
        <span className="web-hud-live">
          <img src="/figma-v2/icon-dot.svg" alt="" width={8} height={8} />
          {label}
        </span>
        <span className="web-hud-meta">{[when, date].filter(Boolean).join(' • ')}</span>
      </div>
      <div className="web-hud-teams">
        <div className="web-hud-team">
          <div className="web-hud-crest home">
            <HudCrest src={logoOf(match.team1)} fallback={teamCode(match.team1)} />
          </div>
          <p>{home}</p>
        </div>
        <div className="web-hud-vs">VS</div>
        <div className="web-hud-team">
          <div className="web-hud-crest away">
            <HudCrest src={logoOf(match.team2)} fallback={teamCode(match.team2)} />
          </div>
          <p>{away}</p>
        </div>
      </div>
      <div className="web-hud-foot">
        <strong>{match.tournamentName || 'JBMR Sports'}</strong>
        <span>
          {st === 'upcoming'
            ? `Broadcast commences at ${date || 'TBD'}`
            : scoreFor(match, match.team1) || match.result?.summaryText || 'Watch on JBMR Sports'}
        </span>
      </div>
      <Link className="web-btn-cta block" to={`/match/${match.matchId}`}>
        {cta}
      </Link>
    </div>
  )
}

function HudCrest({ src, fallback }: { src?: string; fallback: string }) {
  const [broken, setBroken] = useState(false)
  if (src && !broken) {
    return <img src={src} alt={fallback} width={40} height={40} onError={() => setBroken(true)} />
  }
  return <span className="web-hud-code">{fallback.slice(0, 3).toUpperCase()}</span>
}

function recentBalls(match: ApiMatch): FirebaseBall[] {
  return Object.values(match.balls || {})
    .sort((a, b) => {
      const ao = (a.over ?? 0) * 10 + (a.ball ?? 0)
      const bo = (b.over ?? 0) * 10 + (b.ball ?? 0)
      return bo - ao
    })
    .slice(0, 4)
}

function BallByBallPanel({ match }: { match: ApiMatch }) {
  const balls = recentBalls(match)
  const batting = match.innings?.slice().sort((a, b) => (b.inningsNumber || 0) - (a.inningsNumber || 0))[0]
  const innLabel = batting?.inningsNumber ? `INN ${batting.inningsNumber}` : 'INN'
  const score = batting
    ? `${(batting.teamShortName || batting.teamName || '').toUpperCase()} — ${batting.runs ?? 0}/${batting.wickets ?? 0} (${batting.overs ?? 0} Ov)`
    : `${(match.team2.shortName || match.team2.name).toUpperCase()}`

  return (
    <div className="web-bbb">
      <div className="web-bbb-head">
        <div>
          <span className="web-bbb-inn">{innLabel}</span>
          <strong>{score}</strong>
        </div>
        <p>
          Tournament: <em>{match.tournamentName || 'JBMR Sports'}</em>
        </p>
      </div>
      <div className="web-bbb-rows">
        {balls.length ? (
          balls.map((ball, i) => {
            const run = ball.isWicket ? 'W' : String(ball.runs ?? 0)
            const kind = ball.isWicket ? 'w' : Number(ball.runs) === 4 || Number(ball.runs) === 6 ? 'b' : ''
            const over = `${ball.over ?? 0}.${ball.ball ?? 0}`
            const thumb = thumbnailFromMediaUrl(ball.videoUrl)
            return (
              <Link key={ball.id || `${over}-${i}`} className={`web-bbb-row ${kind}`} to={`/match/${match.matchId}`}>
                <div className="web-bbb-over">
                  <span>{over}</span>
                  <b className={kind}>{run}</b>
                </div>
                {thumb ? <img className="web-bbb-thumb" src={thumb} alt="" width={100} height={60} /> : null}
                <div className="web-bbb-copy">
                  <strong>{ball.note || 'Delivery'}</strong>
                  <span>{ball.videoUrl ? 'Watch clip' : 'Open match'}</span>
                </div>
                <div className="web-bbb-actions" aria-hidden>
                  <span>
                    <img src="/figma-v2/icon-play-circle.svg" alt="" width={16} height={16} />
                  </span>
                </div>
              </Link>
            )
          })
        ) : (
          <Link className="web-bbb-row" to={`/match/${match.matchId}`}>
            <div className="web-bbb-over">
              <span>—</span>
              <b>•</b>
            </div>
            <div className="web-bbb-copy">
              <strong>{match.team1.shortName || match.team1.name} vs {match.team2.shortName || match.team2.name}</strong>
              <span>Open the match to watch every delivery</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

function ResultCard({ match }: { match: ApiMatch }) {
  const s1 = scoreFor(match, match.team1) || '—'
  const s2 = scoreFor(match, match.team2) || '—'
  return (
    <Link to={`/match/${match.matchId}`} className="web-result-card">
      <div className="web-result-top">
        <span>{formatWhen(match.scheduledAt)}</span>
        <span className="web-pill xs">Completed</span>
      </div>
      <div className="web-result-team">
        <Logo className="flag" src={logoOf(match.team1)} fallback={teamCode(match.team1)} />
        <span>{match.team1.shortName || match.team1.name}</span>
        <strong>{s1}</strong>
      </div>
      <div className="web-result-team">
        <Logo className="flag" src={logoOf(match.team2)} fallback={teamCode(match.team2)} />
        <span>{match.team2.shortName || match.team2.name}</span>
        <strong className="accent">{s2}</strong>
      </div>
      <p>{match.result?.summaryText || 'Full match'}</p>
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
