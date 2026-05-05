import { NextResponse } from 'next/server'
import { NICHES } from '../../../lib/niches'
import { loadNicheData } from '../../../lib/data'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim().toLowerCase()

  if (q.length < 2) {
    return NextResponse.json({ categories: [], businesses: [] })
  }

  // Categories — fast, in-memory
  const categories = NICHES
    .filter(n =>
      n.label.toLowerCase().includes(q) ||
      n.searchKeywords?.some(k => k.toLowerCase().includes(q))
    )
    .slice(0, 5)
    .map(n => ({ label: n.label, slug: n.slug }))

  // Businesses — scan JSON files, stop at 8 matches
  const businesses = []
  for (const niche of NICHES) {
    if (businesses.length >= 8) break
    try {
      const data = loadNicheData(niche.dataFile)
      for (const b of data) {
        if (businesses.length >= 8) break
        if (b.business_name?.toLowerCase().includes(q)) {
          businesses.push({
            business_name: b.business_name,
            suburb:        b.suburb,
            rating:        b.rating,
            nicheSlug:     niche.slug,
            nicheLabel:    niche.label,
          })
        }
      }
    } catch (_) {
      // niche file missing — skip silently
    }
  }

  return NextResponse.json({ categories, businesses })
}
