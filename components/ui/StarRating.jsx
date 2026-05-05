import { IconStar } from '../Icons'

export default function StarRating({ rating, count, size = 13 }) {
  const r     = parseFloat(rating) || 0
  const stars = Math.round(r)

  return (
    <div className="star-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map(i => (
          <span key={i} className={i <= stars ? 'star-on' : 'star-off'}>
            <IconStar size={size} filled={i <= stars} />
          </span>
        ))}
      </div>
      <span className="rating-value">{r.toFixed(1)}</span>
      {count != null && (
        <span className="rating-count">({Number(count).toLocaleString()})</span>
      )}
    </div>
  )
}
