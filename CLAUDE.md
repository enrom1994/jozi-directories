# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jozi Directories is a static Next.js 14 directory website for Johannesburg local businesses. Zero backend — all data is sourced from Google Maps via n8n scrapers and stored as JSON files. Hosted on Cloudflare Pages with automatic deployment from GitHub.

**Stack:** Next.js 14 (static export), Tailwind CSS, JSON data files

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (static export to /out)
npm run build

# Preview production build
npm run start
```

## Architecture

### Route Structure

Three-tier dynamic routing with static generation:

- `/` — Homepage with all niches, search, featured listings
- `/[niche]` — Niche index page with suburb grid and top-rated listings
- `/[niche]/[suburb]` — Suburb-specific listings page

All routes use `generateStaticParams()` for static generation at build time.

### Data Layer

**Central configuration files:**
- `lib/niches.js` — Master list of all business categories (40+ niches)
- `lib/locations.js` — Curated Johannesburg areas for scraping
- `lib/data.js` — Data loading and query utilities
- `lib/config.js` — Site-wide config (BASE_URL, SITE_NAME)

**Data files:** `/data/*.json` — One JSON file per niche, populated by n8n scraper

**Data format per listing:**
```json
{
  "niche": "Auto Electricians",
  "business_name": "...",
  "address": "...",
  "suburb": "...",
  "phone": "...",
  "website": "...",
  "has_website": "TRUE" | "FALSE",
  "rating": 4.8,
  "review_count": 49,
  "google_maps_url": "...",
  "scraped_at": "ISO timestamp",
  "_place_id": "ChIJ..."
}
```

### Key Utilities

**`lib/data.js` functions:**
- `loadNicheData(dataFile)` — Load and parse JSON data file
- `getSuburbsForNiche(niche)` — Get unique suburbs for a niche
- `getSuburbsWithCounts(niche)` — Get suburbs with listing counts
- `getListings(niche, suburb)` — Get listings sorted by rating/reviews
- `getNicheStats(niche)` — Get aggregate stats (total, avg rating, etc.)
- `slugify(str)` / `deslugify(slug)` — URL slug conversion
- `isValidSuburb(str)` — Validate suburb strings from scraper data

**Suburb validation:** Filters out HTML entities, postal codes, street addresses, and strings too short to be real suburb names.

### Component Architecture

**Layout components:**
- `components/Header.jsx` — Site header with navigation
- `components/Footer.jsx` — Site footer

**Feature components:**
- `components/SearchBar.jsx` — Global search bar (hero and inline variants)
- `components/HeroCardStack.jsx` — Featured business cards on homepage
- `components/CategoryPillStrip.jsx` — Category pills
- `components/TopRatedSection.jsx` — Top-rated listings across all niches
- `components/LocationBanner.jsx` — Location highlights
- `components/SuburbSearch.jsx` — Searchable suburb grid for niche pages
- `components/ListingCard.jsx` — Individual business listing card

**UI components (`components/ui/`):**
- Reusable UI primitives (Badge, Button, Pill, SectionHeader, StarRating)

### API Routes

**`/api/search`** — Global search endpoint
- Returns categories (from NICHES) and businesses (from JSON files)
- Categories: matches label or searchKeywords
- Businesses: scans all niche JSON files, stops at 8 matches
- Response: `{ categories: [], businesses: [] }`

**`/api/trigger-scrape`** — Triggers n8n scraper (admin only)
- Accepts: `{ niche_slug, location }` or `{ action, nicheSlug, businessName, label }`
- Used by admin panel to trigger scrapes and manage featured listings

### Admin Panel

**Route:** `/admin` (only accessible when `ADMIN_ENABLED=true`)

**Features:**
- View dataset stats per niche
- Trigger n8n scraper for specific niche + location
- Manage featured listings (add/remove from `data/featured.json`)
- Environment status checks

**Featured listings workflow:**
1. Admin adds business to `data/featured.json` via panel
2. Homepage resolves featured.json → actual business records
3. Falls back to algorithmic top-rated when featured.json is empty

### Data Refresh Workflow

1. Run n8n scraper → writes to Google Sheet Results tab
2. Export Results tab as JSON
3. Drop JSON into `/data/[niche].json`
4. Push to main → Cloudflare auto-deploys

**Adding a new niche:**
1. Add entry to `lib/niches.js` with slug, label, description, icon, dataFile, searchKeywords
2. Drop scraped JSON into `data/[slug].json`
3. Push to main → Cloudflare auto-deploys

### SEO & Schema

**JSON-LD schemas:**
- `BreadcrumbList` — On all pages
- `ItemList` — On niche and suburb pages
- `LocalBusiness` — On individual listing pages

**Metadata:**
- Dynamic titles and descriptions per route
- BASE_URL configured in `lib/config.js`

**Sitemap generation:**
- `app/sitemap.js` — Generates XML sitemap for all static pages
- Includes homepage, niche pages, and suburb pages
- Uses `generateStaticParams()` pattern for suburb URLs

**Robots.txt:**
- `app/robots.js` — Serves /robots.txt
- Blocks `/admin/` and `/api/` from crawling
- Points to sitemap.xml

### Important Patterns

**Static generation:** All routes use `generateStaticParams()` for static export. No dynamic routes at runtime.

**Data loading:** Server components load data at build time using `fs` and `path` modules. No API calls for data.

**Slug handling:** Suburbs are slugified for URLs but stored as original strings in JSON. Use `slugify()` for URL generation and `deslugify()` for display.

**Rating sorting:** Listings are sorted by rating (descending), then by review count (descending). Unrated listings sink to bottom.

**Suburb validation:** Always use `isValidSuburb()` when processing suburb strings from scraper data to filter out invalid entries.

**Metadata generation:** Use `generateMetadata()` for dynamic titles and descriptions per route. Follow the pattern in existing pages.

**Featured listings:** Homepage resolves `featured.json` → actual business records. Falls back to algorithmic top-rated when featured.json is empty.

**Location matching:** `lib/locations.js` values must exactly match the 'location' column in the Scrape Queue Google Sheet format: "{Area} Johannesburg Gauteng South Africa"

### Configuration Files

**`next.config.js`** — Next.js configuration with static export settings and unoptimized images

**`tailwind.config.js`** — Tailwind CSS configuration with custom color palette and font families

**`jsconfig.json`** — Path aliases (`@/*` maps to project root)

**`.env.local`** — Environment variables (not committed)
- `ADMIN_ENABLED=true` — Enable admin panel
- `N8N_WEBHOOK_URL` — n8n webhook URL for scraper triggers

### Design System

**CSS variables** (`app/globals.css`):
- Warm neutral palette: `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--border`, `--border-2`
- Text colors: `--ink`, `--ink-2`, `--ink-3`
- Terracotta accent: `--gold`, `--gold-dim`, `--gold-mid`, `--gold-text`
- Semantic colors: `--green`, `--green-dim`, `--red`, `--red-dim`

**Font families:**
- Display: Anton, Impact
- Label: Barlow Condensed
- Body: Inter

### Deployment

**Build output:** `/out` folder (static export)

**Deployment:** Push to GitHub → Cloudflare Pages auto-deploys

**No backend:** All functionality is client-side or build-time. No server-side runtime.
