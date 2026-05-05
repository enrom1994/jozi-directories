import Link from 'next/link'
import { IconPhone, IconGlobe, IconMapPin, IconStar, IconExternal, IconCheck } from './Icons'

export default function ListingCard({ business, rank }) {
  const hasWebsite = business.has_website === 'TRUE' || business.has_website === true
  const rating     = parseFloat(business.rating) || 0
  const reviews    = parseInt(business.review_count) || 0
  const stars      = Math.round(rating)
  const isTop      = rank <= 3

  return (
    <div className="listing-card">

      {/* Rank number */}
      {rank != null && (
        <div className={`listing-rank ${isTop ? 'is-top' : ''}`}>
          {rank}
        </div>
      )}

      {/* Main body */}
      <div className="listing-body">
        <h3 className="listing-name">{business.business_name}</h3>

        {business.address && (
          <div className="listing-address">
            <IconMapPin size={12} />
            <span>{business.address}</span>
          </div>
        )}

        {rating > 0 && (
          <div className="listing-rating">
            <div className="stars">
              {[1,2,3,4,5].map(i => (
                <span key={i} className={i <= stars ? 'star-on' : 'star-off'}>
                  <IconStar size={13} filled={i <= stars} />
                </span>
              ))}
            </div>
            <span className="rating-value">{rating.toFixed(1)}</span>
            <span className="rating-count">({reviews.toLocaleString()} reviews)</span>
          </div>
        )}

        <div className="listing-actions">
          {business.phone && (
            <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>
              <IconPhone size={12} />
              {business.phone}
            </a>
          )}
          {business.google_maps_url && (
            <a href={business.google_maps_url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <IconMapPin size={12} />
              Maps
              <IconExternal size={10} />
            </a>
          )}
          {hasWebsite && business.website && (
            <a href={business.website} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              <IconGlobe size={12} />
              Website
              <IconExternal size={10} />
            </a>
          )}
        </div>

        {/* Claim nudge — shown for businesses without a website */}
        {!hasWebsite && (
          <p className="claim-nudge">
            Is this your business?{' '}
            <Link href="/add-business" className="claim-nudge-link">Claim it free →</Link>
          </p>
        )}
      </div>

      {/* Right meta */}
      <div className="listing-meta">
        {hasWebsite && (
          <span className="badge badge-green">
            <IconCheck size={9} /> Online
          </span>
        )}
        {rating >= 4.7 && (
          <span className="badge badge-gold">Top Rated</span>
        )}
      </div>

      {/* Note: per-card LocalBusiness schema removed — page-level @graph handles all listings */}
    </div>
  )
}
