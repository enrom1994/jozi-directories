import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { NICHES, getNicheBySlug } from '../../lib/niches'
import { getSuburbsWithCounts, getNicheStats, loadNicheData, slugify } from '../../lib/data'
import SuburbSearch from '../../components/SuburbSearch'
import { BASE_URL } from '../../lib/config'

export async function generateStaticParams() {
  return NICHES.map(n => ({ niche: n.slug }))
}

export async function generateMetadata({ params }) {
  const niche = getNicheBySlug(params.niche)
  if (!niche) return {}
  return {
    title: `Best ${niche.label} in Johannesburg (2026) | Jozi Directories`,
    description: `Find and compare the best ${niche.label.toLowerCase()} in Johannesburg and Gauteng. Real Google Maps data, sorted by rating.`,
  }
}

// Server component: top 5 rated listings for this niche
function NicheTopRated({ niche, inline = false }) {
  const data = loadNicheData(niche.dataFile)
  const top5 = data
    .filter(b => parseFloat(b.rating) > 0)
    .sort((a, b) => {
      const rDiff = parseFloat(b.rating) - parseFloat(a.rating)
      if (rDiff !== 0) return rDiff
      return (parseInt(b.review_count) || 0) - (parseInt(a.review_count) || 0)
    })
    .slice(0, 5)

  if (top5.length === 0) return null

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {!inline && (
        <div className="section-header">
          <h2 className="section-title">Top Rated {niche.label}</h2>
          <span className="section-count">Across all areas</span>
        </div>
      )}
      {inline && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 10,
          paddingBottom: 8,
          borderBottom: '1px solid var(--border)'
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            color: 'var(--ink-3)'
          }}>Top Rated</span>
          <span style={{
            fontSize: 10,
            color: 'var(--ink-3)'
          }}>Across all areas</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        {top5.map((b, i) => {
          const suburbSlug = slugify(b.suburb || '')
          const isTop2 = i < 2
          return (
            <Link
              key={b._place_id || `${b.business_name}-${i}`}
              href={suburbSlug ? `/${niche.slug}/${suburbSlug}` : `/${niche.slug}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: inline ? 10 : 16,
                padding: inline ? '10px 12px' : '16px 20px',
                background: '#FFFFFF',
                borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                textDecoration: 'none',
                transition: 'background 0.12s',
              }}
              className="niche-top-row"
            >
              {/* Rank badge */}
              <div style={{
                width: inline ? 24 : 30,
                height: inline ? 24 : 30,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: inline ? 11 : 12,
                fontWeight: 800,
                background: isTop2 ? '#FCF0EB' : 'var(--surface-2)',
                border: `1px solid ${isTop2 ? '#B54419' : 'var(--border-2)'}`,
                color: isTop2 ? '#B54419' : 'var(--ink-3)',
              }}>
                {i + 1}
              </div>

              {/* Business info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: inline ? 13 : 14,
                  fontWeight: 600,
                  color: '#17120B',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: inline ? 2 : 1,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.3,
                }}>
                  {b.business_name}
                </p>
                <p style={{
                  fontSize: inline ? 11 : 12,
                  color: 'var(--ink-3)',
                  margin: '4px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  flexWrap: 'wrap',
                }}>
                  <span style={{ color: '#B54419', fontWeight: 700 }}>{parseFloat(b.rating).toFixed(1)}</span>
                  <span>·</span>
                  <span style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: inline ? '80px' : '120px',
                  }}>{b.suburb}</span>
                  {!inline && parseInt(b.review_count) > 0 && (
                    <>
                      <span>·</span>
                      <span>{parseInt(b.review_count).toLocaleString()} reviews</span>
                    </>
                  )}
                </p>
              </div>

              {/* Arrow - only for non-inline */}
              {!inline && (
                <span style={{ color: '#A8998A', fontSize: 14, flexShrink: 0 }}>→</span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )

  if (inline) {
    return content
  }

  return (
    <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div className="container">
        {content}
      </div>
    </section>
  )
}

export default function NichePage({ params }) {
  const niche = getNicheBySlug(params.niche)
  if (!niche) notFound()

  const suburbs = getSuburbsWithCounts(niche)
  const stats   = getNicheStats(niche)

  return (
    <>
      <Header breadcrumbs={[{ label: niche.label }]} />
      <main>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section style={{ background: 'var(--surface)', padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="hero-split">

            {/* Left: H1, description, stats, SEO paragraph */}
            <div className="hero-left">
              <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                {niche.label} · Johannesburg
              </div>

              <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', marginBottom: 12 }}>
                Best <em>{niche.label}</em><br />in Johannesburg
              </h1>

              <p className="hero-sub" style={{ marginBottom: 32 }}>
                {niche.description} All listings sourced from Google Maps, sorted by rating.
              </p>

              {/* Stats */}
              {stats.total > 0 && (
                <div className="hero-stats">
                  <div className="hero-stat">
                    <span className="hero-stat-value">{stats.total}</span>
                    <span className="hero-stat-label">Listings</span>
                  </div>
                  <div className="hero-stat">
                    <span className="hero-stat-value">{stats.suburbs}</span>
                    <span className="hero-stat-label">Areas</span>
                  </div>
                  {stats.avgRating > 0 && (
                    <div className="hero-stat">
                      <span className="hero-stat-value">{stats.avgRating}</span>
                      <span className="hero-stat-label">Avg Rating</span>
                    </div>
                  )}
                </div>
              )}

              {/* SEO descriptive paragraph */}
              {stats.total > 0 && (
                <p style={{ marginTop: 24, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.7, maxWidth: 640 }}>
                  {stats.total} {niche.label.toLowerCase()} listed across {stats.suburbs} suburb{stats.suburbs !== 1 ? 's' : ''} in Johannesburg and Gauteng,
                  sourced directly from Google Maps. All listings are sorted by rating so the highest-rated {niche.label.toLowerCase()} appear first.
                  Use the area index below to find {niche.searchKeywords[0]} near you.
                </p>
              )}
            </div>

            {/* Right: Top rated listings */}
            <div className="hero-right">
              <NicheTopRated niche={niche} inline />
            </div>

          </div>
        </section>

        {/* ── SUBURB GRID ───────────────────────────────────────── */}
        <section style={{ padding: '48px 0 80px' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Browse by Area</h2>
              {suburbs.length > 0 && (
                <span className="section-count">{suburbs.length} areas covered</span>
              )}
            </div>

            {suburbs.length === 0 ? (
              <div style={{
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '48px 24px',
                textAlign: 'center',
                background: 'var(--surface)',
              }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--ink-3)', marginBottom: 6 }}>
                  No Listings Yet
                </p>
                <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Data loading — check back soon</p>
              </div>
            ) : (
              <SuburbSearch suburbs={suburbs} nicheSlug={niche.slug} />
            )}
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
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
                { '@type': 'ListItem', position: 2, name: niche.label, item: `${BASE_URL}/${niche.slug}` },
              ],
            },
            {
              '@type': 'ItemList',
              name: `Best ${niche.label} in Johannesburg`,
              description: niche.description,
              numberOfItems: suburbs.length,
              itemListElement: suburbs.map((s, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: `${niche.label} in ${s.name}`,
                url: `${BASE_URL}/${niche.slug}/${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
              })),
            },
          ]
        })
      }} />

      <Footer />
    </>
  )
}
