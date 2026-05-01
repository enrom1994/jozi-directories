'use client'
import Link from 'next/link'
import { slugify } from '../lib/utils'

export default function SuburbSidebarLinks({ suburbs, nicheSlug }) {
  return (
    <div className="sidebar-panel">
      {suburbs.map(suburb => (
        <Link key={suburb} href={`/${nicheSlug}/${slugify(suburb)}`} className="sidebar-link">
          <span>{suburb}</span>
          <span style={{ color: 'var(--gold)', fontSize: 14 }}>›</span>
        </Link>
      ))}
      <Link href={`/${nicheSlug}`} className="sidebar-link" style={{ color: 'var(--gold)' }}>
        <span>All Areas</span>
        <span style={{ fontSize: 14 }}>›</span>
      </Link>
    </div>
  )
}
