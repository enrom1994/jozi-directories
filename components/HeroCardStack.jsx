'use client'
import { useState, useEffect, useCallback } from 'react'
import StarRating from './ui/StarRating'

// Gradient colours per card — cycles through if more cards than gradients
const GRADIENTS = [
  'linear-gradient(135deg, #7A2010 0%, #B54419 100%)',
  'linear-gradient(135deg, #1A3B5C 0%, #2D6A9F 100%)',
  'linear-gradient(135deg, #2D5016 0%, #4A7C25 100%)',
  'linear-gradient(135deg, #3B1A5C 0%, #6A2D9F 100%)',
  'linear-gradient(135deg, #5C3B1A 0%, #9F6A2D 100%)',
]

function CardContent({ biz, gradient }) {
  if (!biz) return null
  return (
    <>
      <div className="biz-card-photo" style={{ background: gradient }}>
        <span className="biz-card-photo-label">{biz.nicheLabel}</span>
      </div>
      <div className="biz-card-body">
        <p className="biz-card-cat">{biz.nicheLabel}</p>
        <p className="biz-card-name">{biz.business_name}</p>
        <StarRating rating={biz.rating} count={biz.review_count} size={9} />
        {biz.suburb && (
          <p className="biz-card-suburb">
            <span className="suburb-pin" aria-hidden="true" />
            {biz.suburb}
          </p>
        )}
      </div>
    </>
  )
}

export default function HeroCardStack({ items }) {
  const [idx, setIdx]     = useState(0)
  const [paused, setPaused] = useState(false)
  const total = items.length

  const advance = useCallback(() => setIdx(i => (i + 1) % total), [total])

  useEffect(() => {
    if (paused || total <= 1) return
    const t = setInterval(advance, 4000)
    return () => clearInterval(t)
  }, [paused, advance, total])

  if (!total) return null

  const front = items[idx % total]
  const back  = items[(idx + 1) % total]

  return (
    <div
      className="hero-card-stack"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured businesses"
    >
      <div className="biz-card biz-card--back">
        <CardContent biz={back}  gradient={GRADIENTS[(idx + 1) % GRADIENTS.length]} />
      </div>
      <div className="biz-card biz-card--front">
        <CardContent biz={front} gradient={GRADIENTS[idx % GRADIENTS.length]} />
      </div>
    </div>
  )
}
