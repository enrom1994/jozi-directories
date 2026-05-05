import Pill from './ui/Pill'

export default function CategoryPillStrip({ niches }) {
  return (
    <div className="cat-pill-strip-wrap">
      <p className="cat-pill-strip-label">Browse by category</p>
      <div className="cat-pill-strip">
        {niches.map(n => (
          <Pill
            key={n.slug}
            label={n.label}
            count={n.stats.total}
            href={`/${n.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
