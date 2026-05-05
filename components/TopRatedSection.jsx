'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const LS_KEY = 'jozi_suburb'

export default function TopRatedSection({ topRated, fallback }) {
  // Server renders with fallback (top-4 overall) — no hydration mismatch
  const [listings, setListings] = useState(fallback)
  const [suburb,   setSuburb]   = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (!saved) return

    setSuburb(saved)

    // Filter the server-provided top-50 for this suburb
    const matches = topRated
      .filter(b => b.suburb?.toLowerCase() === saved.toLowerCase())
      .slice(0, 4)

    if (matches.length > 0) setListings(matches)
  }, [topRated])

  return (
    <section className="top-rated-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            Top rated near{' '}
            <span style={{ color: 'var(--gold)' }}>{suburb || 'Johannesburg'}</span>
          </h2>
          <span className="section-count">{listings.length} results</span>
        </div>

        <div className="top-listings-grid">
          {listings.map((b, i) => (
            <Link
              key={`${b.nicheSlug}-${b.business_name}-${i}`}
              href={`/${b.nicheSlug}/${b.suburbSlug}`}
              className="top-listing-row"
            >
              <div className={`top-rank${i < 2 ? ' top-rank--accent' : ''}`}>
                {i + 1}
              </div>
              <div className="top-listing-info">
                <p className="top-listing-name">{b.business_name}</p>
                <p className="top-listing-meta">
                  <span className="top-listing-rating">{b.rating}</span>
                  <span className="top-meta-sep">·</span>
                  {b.suburb}
                  <span className="top-meta-sep">·</span>
                  {b.nicheLabel}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
