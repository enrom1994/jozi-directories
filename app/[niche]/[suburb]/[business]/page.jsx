import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import { NICHES, getNicheBySlug } from '../../../../lib/niches'
import { getListings, getSuburbsForNiche, getBusinessBySlug, slugify, deslugify, starRating } from '../../../../lib/data'
import { BASE_URL } from '../../../../lib/config'

export async function generateStaticParams() {
  const params = []
  for (const niche of NICHES) {
    const suburbs = getSuburbsForNiche(niche)
    for (const suburb of suburbs) {
      const suburbSlug = slugify(suburb)
      if (!suburbSlug) continue
      const listings = getListings(niche, suburbSlug)
      for (const business of listings) {
        if (!business.business_name) continue
        const businessSlug = slugify(business.business_name)
        if (!businessSlug) continue
        params.push({ niche: niche.slug, suburb: suburbSlug, business: businessSlug })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const niche = getNicheBySlug(params.niche)
  if (!niche) return {}
  const business = getBusinessBySlug(niche, params.suburb, params.business)
  if (!business) return {}
  const suburbLabel = deslugify(params.suburb)
  return {
    title: `${business.business_name} | ${niche.label} in ${suburbLabel}, Johannesburg | Jozi Directories`,
    description: `${business.business_name} is a ${niche.label.toLowerCase()} in ${suburbLabel}, Johannesburg. ${business.rating ? `Rated ${business.rating}/5 based on ${business.review_count} reviews.` : ''} ${business.address ? `Located at ${business.address}.` : ''}`,
  }
}

export default function BusinessPage({ params }) {
  const niche = getNicheBySlug(params.niche)
  if (!niche) notFound()

  const business = getBusinessBySlug(niche, params.suburb, params.business)
  if (!business) notFound()

  const suburbLabel = deslugify(params.suburb)
  const allListings = getListings(niche, params.suburb)
  const otherBusinesses = allListings.filter(b => slugify(b.business_name) !== params.business).slice(0, 4)

  const hasRating = parseFloat(business.rating) > 0
  const hasPhone = business.phone && business.phone !== 'N/A'
  const hasWebsite = business.has_website === 'TRUE' || business.has_website === true

  return (
    <>
      <Header
        breadcrumbs={[
          { label: niche.label, href: `/${niche.slug}` },
          { label: suburbLabel, href: `/${niche.slug}/${params.suburb}` },
          { label: business.business_name },
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
              {business.business_name}
            </h1>

            {business.address && (
              <p style={{ fontSize: 15, color: 'var(--ink-2)', marginBottom: 16 }}>
                {business.address}
              </p>
            )}

            {/* Rating row */}
            {hasRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                <span style={{ color: 'var(--gold)', fontSize: 18 }}>{starRating(parseFloat(business.rating))}</span>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{parseFloat(business.rating).toFixed(1)}</span>
                <span style={{ color: 'var(--ink-3)', fontSize: 14 }}>
                  ({business.review_count} review{business.review_count !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
              {hasPhone && (
                <a
                  href={`tel:${business.phone}`}
                  className="btn-primary"
                  style={{ background: 'var(--accent)', color: 'white', border: 'none' }}
                >
                  Call {business.phone}
                </a>
              )}
              <a
                href={business.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)' }}
              >
                Open in Maps
              </a>
              {hasWebsite && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--border)' }}
                >
                  Visit Website
                </a>
              )}
            </div>

            <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              Is this your business? <Link href="/" style={{ color: 'var(--accent)' }}>Claim it free →</Link>
            </p>

          </div>
        </section>

        {/* ── CONTENT ───────────────────────────────────────────── */}
        <section style={{ padding: '64px 0' }}>
          <div className="container">
            <div className="content-grid">

              {/* Left column */}
              <div>
                <div className="section-header">
                  <h2 className="section-title">About this business</h2>
                </div>
                <p style={{ fontSize: 15, color: 'var(--ink-2)', lineHeight: 1.7 }}>
                  {business.business_name} is a {niche.label.toLowerCase()} located in {suburbLabel}, Johannesburg.
                  {hasRating && ` Rated ${parseFloat(business.rating).toFixed(1)}/5 based on ${business.review_count} reviews on Google Maps.`}
                  {business.address && ` Find them at ${business.address}.`}
                </p>
              </div>

              {/* Right sidebar */}
              <aside style={{ position: 'sticky', top: 80 }}>

                {/* Business details card */}
                <div className="sidebar-panel" style={{ marginBottom: 16 }}>
                  <div className="sidebar-panel-head">Business Details</div>
                  <div style={{ padding: '14px 16px' }}>
                    {hasPhone && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>
                          Phone
                        </div>
                        <a href={`tel:${business.phone}`} style={{ fontSize: 15, color: 'var(--ink)', textDecoration: 'none' }}>
                          {business.phone}
                        </a>
                      </div>
                    )}
                    {business.address && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>
                          Address
                        </div>
                        <div style={{ fontSize: 15, color: 'var(--ink-2)' }}>
                          {business.address}
                        </div>
                      </div>
                    )}
                    {hasWebsite && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>
                          Website
                        </div>
                        <a href={business.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: 'var(--accent)', textDecoration: 'none' }}>
                          {business.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other businesses card */}
                {otherBusinesses.length > 0 && (
                  <div className="sidebar-panel">
                    <div className="sidebar-panel-head">Other {niche.label} in {suburbLabel}</div>
                    <div style={{ padding: '14px 16px' }}>
                      {otherBusinesses.map((b, i) => (
                        <Link
                          key={b._place_id || i}
                          href={`/${niche.slug}/${params.suburb}/${slugify(b.business_name)}`}
                          style={{
                            display: 'block',
                            padding: '8px 0',
                            fontSize: 14,
                            color: 'var(--ink-2)',
                            textDecoration: 'none',
                            borderBottom: i < otherBusinesses.length - 1 ? '1px solid var(--border-2)' : 'none',
                          }}
                        >
                          {b.business_name}
                          {hasRating && (
                            <span style={{ marginLeft: 8, color: 'var(--gold)', fontSize: 12 }}>
                              {parseFloat(b.rating).toFixed(1)}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </aside>
            </div>
          </div>
        </section>

      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: business.business_name,
          telephone: hasPhone ? business.phone : undefined,
          address: business.address ? {
            '@type': 'PostalAddress',
            streetAddress: business.address,
            addressLocality: suburbLabel,
            addressRegion: 'Gauteng',
            addressCountry: 'ZA',
          } : undefined,
          aggregateRating: hasRating ? {
            '@type': 'AggregateRating',
            ratingValue: parseFloat(business.rating).toFixed(1),
            reviewCount: parseInt(business.review_count) || 1,
            bestRating: '5',
            worstRating: '1',
          } : undefined,
          url: hasWebsite ? business.website : undefined,
          sameAs: business.google_maps_url || undefined,
        })
      }} />

      <Footer />
    </>
  )
}
