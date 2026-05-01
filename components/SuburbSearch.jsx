'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { slugify } from '../lib/utils'

export default function SuburbSearch({ suburbs, nicheSlug }) {
  const [activeLetter, setActiveLetter] = useState('ALL')
  const [query, setQuery] = useState('')

  // Top 6 suburbs by listing count
  const featured = useMemo(() =>
    [...suburbs].sort((a, b) => b.count - a.count).slice(0, 6),
  [suburbs])

  // Letters that have at least one suburb
  const availableLetters = useMemo(() => {
    const set = new Set(suburbs.map(s => s.name[0].toUpperCase()))
    return set
  }, [suburbs])

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Filtered list based on letter or search
  const filtered = useMemo(() => {
    if (query.trim()) {
      return suburbs.filter(s =>
        s.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    }
    if (activeLetter === 'ALL') return suburbs
    return suburbs.filter(s => s.name[0].toUpperCase() === activeLetter)
  }, [suburbs, activeLetter, query])

  // Group filtered suburbs by first letter
  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(s => {
      const letter = s.name[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(s)
    })
    return groups
  }, [filtered])

  const isSearching = query.trim().length > 0

  return (
    <div className="suburb-browser">

      {/* ── FEATURED AREAS ───────────────────────────────── */}
      {!isSearching && activeLetter === 'ALL' && (
        <div className="suburb-featured-wrap">
          <p className="suburb-featured-label">Most Listings</p>
          <div className="suburb-featured-grid">
            {featured.map(({ name, count }) => (
              <Link
                key={name}
                href={`/${nicheSlug}/${slugify(name)}`}
                className="suburb-featured-card"
              >
                <span className="suburb-featured-count">{count}</span>
                <span className="suburb-featured-name">{name}</span>
                <span className="suburb-featured-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── SEARCH + A-Z CONTROLS ────────────────────────── */}
      <div className="suburb-controls">
        {/* Search */}
        <div className="suburb-search-wrap">
          <span className="suburb-search-icon">⌕</span>
          <input
            className="suburb-search-input"
            type="text"
            placeholder="Search areas…"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveLetter('ALL') }}
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button className="suburb-search-clear" onClick={() => setQuery('')} aria-label="Clear">✕</button>
          )}
        </div>

        {/* A-Z pills */}
        {!isSearching && (
          <div className="suburb-az-bar">
            <button
              className={`suburb-az-pill${activeLetter === 'ALL' ? ' active' : ''}`}
              onClick={() => setActiveLetter('ALL')}
            >All</button>
            {alphabet.map(l => (
              <button
                key={l}
                className={`suburb-az-pill${activeLetter === l ? ' active' : ''}${!availableLetters.has(l) ? ' disabled' : ''}`}
                onClick={() => availableLetters.has(l) && setActiveLetter(l)}
                disabled={!availableLetters.has(l)}
              >{l}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── RESULTS META ─────────────────────────────────── */}
      {isSearching && (
        <p className="suburb-search-meta">
          {filtered.length === 0
            ? 'No areas found'
            : `${filtered.length} area${filtered.length !== 1 ? 's' : ''} matching "${query.trim()}"`}
        </p>
      )}

      {/* ── SUBURB GRID ──────────────────────────────────── */}
      {filtered.length > 0 ? (
        isSearching || activeLetter !== 'ALL' ? (
          // Flat grid when searching or letter-filtered
          <div className="suburb-grid-v2">
            {filtered.map(({ name, count }) => (
              <Link key={name} href={`/${nicheSlug}/${slugify(name)}`} className="suburb-card">
                <div className="suburb-card-inner">
                  <span className="suburb-card-name">{name}</span>
                  <span className="suburb-card-count">{count} listing{count !== 1 ? 's' : ''}</span>
                </div>
                <span className="suburb-card-arrow">→</span>
              </Link>
            ))}
          </div>
        ) : (
          // Grouped by letter when showing ALL
          <div className="suburb-grouped">
            {Object.keys(grouped).sort().map(letter => (
              <div key={letter} className="suburb-letter-group">
                <div className="suburb-letter-heading">{letter}</div>
                <div className="suburb-grid-v2">
                  {grouped[letter].map(({ name, count }) => (
                    <Link key={name} href={`/${nicheSlug}/${slugify(name)}`} className="suburb-card">
                      <div className="suburb-card-inner">
                        <span className="suburb-card-name">{name}</span>
                        <span className="suburb-card-count">{count} listing{count !== 1 ? 's' : ''}</span>
                      </div>
                      <span className="suburb-card-arrow">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="suburb-search-empty">
          <p>No areas match <strong>"{query}"</strong></p>
          <button className="suburb-search-reset" onClick={() => setQuery('')}>Show all areas</button>
        </div>
      )}

    </div>
  )
}
