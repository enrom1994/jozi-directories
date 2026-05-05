import Link from 'next/link'

export default function SectionHeader({ title, subtitle, link, linkLabel = 'View all →' }) {
  return (
    <div className="section-header">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {link && (
        <Link href={link} className="section-link">{linkLabel}</Link>
      )}
    </div>
  )
}
