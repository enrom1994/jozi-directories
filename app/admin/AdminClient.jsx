'use client'

import { useState } from 'react'

// Admin panel — only renders if ADMIN_ENABLED=true is set
// nicheStats is passed from the server component wrapper (page.jsx)
export default function AdminClient({ nicheStats, niches, envStatus, pendingCount = 0, totalNiches = 0 }) {
  const [nicheSlug, setNicheSlug] = useState(niches[0]?.slug ?? '')
  const [location, setLocation]   = useState('')
  const [status, setStatus]       = useState(null) // null | 'loading' | 'ok' | 'error'
  const [message, setMessage]     = useState('')

  async function handleScrape(e) {
    e.preventDefault()
    if (!location.trim()) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/trigger-scrape', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ niche_slug: nicheSlug, location: location.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        setStatus('ok')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.error + (data.detail ? ` — ${data.detail}` : ''))
      }
    } catch (err) {
      setStatus('error')
      setMessage(`Network error: ${err.message}`)
    }
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
            <label className="admin-label" htmlFor="location-input">Location</label>
            <input
              id="location-input"
              className="admin-input"
              type="text"
              placeholder="e.g. Boksburg Johannesburg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <span className="admin-hint">Be specific — this goes straight to SerpAPI as the location query.</span>
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
