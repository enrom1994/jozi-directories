// app/admin/page.jsx
// Server component — reads data files, passes stats to the client panel.
// Only accessible when ADMIN_ENABLED=true.

import { notFound } from 'next/navigation'
import { NICHES } from '@/lib/niches'
import { getNicheStats } from '@/lib/data'
import AdminClient from './AdminClient'

export const metadata = {
  title: 'Admin — Jozi Directories',
  robots: 'noindex, nofollow',
}

export default function AdminPage() {
  if (process.env.ADMIN_ENABLED !== 'true') {
    notFound()
  }

  // Build stats for each registered niche
  const nicheStats = NICHES.map((niche) => ({
    slug:      niche.slug,
    label:     niche.label,
    icon:      niche.icon,
    ...getNicheStats(niche),
  }))

  // Slim niche list for the client dropdown
  const niches = NICHES.map((n) => ({
    slug:  n.slug,
    label: n.label,
    icon:  n.icon,
  }))

  return <AdminClient nicheStats={nicheStats} niches={niches} />
}
