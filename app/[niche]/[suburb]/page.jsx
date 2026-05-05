import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ListingCard from '../../../components/ListingCard'
import SuburbSidebarLinks from '../../../components/SuburbSidebarLinks'
import { NICHES, getNicheBySlug } from '../../../lib/niches'
import { getListings, getSuburbsForNiche, slugify, deslugify } from '../../../lib/data'
import { BASE_URL } from '../../../lib/config'

export async function generateStaticParams() {
  const params = []
  for (const niche of NICHES) {
    const suburbs = getSuburbsForNiche(niche)
    for (const suburb of suburbs) {
      const suburbSlug = slugify(suburb)
      if (!suburbSlug) continue   // skip suburbs that slugify to empty string
      params.push({ niche: niche.slug, suburb: suburbSlug })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const niche = getNicheBySlug(params.niche)
  if (!niche) return {}
  const suburbLabel = deslugify(params.suburb)
  return {
    title: `Best ${niche.label} in ${suburbLabel}, Johannesburg (2026) | Jozi Directories`,
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
        <section style={{ background: 'var(--surface)', padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">

            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              {niche.label}
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
        <section style={{ padding: '64px 0' }}>
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
                      Showing {listings.length} {niche.label.toLowerCase()} in {suburbLabel}, Johannesburg.
                      Listings sourced from Google Maps and sorted by rating, highest first.
                      {withWebsite > 0 && ` ${withWebsite} ${withWebsite === 1 ? 'business has' : 'businesses have'} a website listed.`}
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
          '@graph': [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home',      item: BASE_URL },
                { '@type': 'ListItem', position: 2, name: niche.label, item: `${BASE_URL}/${niche.slug}` },
                { '@type': 'ListItem', position: 3, name: suburbLabel, item: `${BASE_URL}/${niche.slug}/${params.suburb}` },
              ],
            },
            ...listings.map(b => ({
              '@type': 'LocalBusiness',
              name: b.business_name,
              address: b.address ? {
                '@type': 'PostalAddress',
                streetAddress: b.address,
                addressLocality: b.suburb,
                addressRegion: 'Gauteng',
                addressCountry: 'ZA',
              } : undefined,
              telephone: b.phone || undefined,
              url: (b.has_website === 'TRUE' || b.has_website === true) ? b.website : undefined,
              aggregateRating: parseFloat(b.rating) > 0 ? {
                '@type': 'AggregateRating',
                ratingValue: parseFloat(b.rating).toFixed(1),
                reviewCount: parseInt(b.review_count) || 1,
                bestRating: '5',
                worstRating: '1',
              } : undefined,
              sameAs: b.google_maps_url || undefined,
            }))
          ]
        })
      }} />

      <Footer />
    </>
  )
}
