'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { NICHES } from '../lib/niches'

// Debounce helper
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function SearchBar({ variant = 'nav' }) {
  const [query,   setQuery]   = useState('')
  const [open,    setOpen]    = useState(false)
  const [apiData, setApiData] = useState({ categories: [], businesses: [] })
  const [loading, setLoading] = useState(false)
  const router  = useRouter()
  const ref     = useRef(null)
  const isHero  = variant === 'hero'

  const debouncedQuery = useDebounce(query, 300)

  // Category matches — always instant, client-side
  const catMatches = query.trim().length >= 1
    ? NICHES.filter(n =>
        n.label.toLowerCase().includes(query.toLowerCase()) ||
        n.searchKeywords?.some(k => k.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, isHero ? 4 : 8)
    : []

  // Hero variant: also call /api/search for businesses
  useEffect(() => {
    if (!isHero || debouncedQuery.trim().length < 2) {
      setApiData({ categories: [], businesses: [] })
      return
    }
    setLoading(true)
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.json())
      .then(data => { setApiData(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [debouncedQuery, isHero])

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function go(path) {
    router.push(path)
    setQuery('')
    setOpen(false)
  }

  function handleKey(e) {
    if (e.key === 'Escape') { setQuery(''); setOpen(false) }
    if (e.key === 'Enter' && catMatches.length > 0) go(`/${catMatches[0].slug}`)
  }

  const hasResults = catMatches.length > 0 ||
    apiData.businesses.length > 0

  return (
    <div
      ref={ref}
      className={isHero ? 'hs-wrap hs-wrap--hero' : 'hs-wrap hs-wrap--nav'}
    >
      <div className="hs-field">
        {/* Search icon */}
        <svg className="hs-ico" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>

        <input
          className="hs-inp"
          type="text"
          placeholder={isHero
            ? 'Search businesses, categories, areas…'
            : 'Search categories…'}
          value={query}
          autoComplete="off"
          spellCheck="false"
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
        />

        {query
          ? <button className="hs-x" onClick={() => { setQuery(''); setOpen(false) }} aria-label="Clear">✕</button>
          : null
        }

        {isHero && (
          <button className="hs-btn" onClick={() => catMatches[0] && go(`/${catMatches[0].slug}`)}>
            Search
          </button>
        )}
      </div>

      {open && hasResults && (
        <div className="hs-drop" role="listbox">
          {/* Categories */}
          {catMatches.length > 0 && (
            <>
              {isHero && <div className="hs-drop-label">Categories</div>}
              {catMatches.map(n => (
                <button key={n.slug} className="hs-row" role="option" onClick={() => go(`/${n.slug}`)}>
                  <span className="hs-row-name">{n.label}</span>
                  <span className="hs-row-arr">→</span>
                </button>
              ))}
            </>
          )}

          {/* Businesses (hero only, from API) */}
          {isHero && apiData.businesses.length > 0 && (
            <>
              <div className="hs-drop-label">Businesses</div>
              {apiData.businesses.map((b, i) => (
                <button
                  key={i}
                  className="hs-row"
                  role="option"
                  onClick={() => go(`/${b.nicheSlug}`)}
                >
                  <div className="hs-row-info">
                    <span className="hs-row-name">{b.business_name}</span>
                    <span className="hs-row-sub">{b.suburb} · {b.nicheLabel}</span>
                  </div>
                  <span className="hs-row-arr">→</span>
                </button>
              ))}
            </>
          )}

          {loading && <div className="hs-drop-loading">Searching…</div>}
        </div>
      )}
    </div>
  )
}
