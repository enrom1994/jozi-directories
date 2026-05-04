import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { NICHES, getNicheBySlug } from '../../lib/niches'
import { getSuburbsWithCounts, getNicheStats, slugify } from '../../lib/data'
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
        <section style={{ background: 'var(--surface)', padding: '56px 0 48px', borderBottom: '1px solid var(--border)' }}>
          <div className="container">

            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              {niche.icon} {niche.label} · Johannesburg
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
