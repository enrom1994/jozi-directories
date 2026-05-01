import Link from 'next/link'

export default function Header({ breadcrumbs = [] }) {
  return (
    <header className="site-header">
      <div className="container site-header-inner">

        {/* Logo */}
        <Link href="/" className="site-logo">
          <span className="site-logo-badge">JHB</span>
          <div>
            <span className="site-logo-name">Jozi Directories</span>
            <span className="site-logo-tagline">Johannesburg Business Register</span>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" className="btn-ghost" style={{ padding: '6px 12px', fontSize: 11 }}>
            All Categories
          </Link>
        </nav>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="breadcrumb-bar">
          <div className="container breadcrumb-inner">
            <Link href="/" className="breadcrumb-link">Home</Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="breadcrumb-sep">›</span>
                {crumb.href
                  ? <Link href={crumb.href} className="breadcrumb-link">{crumb.label}</Link>
                  : <span className="breadcrumb-current">{crumb.label}</span>
                }
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
