'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { IconLocation, IconPhoneFilled } from './Icons'

function Stars({ rating }) {
  const r = parseFloat(rating) || 0
  return (
    <span className="fc-stars" aria-label={`${r} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < Math.round(r) ? 'var(--gold)' : 'var(--border-2)' }}>★</span>
      ))}
    </span>
  )
}

const VISIBLE = 3

export default function FeaturedCarousel({ items }) {
  const [start, setStart]   = useState(0)
  const [paused, setPaused] = useState(false)
  const total = items.length

  const advance = useCallback(() => setStart(s => (s + 1) % total), [total])

  useEffect(() => {
    if (paused || total <= VISIBLE) return
    const t = setInterval(advance, 4500)
    return () => clearInterval(t)
  }, [paused, advance, total])

  if (!total) return null

  const visible = Array.from(
    { length: Math.min(VISIBLE, total) },
    (_, i) => items[(start + i) % total]
  )

  return (
    <section
      className="fc-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container">
        <div className="section-header">
          <div>
            <p className="fc-eyebrow">⭐ Top Rated</p>
            <h2 className="section-title">Featured Businesses</h2>
          </div>
          <div className="fc-controls">
            <button className="fc-btn" aria-label="Previous" onClick={() => setStart(s => (s - 1 + total) % total)}>←</button>
            <span className="fc-pos">{start + 1} / {total}</span>
            <button className="fc-btn" aria-label="Next" onClick={advance}>→</button>
          </div>
        </div>

        <div className="fc-grid">
          {visible.map((biz, i) => (
            <Link
              key={`${biz._place_id || biz.business_name}-${start}-${i}`}
              href={`/${biz.nicheSlug}`}
              className="fc-card"
            >
              <div className="fc-card-top">
                <span className="fc-card-ico">{biz.nicheIcon}</span>
                <span className="fc-card-cat">{biz.nicheLabel}</span>
              </div>
              <h3 className="fc-card-name">{biz.business_name}</h3>
              <div className="fc-card-rating">
                <span className="fc-rating-val">{biz.rating}</span>
                <Stars rating={biz.rating} />
                <span className="fc-review-cnt">
                  ({Number(biz.review_count || 0).toLocaleString()} reviews)
                </span>
              </div>
              {biz.suburb && (
                <p className="fc-card-suburb">
                  <IconLocation size={12} />
                  <span style={{ marginLeft: '4px' }}>{biz.suburb}</span>
                </p>
              )}
              {biz.phone && (
                <a
                  href={`tel:${biz.phone}`}
                  className="fc-card-phone"
                  onClick={e => e.stopPropagation()}
                >
                  <IconPhoneFilled size={12} />
                  <span style={{ marginLeft: '4px' }}>{biz.phone}</span>
                </a>
              )}
              <div className="fc-card-cta">View all listings →</div>
            </Link>
          ))}
        </div>

        <div className="fc-dots" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              className={`fc-dot${i === start ? ' active' : ''}`}
              role="tab"
              aria-selected={i === start}
              aria-label={`Go to business ${i + 1}`}
              onClick={() => setStart(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
