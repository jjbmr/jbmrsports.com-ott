import { Link } from 'react-router-dom'

const UPDATED = '3 September 2026'
const CONTACT = 'support@jbmrsports.com'

function LegalShell({
  title,
  toc,
  children,
}: {
  title: string
  toc: { href: string; label: string }[]
  children: React.ReactNode
}) {
  return (
    <div className="legal-page">
      <div className="legal-hero">
        <p className="legal-kicker">JBMR Sports OTT</p>
        <h1>{title}</h1>
        <p className="legal-updated muted">Last updated: {UPDATED}</p>
      </div>
      <div className="legal-layout">
        <nav className="legal-toc" aria-label="On this page">
          {toc.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="legal-card">
          <div className="legal-body">{children}</div>
          <footer className="legal-footer">
            <Link to="/privacy">Privacy Policy</Link>
            <span aria-hidden>·</span>
            <Link to="/terms">Terms of Service</Link>
            <span aria-hidden>·</span>
            <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
          </footer>
        </div>
      </div>
    </div>
  )
}

export function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      toc={[
        { href: '#p1', label: '1. Introduction' },
        { href: '#p2', label: '2. Information we collect' },
        { href: '#p3', label: '3. How we use information' },
        { href: '#p4', label: '4. Third-party services' },
        { href: '#p5', label: '5. Data storage & retention' },
        { href: '#p6', label: '6. Your rights & choices' },
        { href: '#p7', label: '7. Children' },
        { href: '#p8', label: '8. Security' },
        { href: '#p9', label: '9. Changes' },
        { href: '#p10', label: '10. Contact' },
      ]}
    >
      <section id="p1">
        <h2>1. Introduction</h2>
        <p>
          JBMR Sports (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the JBMR Sports mobile apps (iOS and
          Android), admin tools, and website at <strong>jbmrsports.com</strong>. This Privacy Policy explains
          what information we collect, how we use it, and your choices.
        </p>
      </section>

      <section id="p2">
        <h2>2. Information we collect</h2>
        <ul>
          <li>
            <strong>Account information:</strong> mobile phone number when you sign in (OTP verification). Demo
            builds may accept a fixed test OTP without sending SMS.
          </li>
          <li>
            <strong>Usage data:</strong> matches you view, watch history, watchlist, and in-app preferences
            (auto-play, live alerts, Wi‑Fi only) stored on your device.
          </li>
          <li>
            <strong>Downloads:</strong> ball clips and exported reels saved locally on your device.
          </li>
          <li>
            <strong>Device &amp; technical data:</strong> app version, device type, and network information needed
            to stream video and load live scores.
          </li>
          <li>
            <strong>Content you interact with:</strong> live streams, highlights, shorts, and match scorecards
            served from our Firebase and cricket data partners.
          </li>
        </ul>
      </section>

      <section id="p3">
        <h2>3. How we use information</h2>
        <ul>
          <li>Provide login, live cricket streaming, scorecards, and personalized watch features.</li>
          <li>Maintain watch history and watchlist on your device.</li>
          <li>Improve app performance, fix errors, and deliver updates.</li>
          <li>Respond to support requests sent to {CONTACT}.</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </section>

      <section id="p4">
        <h2>4. Third-party services</h2>
        <p>We use trusted providers to run the service, including:</p>
        <ul>
          <li>
            <strong>Google Firebase</strong> — match schedules, highlights, and app content (Realtime Database,
            hosting).
          </li>
          <li>
            <strong>Cloudflare</strong> — live video streaming and media delivery (Stream, R2).
          </li>
          <li>
            <strong>CrickDB / cricket APIs</strong> — live scores, ball-by-ball, and match statistics.
          </li>
          <li>
            <strong>Google Play / Apple App Store</strong> — app distribution and (future) subscription billing.
          </li>
        </ul>
        <p>
          These services may process technical data (IP address, device identifiers) according to their own privacy
          policies.
        </p>
      </section>

      <section id="p5">
        <h2>5. Data storage &amp; retention</h2>
        <ul>
          <li>Phone number and sign-in state are stored on your device and in app preferences.</li>
          <li>Watch history and watchlist are stored locally (up to 50 recent matches).</li>
          <li>Downloaded clips and reels remain on your device until you delete them.</li>
          <li>We retain support emails as long as needed to resolve your request.</li>
        </ul>
      </section>

      <section id="p6">
        <h2>6. Your rights &amp; choices</h2>
        <ul>
          <li>
            <strong>Sign out</strong> — clears your session on the device (Profile → Log Out).
          </li>
          <li>
            <strong>Clear local data</strong> — uninstall the app or clear app storage in device settings.
          </li>
          <li>
            <strong>Contact us</strong> — email {CONTACT} to request access, correction, or deletion of account
            data we hold.
          </li>
        </ul>
      </section>

      <section id="p7">
        <h2>7. Children</h2>
        <p>
          JBMR Sports is not directed at children under 13. We do not knowingly collect personal information from
          children. Contact us if you believe a child has provided data.
        </p>
      </section>

      <section id="p8">
        <h2>8. Security</h2>
        <p>
          We use industry-standard measures including HTTPS for network traffic and secure cloud infrastructure.
          No method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section id="p9">
        <h2>9. Changes</h2>
        <p>
          We may update this policy. The &quot;Last updated&quot; date at the top will change. Continued use of JBMR
          Sports after changes means you accept the updated policy.
        </p>
      </section>

      <section id="p10">
        <h2>10. Contact</h2>
        <p>
          Questions about privacy? Email <a href={`mailto:${CONTACT}`}>{CONTACT}</a> or visit{' '}
          <a href="https://jbmrsports.com">jbmrsports.com</a>.
        </p>
      </section>
    </LegalShell>
  )
}

export function TermsPage() {
  return (
    <LegalShell
      title="Terms of Service"
      toc={[
        { href: '#t1', label: '1. Agreement' },
        { href: '#t2', label: '2. Service description' },
        { href: '#t3', label: '3. Account & eligibility' },
        { href: '#t4', label: '4. Acceptable use' },
        { href: '#t5', label: '5. Content & intellectual property' },
        { href: '#t6', label: '6. Subscriptions & payments' },
        { href: '#t7', label: '7. Disclaimers' },
        { href: '#t8', label: '8. Limitation of liability' },
        { href: '#t9', label: '9. Termination' },
        { href: '#t10', label: '10. Governing law' },
        { href: '#t11', label: '11. Contact' },
      ]}
    >
      <section id="t1">
        <h2>1. Agreement</h2>
        <p>
          By using JBMR Sports apps, website, or services, you agree to these Terms. If you do not agree, do not
          use the service.
        </p>
      </section>

      <section id="t2">
        <h2>2. Service description</h2>
        <p>
          JBMR Sports provides live and on-demand cricket content including match streams, scorecards, highlights,
          shorts, and user features such as watchlists and reel creation. Availability depends on tournaments
          enabled by our admin team and third-party data feeds.
        </p>
      </section>

      <section id="t3">
        <h2>3. Account &amp; eligibility</h2>
        <ul>
          <li>You must provide a valid mobile number for OTP sign-in where required.</li>
          <li>You are responsible for activity on your account and keeping your device secure.</li>
          <li>Demo OTP modes are for testing only and may be disabled in production.</li>
        </ul>
      </section>

      <section id="t4">
        <h2>4. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Copy, redistribute, or rebroadcast streams without permission.</li>
          <li>Reverse engineer, scrape, or overload our servers or APIs.</li>
          <li>Use the service for unlawful purposes or to harass others.</li>
          <li>Circumvent geographic, DRM, or access restrictions.</li>
        </ul>
      </section>

      <section id="t5">
        <h2>5. Content &amp; intellectual property</h2>
        <p>
          All logos, videos, graphics, and software are owned by JBMR Sports or our licensors. Match footage and
          statistics may be subject to tournament and broadcaster rights. Personal, non-commercial viewing is
          permitted; commercial use is prohibited without written consent.
        </p>
      </section>

      <section id="t6">
        <h2>6. Subscriptions &amp; payments</h2>
        <p>
          Premium plans (when available) will be billed through Google Play or the Apple App Store. Refunds follow
          the store&apos;s policies. Prices and features may change with notice in the app.
        </p>
      </section>

      <section id="t7">
        <h2>7. Disclaimers</h2>
        <p>
          The service is provided &quot;as is&quot;. Live scores and streams may be delayed or interrupted. We do not
          guarantee uninterrupted access or accuracy of all statistics.
        </p>
      </section>

      <section id="t8">
        <h2>8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, JBMR Sports is not liable for indirect, incidental, or consequential
          damages arising from use of the service.
        </p>
      </section>

      <section id="t9">
        <h2>9. Termination</h2>
        <p>
          We may suspend or terminate access for violations of these Terms. You may stop using the service at any
          time by signing out and uninstalling the app.
        </p>
      </section>

      <section id="t10">
        <h2>10. Governing law</h2>
        <p>
          These Terms are governed by the laws of India. Disputes shall be subject to the courts of New Delhi,
          India, unless otherwise required by applicable law.
        </p>
      </section>

      <section id="t11">
        <h2>11. Contact</h2>
        <p>
          For questions about these Terms, contact <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. See also our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </section>
    </LegalShell>
  )
}
