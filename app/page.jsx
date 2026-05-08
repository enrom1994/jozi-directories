import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SearchBar from '../components/SearchBar'
import HeroCardStack from '../components/HeroCardStack'
import LocationBanner from '../components/LocationBanner'
import CategoryPillStrip from '../components/CategoryPillStrip'
import TopRatedSection from '../components/TopRatedSection'
import { NICHES } from '../lib/niches'
import { LOCATIONS } from '../lib/locations'
import { getNicheStats, loadNicheData, slugify } from '../lib/data'

export const metadata = {
  title: 'Jozi Directories | Local Business Listings — Johannesburg',
  description: 'Find trusted local businesses in Johannesburg and Gauteng. Real listings, real ratings, real contact details.',
}

// ── Server-side data helpers ──────────────────────────────────────────────────

// Resolve featured.json → actual business records
function getFeaturedListings() {
  try {
    const raw      = fs.readFileSync(path.join(process.cwd(), 'data', 'featured.json'), 'utf-8')
    const featured = JSON.parse(raw)
    if (!Array.isArray(featured) || featured.length === 0) return []

    return featured.map(f => {
      const niche = NICHES.find(n => n.slug === f.nicheSlug)
      if (!niche) return null
      const data     = loadNicheData(niche.dataFile)
      const business = data.find(b => b.business_name === f.businessName)
      if (!business) return null
      return { ...business, nicheLabel: f.label || niche.label, nicheSlug: niche.slug }
    }).filter(Boolean)
  } catch {
    return []
  }
}

// Top-50 rated listings across all niches (for TopRatedSection + fallback)
function getTopRated() {
  const all = []
  for (const niche of NICHES) {
    try {
      const data = loadNicheData(niche.dataFile)
      for (const b of data) {
        if (parseFloat(b.rating) >= 4.3) {
          all.push({
            business_name: b.business_name,
            suburb:        b.suburb,
            rating:        parseFloat(b.rating),
            review_count:  parseInt(b.review_count) || 0,
            nicheSlug:     niche.slug,
            nicheLabel:    niche.label,
            suburbSlug:    slugify(b.suburb || ''),
          })
        }
      }
    } catch (_) {}
  }
  return all
    .sort((a, b) => b.rating - a.rating || b.review_count - a.review_count)
    .slice(0, 50)
}

// Pull top-rated listings to show in hero card stack
// Falls back to algorithmic top-rated when featured.json is empty
function getHeroCardItems() {
  const featured = getFeaturedListings()
  if (featured.length >= 3) return featured.slice(0, 8)

  // Fallback: algorithm picks top businesses from a curated niche list
  const targets = [
    'barbers', 'dog-groomers', 'electricians', 'solar-inverter-installers',
    'hair-salons', 'driving-schools', 'plumbers', 'panel-beaters',
    'car-detailing', 'phone-repair-shops', 'vets', 'pest-control',
  ]
  const results = []
  for (const slug of targets) {
    if (results.length >= 8) break
    const niche = NICHES.find(n => n.slug === slug)
    if (!niche) continue
    const data = loadNicheData(niche.dataFile)
    const top  = data
      .filter(b => parseFloat(b.rating) >= 4.5 && parseInt(b.review_count) >= 20)
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating) || parseInt(b.review_count) - parseInt(a.review_count))
      .slice(0, 1)
      .map(b => ({ ...b, nicheLabel: niche.label, nicheSlug: niche.slug }))
    results.push(...top)
  }
  return results
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const nichesWithStats = NICHES
    .map(n => ({ ...n, stats: getNicheStats(n) }))
    .filter(n => n.stats.total > 0)

  const totalListings = nichesWithStats.reduce((s, n) => s + n.stats.total, 0)
  const heroItems     = getHeroCardItems()
  const topRated      = getTopRated()
  const fallback      = topRated.slice(0, 4)
  const suburbs       = LOCATIONS.map(l => l.label)

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-split">

            {/* Left: headline + search + stats */}
            <div className="hero-left">
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
                Click-to-call on mobile.
              </p>

              {/* Full search bar in hero */}
              <SearchBar variant="hero" />

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

            {/* Right: fanned business card stack */}
            {heroItems.length > 0 && (
              <div className="hero-right">
                <HeroCardStack items={heroItems} />
              </div>
            )}

          </div>
        </section>

        {/* ── LOCATION BANNER ───────────────────────────────────────────── */}
        <LocationBanner suburbs={suburbs} />

        {/* ── TOP RATED NEAR YOU ────────────────────────────────────────── */}
        {topRated.length > 0 && (
          <TopRatedSection topRated={topRated} fallback={fallback} />
        )}

        {/* ── BROWSE BY CATEGORY ────────────────────────────────────────── */}
        <section className="cat-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Category</h2>
              <span className="section-count">{nichesWithStats.length} categories</span>
            </div>

            <div className="cat-grid stagger">
              {nichesWithStats.map(niche => {
                const NICHES_WITH_IMAGES = ['barbers', 'nail-bars', 'auto-electricians', 'solar-inverter-installers', 'debt-review-consultants', 'dog-groomers', 'phone-repair-shops', 'driving-schools']
                const hasNicheImage = NICHES_WITH_IMAGES.includes(niche.slug)
                return (
                  <Link key={niche.slug} href={`/${niche.slug}`} className="cat-card">
                    {hasNicheImage && (
                      <div className="cat-card-image">
                        <img
                          src={`/niches/${niche.slug}.png`}
                          alt={`${niche.label} in Johannesburg`}
                          className="cat-card-img"
                        />
                      </div>
                    )}
                    <div className="cat-card-name">{niche.label}</div>
                    <p className="cat-card-desc">{niche.description}</p>
                    <div className="cat-card-footer">
                      <span className="cat-card-count">{niche.stats.total} listings</span>
                      <span className="cat-card-arrow">→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
