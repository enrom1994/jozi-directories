// app/api/trigger-scrape/route.js
// Fires the n8n webhook to kick off a scrape for a given niche + location.
// Only active when ADMIN_ENABLED=true is set in the environment.

import { NextResponse } from 'next/server'
import { NICHES } from '@/lib/niches'

export async function POST(request) {
  // Guard — only enabled in dev or when explicitly allowed
  if (process.env.ADMIN_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'N8N_WEBHOOK_URL is not configured' },
      { status: 500 }
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { niche_slug, location } = body

  if (!niche_slug || !location) {
    return NextResponse.json(
      { error: 'niche_slug and location are required' },
      { status: 400 }
    )
  }

  // Resolve niche from registry
  const niche = NICHES.find((n) => n.slug === niche_slug)
  if (!niche) {
    return NextResponse.json(
      { error: `Unknown niche slug: ${niche_slug}` },
      { status: 400 }
    )
  }

  // Build the payload n8n expects
  const payload = {
    niche_name:  niche.label,
    niche_slug:  niche.slug,
    search_term: niche.searchKeywords[0], // primary keyword
    location:    location.trim(),
    secret:      process.env.N8N_WEBHOOK_SECRET ?? '',
  }

  try {
    const n8nRes = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!n8nRes.ok) {
      const text = await n8nRes.text()
      return NextResponse.json(
        { error: `n8n returned ${n8nRes.status}`, detail: text },
        { status: 502 }
      )
    }

    return NextResponse.json({
      ok:      true,
      message: `Scrape triggered: ${niche.label} in ${location}`,
      niche:   niche.label,
      keyword: payload.search_term,
      location,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to reach n8n webhook', detail: err.message },
      { status: 502 }
    )
  }
}
