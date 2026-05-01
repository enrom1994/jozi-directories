import Link from 'next/link'
import { NICHES } from '../lib/niches'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', marginTop: 80 }}>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 40,
        }}>

          {/* Brand */}
          <div>
            <div className="site-logo" style={{ marginBottom: 14 }}>
              <span className="site-logo-badge">JHB</span>
              <span className="site-logo-name">Jozi Directories</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.65, maxWidth: 220 }}>
              Local business listings for Johannesburg and Gauteng.
              Data sourced from Google Maps. Updated regularly.
            </p>
          </div>

          {/* Categories */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>
              Categories
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NICHES.map(n => (
                <Link key={n.slug} href={`/${n.slug}`} className="footer-nav-link">
                  {n.icon} {n.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 14 }}>
              About
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Data: Google Maps',
                'Region: Johannesburg, Gauteng',
                'No paid placements',
                'No fake listings',
                `© ${new Date().getFullYear()} Jozi Directories`,
              ].map(line => (
                <span key={line} style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>{line}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Built in Johannesburg, South Africa</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Real data. Real businesses.</span>
        </div>
      </div>
    </footer>
  )
}
