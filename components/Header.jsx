'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'

const LS_KEY = 'jozi_suburb'

export default function Header({ breadcrumbs }) {
  const [suburb, setSuburb] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) setSuburb(saved)
  }, [])

  function clearSuburb() {
    localStorage.removeItem(LS_KEY)
    localStorage.removeItem('jozi_banner_dismissed')
    setSuburb(null)
    window.location.reload()
  }

  return (
    <header className="site-header">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="site-logo" aria-label="Jozi Directories home">
          <span className="site-logo-badge">JHB</span>
          <span className="site-logo-name">Jozi Directories</span>
        </Link>

        {/* Nav search — category search only */}
        <div className="nav-search">
          <SearchBar variant="nav" />
        </div>

        {/* Right: location pill + CTA */}
        <div className="nav-right">
          <button
            className="nav-loc-pill"
            onClick={suburb ? clearSuburb : undefined}
            title={suburb ? 'Click to reset location' : 'Set your suburb'}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 14s-5-4.686-5-8a5 5 0 0 1 10 0c0 3.314-5 8-5 8Z"/>
              <circle cx="8" cy="6" r="1.5"/>
            </svg>
            {suburb || 'Johannesburg'}
          </button>

          <Link href="/add-business" className="nav-cta">
            + Add Business
          </Link>
        </div>
      </div>

      {/* Breadcrumbs — only rendered when prop is passed */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="breadcrumb-bar">
          <div className="container">
            <nav aria-label="Breadcrumb">
              <ol className="breadcrumb">
                <li className="bc-item">
                  <Link href="/" className="bc-link">Home</Link>
                </li>
                {breadcrumbs.map((crumb, i) => (
                  <li key={i} className="bc-item">
                    <span className="bc-sep" aria-hidden="true">›</span>
                    {crumb.href
                      ? <Link href={crumb.href} className="bc-link">{crumb.label}</Link>
                      : <span className="bc-current" aria-current="page">{crumb.label}</span>
                    }
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
