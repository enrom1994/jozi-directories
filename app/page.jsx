import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { NICHES } from '../lib/niches'
import { getNicheStats } from '../lib/data'

export const metadata = {
  title: 'Jozi Directories | Local Business Listings — Johannesburg',
  description: 'Find trusted local businesses in Johannesburg and Gauteng. Real listings, real ratings, real contact details.',
}

export default function HomePage() {
  const nichesWithStats = NICHES
    .map(n => ({ ...n, stats: getNicheStats(n) }))
    .filter(n => n.stats.total > 0)
  const totalListings = nichesWithStats.reduce((s, n) => s + n.stats.total, 0)

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="hero" style={{ background: 'var(--surface)' }}>
          <div className="container">

            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Johannesburg · Gauteng · South Africa
            </div>

            <h1 className="hero-title">
              Find the best<br />
              local businesses<br />
              <em>in Johannesburg.</em>
            </h1>

            <p className="hero-sub">
              Real listings sourced from Google Maps. Sorted by rating.
              Click-to-call on mobile. No fake entries, no paid placements.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">{totalListings.toLocaleString()}</span>
                <span className="hero-stat-label">Verified Listings</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">{nichesWithStats.length}</span>
                <span className="hero-stat-label">Categories</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-value">100%</span>
                <span className="hero-stat-label">Real Data</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CATEGORIES ────────────────────────────────────────── */}
        <section style={{ padding: '56px 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Category</h2>
              <span className="section-count">{nichesWithStats.length} categories</span>
            </div>

            <div className="cat-grid stagger">
              {nichesWithStats.map(niche => (
                <Link key={niche.slug} href={`/${niche.slug}`} className="cat-card">
                  <div className="cat-card-icon">{niche.icon}</div>
                  <div className="cat-card-name">{niche.label}</div>
                  <p className="cat-card-desc">{niche.description}</p>
                  <div className="cat-card-footer">
                    <span className="cat-card-count">{niche.stats.total} listings</span>
                    <span className="cat-card-arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST ─────────────────────────────────────────────── */}
        <div className="trust-strip">
          {[
            { heading: 'Real Google Maps data', body: 'All listings pulled directly from Google Maps. No manually entered or unverified businesses.' },
            { heading: 'Sorted by rating', body: 'Every page orders listings highest rated first so the best businesses appear at the top.' },
            { heading: 'Updated regularly', body: 'Listings are re-scraped regularly to keep contact details, ratings and review counts current.' },
          ].map(item => (
            <div key={item.heading} className="trust-item">
              <div className="trust-item-line" />
              <p className="trust-item-title">{item.heading}</p>
              <p className="trust-item-body">{item.body}</p>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </>
  )
}
