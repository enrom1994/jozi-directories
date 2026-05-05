import Link from 'next/link'
import { NICHES } from '../lib/niches'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">

        {/* Brand + tagline */}
        <div className="footer-brand-row">
          <div className="site-logo" style={{ flexShrink: 0 }}>
            <span className="site-logo-badge">JHB</span>
            <span className="site-logo-name">Jozi Directories</span>
          </div>
          <p className="footer-tagline">
            Local business listings for Johannesburg &amp; Gauteng. Sourced from Google Maps. No paid placements.
          </p>
        </div>

        {/* Flat link strip — all niches */}
        <nav className="footer-links-row" aria-label="All categories">
          {NICHES.map(n => (
            <Link key={n.slug} href={`/${n.slug}`} className="footer-link">
              {n.label}
            </Link>
          ))}
        </nav>

      </div>

      {/* Bottom bar */}
      <div className="footer-bar">
        <div className="container footer-bar-inner">
          <span>Built in Johannesburg, South Africa</span>
          <span>© {new Date().getFullYear()} Jozi Directories · Real data. Real businesses.</span>
        </div>
      </div>
    </footer>
  )
}
