'use client'
import { useState, useEffect } from 'react'

const LS_KEY       = 'jozi_suburb'
const LS_DISMISSED = 'jozi_banner_dismissed'

export default function LocationBanner({ suburbs = [] }) {
  const [visible, setVisible] = useState(false)
  const [mode, setMode]       = useState(null) // null | 'manual'
  const [input, setInput]     = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    const dismissed = localStorage.getItem(LS_DISMISSED)
    const saved     = localStorage.getItem(LS_KEY)
    if (!dismissed && !saved) setVisible(true)
  }, [])

  function dismiss() {
    localStorage.setItem(LS_DISMISSED, '1')
    setVisible(false)
  }

  function tryGeolocation() {
    if (!navigator.geolocation) { setMode('manual'); return }
    navigator.geolocation.getCurrentPosition(
      () => setMode('manual'), // no reverse geocoding yet — fall to manual
      () => setMode('manual')
    )
  }

  function handleInput(e) {
    const val = e.target.value
    setInput(val)
    setSuggestions(
      val.length >= 2
        ? suburbs.filter(s => s.toLowerCase().startsWith(val.toLowerCase())).slice(0, 6)
        : []
    )
  }

  function selectSuburb(suburb) {
    localStorage.setItem(LS_KEY, suburb)
    localStorage.setItem(LS_DISMISSED, '1')
    setVisible(false)
    window.location.reload()
  }

  if (!visible) return null

  return (
    <div className="loc-banner" role="alert" aria-live="polite">
      <div className="loc-banner-icon" aria-hidden="true" />

      {mode === 'manual' ? (
        <div className="loc-banner-manual">
          <input
            className="loc-banner-input"
            type="text"
            placeholder="Type your suburb…"
            value={input}
            onChange={handleInput}
            autoFocus
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <div className="loc-banner-suggestions">
              {suggestions.map(s => (
                <button key={s} className="loc-banner-suggestion" onClick={() => selectSuburb(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <p className="loc-banner-text">
            <strong>Show businesses near you?</strong> Share your suburb to see top-rated listings nearby.
          </p>
          <button className="loc-banner-btn" onClick={tryGeolocation}>Use my location</button>
          <button className="loc-banner-btn loc-banner-btn--ghost" onClick={() => setMode('manual')}>
            Enter suburb
          </button>
        </>
      )}

      <button className="loc-banner-dismiss" onClick={dismiss} aria-label="Dismiss">×</button>
    </div>
  )
}
