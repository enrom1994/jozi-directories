// app/admin/page.jsx
// Server component — reads data files, passes stats to the client panel.
// Only accessible when ADMIN_ENABLED=true.

import { notFound } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { NICHES } from '@/lib/niches'
import { getNicheStats } from '@/lib/data'
import AdminClient from './AdminClient'
import Header from '@/components/Header'

export const metadata = {
  title: 'Admin — Jozi Directories',
  robots: 'noindex, nofollow',
}

export default function AdminPage() {
  if (process.env.ADMIN_ENABLED !== 'true') {
    notFound()
  }

  // Build stats — only show niches that have been scraped
  const allStats = NICHES.map((niche) => ({
    slug:  niche.slug,
    label: niche.label,
    icon:  niche.icon,
    ...getNicheStats(niche),
  }))
  const nicheStats   = allStats.filter((s) => s.total > 0)
  const pendingCount = allStats.filter((s) => s.total === 0).length

  // Slim niche list for the client dropdown
  const niches = NICHES.map((n) => ({
    slug:  n.slug,
    label: n.label,
    icon:  n.icon,
  }))

  // Pass env checks from server (env vars not readable in browser)
  const envStatus = {
    webhookSet: !!process.env.N8N_WEBHOOK_URL,
    adminEnabled: true,
  }

  // Read featured.json
  let featuredItems = []
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'featured.json'), 'utf-8')
    featuredItems = JSON.parse(raw)
    if (!Array.isArray(featuredItems)) featuredItems = []
  } catch (_) {}

  return (
    <>
      <Header />
      <AdminClient
        nicheStats={nicheStats}
        niches={niches}
        envStatus={envStatus}
        pendingCount={pendingCount}
        totalNiches={NICHES.length}
        featuredItems={featuredItems}
      />
    </>
  )
}
