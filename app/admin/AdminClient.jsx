'use client'

import { useState } from 'react'
import { LOCATIONS, LOCATION_GROUPS } from '@/lib/locations'

// Admin panel — only renders if ADMIN_ENABLED=true is set
// nicheStats is passed from the server component wrapper (page.jsx)
export default function AdminClient({ nicheStats, niches, envStatus, pendingCount = 0, totalNiches = 0, featuredItems = [] }) {
  const [nicheSlug, setNicheSlug] = useState(niches[0]?.slug ?? '')
  const [location, setLocation]   = useState(LOCATIONS[0]?.value ?? '')
  const [status, setStatus]       = useState(null)
  const [message, setMessage]     = useState('')

  // Featured listings state
  const [featNiche, setFeatNiche]   = useState(niches[0]?.slug ?? '')
  const [featName, setFeatName]     = useState('')
  const [featLabel, setFeatLabel]   = useState('')
  const [featStatus, setFeatStatus] = useState(null)
  const [featMsg, setFeatMsg]       = useState('')

  async function handleScrape(e) {
    e.preventDefault()
    if (!location) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/trigger-scrape', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ niche_slug: nicheSlug, location }),
      })
      const data = await res.json()
      if (res.ok) { setStatus('ok'); setMessage(data.message) }
      else { setStatus('error'); setMessage(data.error + (data.detail ? ` — ${data.detail}` : '')) }
    } catch (err) {
      setStatus('error')
      setMessage(`Network error: ${err.message}`)
    }
  }

  async function handleAddFeatured(e) {
    e.preventDefault()
    if (!featNiche || !featName.trim()) return
    setFeatStatus('loading'); setFeatMsg('')
    try {
      const res = await fetch('/api/trigger-scrape', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'add_featured', nicheSlug: featNiche, businessName: featName.trim(), label: featLabel.trim() }),
      })
      const data = await res.json()
      if (res.ok) { setFeatStatus('ok'); setFeatMsg('Featured listing added. Rebuild will follow.'); setFeatName(''); setFeatLabel('') }
      else { setFeatStatus('error'); setFeatMsg(data.error || 'Failed') }
    } catch (err) { setFeatStatus('error'); setFeatMsg(`Network error: ${err.message}`) }
  }

  async function handleRemoveFeatured(businessName, nicheSlug) {
    if (!confirm(`Remove "${businessName}" from featured listings?`)) return
    try {
      await fetch('/api/trigger-scrape', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'remove_featured', businessName, nicheSlug }),
      })
    } catch (_) {}
  }

  return (
    <div className="admin-wrap">
      <header className="admin-header">
        <div className="admin-badge">ADMIN</div>
        <h1 className="admin-title">Scrape Control Panel</h1>
        <p className="admin-sub">Trigger the n8n scraper. Results commit to GitHub and auto-deploy via Vercel.</p>
      </header>

      {/* Stats grid */}
      <section className="admin-stats-section">
        <h2 className="admin-section-title">Current Dataset</h2>
        {nicheStats.length === 0 ? (
          <div style={{ color: 'var(--ink-3)', fontSize: 14, padding: '16px 0' }}>
            No data yet — {pendingCount} of {totalNiches} niches awaiting first scrape.
          </div>
        ) : (
          <>
            <div className="admin-stats-grid">
              {nicheStats.map((s) => (
                <div key={s.slug} className="admin-stat-card">
                  <span className="admin-stat-icon">{s.icon}</span>
                  <div className="admin-stat-body">
                    <div className="admin-stat-label">{s.label}</div>
                    <div className="admin-stat-value">{s.total.toLocaleString()}</div>
                    <div className="admin-stat-meta">{s.suburbs} areas · avg {s.avgRating}★</div>
                  </div>
                </div>
              ))}
            </div>
            {pendingCount > 0 && (
              <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 12 }}>
                + {pendingCount} niches not yet scraped
              </p>
            )}
          </>
        )}
      </section>

      {/* Trigger form */}
      <section className="admin-trigger-section">
        <h2 className="admin-section-title">Trigger Scrape</h2>
        <form className="admin-form" onSubmit={handleScrape}>
          <div className="admin-form-row">
            <label className="admin-label" htmlFor="niche-select">Niche</label>
            <select
              id="niche-select"
              className="admin-select"
              value={nicheSlug}
              onChange={(e) => setNicheSlug(e.target.value)}
            >
              {niches.map((n) => (
                <option key={n.slug} value={n.slug}>{n.icon} {n.label}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-row">
            <label className="admin-label" htmlFor="location-select">Location</label>
            <select
              id="location-select"
              className="admin-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {LOCATION_GROUPS.map((group) => (
                <optgroup key={group} label={`— ${group}`}>
                  {LOCATIONS.filter((l) => l.group === group).map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="admin-hint">Area within Johannesburg to scrape.</span>
          </div>

          <button
            type="submit"
            className={`admin-btn ${status === 'loading' ? 'loading' : ''}`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? '⏳ Triggering…' : '🚀 Run Scrape'}
          </button>
        </form>

        {/* Status feedback */}
        {status === 'ok' && (
          <div className="admin-feedback ok">
            <span className="admin-feedback-icon">✅</span>
            <div>
              <strong>Scrape triggered</strong>
              <p>{message}</p>
              <p className="admin-feedback-note">Watch the n8n dashboard. GitHub commit + Vercel deploy will follow in ~3 min.</p>
            </div>
          </div>
        )}
        {status === 'error' && (
          <div className="admin-feedback error">
            <span className="admin-feedback-icon">❌</span>
            <div>
              <strong>Failed to trigger</strong>
              <p>{message}</p>
            </div>
          </div>
        )}
      </section>

      {/* Featured Listings */}
      <section className="admin-trigger-section">
        <h2 className="admin-section-title">Featured Listings</h2>
        <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 20 }}>
          Featured businesses appear in the hero card carousel on the homepage.
          Adding or removing triggers a rebuild via n8n.
        </p>

        {/* Current featured */}
        {featuredItems.length > 0 ? (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
              Currently Featured
            </p>
            <div className="admin-env-grid">
              {featuredItems.map((f, i) => (
                <div key={i} className="admin-env-row" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <code className="admin-env-key">{f.businessName}</code>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 8 }}>{f.nicheSlug}</span>
                  </div>
                  <button
                    className="admin-btn"
                    style={{ padding: '4px 10px', fontSize: 11, background: 'var(--red)', marginLeft: 12 }}
                    onClick={() => handleRemoveFeatured(f.businessName, f.nicheSlug)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 16, fontStyle: 'italic' }}>
            No featured listings yet. Add one below.
          </p>
        )}

        {/* Add featured form */}
        <form className="admin-form" onSubmit={handleAddFeatured}>
          <div className="admin-form-row">
            <label className="admin-label" htmlFor="feat-niche">Niche</label>
            <select id="feat-niche" className="admin-select" value={featNiche} onChange={e => setFeatNiche(e.target.value)}>
              {niches.map(n => <option key={n.slug} value={n.slug}>{n.label}</option>)}
            </select>
          </div>
          <div className="admin-form-row">
            <label className="admin-label" htmlFor="feat-name">Business Name (exact match)</label>
            <input id="feat-name" className="admin-input" type="text" value={featName}
              onChange={e => setFeatName(e.target.value)} placeholder="e.g. Ray Driving School" />
            <span className="admin-hint">Must match the business_name field exactly in the data file.</span>
          </div>
          <div className="admin-form-row">
            <label className="admin-label" htmlFor="feat-label">Display Label (optional)</label>
            <input id="feat-label" className="admin-input" type="text" value={featLabel}
              onChange={e => setFeatLabel(e.target.value)} placeholder="e.g. Top Driving School" />
          </div>
          <button type="submit" className={`admin-btn ${featStatus === 'loading' ? 'loading' : ''}`}
            disabled={featStatus === 'loading' || !featName.trim()}>
            {featStatus === 'loading' ? 'Adding…' : '+ Add to Featured'}
          </button>
        </form>

        {featStatus === 'ok' && (
          <div className="admin-feedback ok" style={{ marginTop: 16 }}>
            <span className="admin-feedback-icon">&#10003;</span>
            <div><strong>Done</strong><p>{featMsg}</p></div>
          </div>
        )}
        {featStatus === 'error' && (
          <div className="admin-feedback error" style={{ marginTop: 16 }}>
            <span className="admin-feedback-icon">&#10007;</span>
            <div><strong>Error</strong><p>{featMsg}</p></div>
          </div>
        )}
      </section>

      {/* Env check */}
      <section className="admin-env-section">
        <h2 className="admin-section-title">Environment</h2>
        <div className="admin-env-grid">
          <EnvRow label="N8N_WEBHOOK_URL" set={envStatus?.webhookSet ?? false} />
          <EnvRow label="ADMIN_ENABLED" set={envStatus?.adminEnabled ?? true} />
        </div>
      </section>
    </div>
  )
}

function EnvRow({ label, set }) {
  return (
    <div className="admin-env-row">
      <code className="admin-env-key">{label}</code>
      <span className={`admin-env-status ${set ? 'set' : 'missing'}`}>
        {set ? '✓ set' : '✗ missing'}
      </span>
    </div>
  )
}
