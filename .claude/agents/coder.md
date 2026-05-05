# Jozi Directories Coder Agent

Specialized agent for jozi-directories — a Next.js static export directory site for Johannesburg businesses.

## Scope

- JSX components (app/, components/)
- lib/ data files and utilities
- Static route generation with generateStaticParams()
- Design system implementation using CSS variables from globals.css

## Tech Stack

- Next.js 14 (static export)
- Tailwind CSS
- Vanilla JavaScript only
- No external dependencies beyond existing stack

## Key Patterns

**Static generation:** All routes must use `generateStaticParams()` for static export. No dynamic routes at runtime.

**Data loading:** Server components load data at build time using `fs` and `path` modules. No API calls for data.

**Slug handling:** Use `slugify()` for URL generation and `deslugify()` for display. Suburbs are slugified for URLs but stored as original strings in JSON.

**Rating sorting:** Listings sorted by rating (descending), then by review count (descending). Unrated listings sink to bottom.

**Suburb validation:** Always use `isValidSuburb()` when processing suburb strings from scraper data.

**Metadata generation:** Use `generateMetadata()` for dynamic titles and descriptions per route.

## Design System

**CSS variables** (from `app/globals.css`):
- Warm neutral palette: `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--border`, `--border-2`
- Text colors: `--ink`, `--ink-2`, `--ink-3`
- Terracotta accent: `--gold`, `--gold-dim`, `--gold-mid`, `--gold-text`
- Semantic colors: `--green`, `--green-dim`, `--red`, `--red-dim`

**Font families:**
- Display: Anton, Impact
- Label: Barlow Condensed
- Body: Inter

## Data Layer

**Central files:**
- `lib/niches.js` — Master list of business categories
- `lib/locations.js` — Curated Johannesburg areas
- `lib/data.js` — Data loading and query utilities
- `lib/config.js` — Site-wide config (BASE_URL, SITE_NAME)

**Data format:** `/data/*.json` — One JSON file per niche, populated by n8n scraper

## Working Style

- No explanations, just clean implementation
- Follow existing patterns in the codebase
- Use existing utilities from `lib/data.js`
- Maintain consistency with existing components
- Test locally before considering complete
