import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ListingCard from '../../../components/ListingCard'
import SuburbSidebarLinks from '../../../components/SuburbSidebarLinks'
import { NICHES, getNicheBySlug } from '../../../lib/niches'
import { getListings, getSuburbsForNiche, slugify, deslugify } from '../../../lib/data'

export async function generateStaticParams() {
  const params = []
  for (const niche of NICHES) {
    const suburbs = getSuburbsForNiche(niche)
    for (const suburb of suburbs) {
      params.push({ niche: niche.slug, suburb: slugify(suburb) })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const niche = getNicheBySlug(params.niche)
  if (!niche) return {}
  const suburbLabel = deslugify(params.suburb)
  return {
    title: `Best ${niche.label} in ${suburbLabel}, Johannesburg (2025) | Jozi Directories`,
    description: `Find the best ${niche.label.toLowerCase()} in ${suburbLabel}, Johannesburg. Verified listings from Google Maps, sorted by rating.`,
    keywords: niche.searchKeywords.map(k => `${k} ${suburbLabel}`),
  }
}

export default function SuburbPage({ params }) {
  const niche = getNicheBySlug(params.niche)
  if (!niche) notFound()

  const suburbLabel    = deslugify(params.suburb)
  const listings       = getListings(niche, params.suburb)
  if (listings.length === 0) notFound()

  const withWebsite    = listings.filter(b => b.has_website === 'TRUE' || b.has_website === true).length
  const withoutWebsite = listings.length - withWebsite
  const avgRating      = listings.length
    ? (listings.reduce((s, b) => s + (parseFloat(b.rating) || 0), 0) / listings.length).toFixed(1)
    : 0
  const topRated       = listings.filter(b => parseFloat(b.rating) >= 4.7).length
  const allSuburbs     = getSuburbsForNiche(niche)
  const otherSuburbs   = allSuburbs.filter(s => slugify(s) !== params.suburb).slice(0, 8)

  return (
    <>
      <Header
        breadcrumbs={[
          { label: niche.label, href: `/${niche.slug}` },
          { label: suburbLabel },
        ]}
      />
      <main>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section style={{ background: 'var(--surface)', padding: '48px 0 40px', borderBottom: '1px solid var(--border)' }}>
          <div className="container">

            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              {niche.icon} {niche.label}
            </div>

            <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', marginBottom: 8 }}>
              {suburbLabel}
            </h1>

            <p style={{ fontSize: 14, color: 'var(--ink-3)', marginBottom: 20 }}>
              {listings.length} verified {niche.label.toLowerCase()} · Sorted by rating · Johannesburg, Gauteng
            </p>

            {/* Tag badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span className="badge badge-neutral">{listings.length} listings</span>
              {avgRating > 0 && <span className="badge badge-gold">{avgRating} avg rating</span>}
              {topRated > 0 && <span className="badge badge-gold">{topRated} rated 4.7+</span>}
              {withWebsite > 0 && <span className="badge badge-green">{withWebsite} have website</span>}
            </div>
          </div>
        </section>

        {/* ── CONTENT ───────────────────────────────────────────── */}
        <section style={{ padding: '40px 0 80px' }}>
          <div className="container">
            <div className="content-grid">

              {/* Listings */}
              <div>
                <div className="section-header">
                  <h2 className="section-title">All Listings</h2>
                  <span className="section-count">Sorted by rating</span>
                </div>

                <div className="stagger">
                  {listings.map((business, i) => (
                    <ListingCard
                      key={business._place_id || i}
                      business={business}
                      rank={i + 1}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <aside style={{ position: 'sticky', top: 80 }}>

                {/* Quick Stats */}
                <div className="sidebar-panel" style={{ marginBottom: 16 }}>
                  <div className="sidebar-panel-head">Quick Stats</div>
                  {[
                    { label: 'Total listings',  value: listings.length },
                    { label: 'Avg rating',       value: `${avgRating} / 5` },
                    { label: 'Have a website',   value: withWebsite },
                    { label: 'No website',       value: withoutWebsite },
                    { label: 'Rated 4.7+',       value: topRated },
                  ].map(s => (
                    <div key={s.label} className="sidebar-stat-row">
                      <span className="sidebar-stat-label">{s.label}</span>
                      <span className="sidebar-stat-value">{s.value}</span>
                    </div>
                  ))}
                </div>

                {/* About */}
                <div className="sidebar-panel" style={{ marginBottom: 16 }}>
                  <div className="sidebar-panel-head">About This Area</div>
                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.65 }}>
                      {listings.length} verified {niche.label.toLowerCase()} in {suburbLabel},
                      sourced from Google Maps. Sorted by rating, highest first.
                      {withoutWebsite > 0 && ` ${withoutWebsite} have no website yet.`}
                    </p>
                  </div>
                </div>

                {/* Other areas */}
                {otherSuburbs.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
                      Other Areas Nearby
                    </p>
                    <SuburbSidebarLinks suburbs={otherSuburbs} nicheSlug={niche.slug} />
                  </div>
                )}

                <Link href="/" className="btn-ghost" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>All Categories</span>
                  <span>→</span>
                </Link>

              </aside>
            </div>
          </div>
        </section>

      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',      item: 'https://jozidirectories.co.za' },
            { '@type': 'ListItem', position: 2, name: niche.label, item: `https://jozidirectories.co.za/${niche.slug}` },
            { '@type': 'ListItem', position: 3, name: suburbLabel, item: `https://jozidirectories.co.za/${niche.slug}/${params.suburb}` },
          ]
        })
      }} />

      <Footer />
    </>
  )
}
