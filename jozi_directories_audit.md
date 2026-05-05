# Jozi Directories — Full Project Audit

> Read-only audit. No files were modified.

---

## Framework

**Next.js 14.2.3** (App Router) with React 18.
- Dev/build commands: `next dev` / `next build` / `next start`
- Styling: **Tailwind CSS v3** + a large `globals.css` (54 KB of custom CSS variables and utility classes)
- Images: `unoptimized: true` in `next.config.js` (no Image Optimization API used)
- No database, no auth layer, no ORM — pure file-based

---

## URL Structure / Route Tree

```
app/
├── layout.jsx                        # Root layout (fonts, metadata shell)
├── page.jsx                          # Homepage  →  /
├── globals.css                       # Global styles (54 KB)
├── robots.js                         # /robots.txt
├── sitemap.js                        # /sitemap.xml  (auto-generated)
│
├── [niche]/
│   ├── page.jsx                      # Niche category page  →  /barbers
│   └── [suburb]/
│       └── page.jsx                  # Suburb listing page  →  /barbers/sandton
│
├── admin/
│   ├── page.jsx                      # Admin panel shell (SSR wrapper)
│   └── AdminClient.jsx               # Client component — scrape trigger UI
│
└── api/
    ├── search/route.js               # GET /api/search  (live search)
    └── trigger-scrape/route.js       # POST /api/trigger-scrape  (fires n8n webhook)
```

---

## Page Generation

### Static vs Dynamic

The site uses **Next.js Static Site Generation (SSG)** via `generateStaticParams()`.

| Route | How it generates |
|---|---|
| `/` | Single static page, always rendered |
| `/[niche]` | `generateStaticParams()` iterates every entry in `NICHES` array → one page per niche slug |
| `/[niche]/[suburb]` | `generateStaticParams()` cross-products every niche × every unique suburb value found in that niche's JSON data file → one page per combo |
| `/sitemap.xml` | `app/sitemap.js` — Next.js native sitemap, same logic as above |

**At build time**, Next.js pre-renders all niche + suburb combinations. If a niche has no data yet (3-byte empty JSON files), it produces no suburb pages. If you push new data to a JSON file, you need a **Vercel redeploy** to rebuild those pages.

### `generateStaticParams` flow for suburb pages

```
lib/niches.js  →  NICHES[]
      ↓
lib/data.js  →  getSuburbsForNiche(niche)
      ↓  reads niche.dataFile from /data/*.json
      ↓  extracts unique b.suburb values
      ↓  returns sorted string[]
      ↓
slugify(suburb)  →  suburb slug
      ↓
params: { niche: niche.slug, suburb: slugifiedSuburb }
```

---

## Where Suburb/Area Data Comes From

### Two separate concepts — don't confuse them:

#### 1. `lib/locations.js` — Admin scrape targets
- **39 hardcoded Johannesburg areas** grouped by compass direction (North, East, West, South, Central)
- Used **only** in the Admin panel dropdown to let you pick where to trigger a scrape
- Each entry has a `label` (display name) and `value` (exact Google Maps search string like `"Sandton Johannesburg Gauteng South Africa"`)
- These are passed to the n8n webhook → SerpAPI → scraped results
- **These do NOT drive the public-facing suburb pages**

#### 2. `data/*.json` files — Live suburb data (source of truth for pages)
- One JSON file per niche category (e.g. `barbers.json`, `nail-bars.json`)
- Each file contains an array of business objects scraped from Google Maps via n8n + SerpAPI
- Each business object includes a `suburb` field (raw string from the scraper, e.g. `"Sandton"`)
- The public suburb pages are generated **from whatever unique `suburb` values exist in these JSON files**
- Files with only `[]` (3 bytes) have no data yet — those niches show "No Listings Yet"

**Pipeline:**
```
Admin panel trigger
      ↓
POST /api/trigger-scrape
      ↓
n8n webhook (N8N_WEBHOOK_URL)
      ↓
SerpAPI scrapes Google Maps
      ↓
n8n commits results to GitHub  →  data/*.json
      ↓
Vercel detects push  →  rebuilds site
      ↓
generateStaticParams re-reads JSON  →  new suburb pages go live
```

**Currently populated niches** (non-empty data files):
- `auto-electricians.json` — 102 KB
- `barbers.json` — 128 KB
- `debt-review-consultants.json` — 44 KB
- `dog-groomers.json` — 100 KB
- `driving-schools.json` — 48 KB
- `nail-bars.json` — 122 KB
- `phone-repair-shops.json` — 57 KB
- `solar-inverter-installers.json` — 92 KB

All remaining 30 niches have empty JSON (`[]`).

---

## How Suburb Slugs Are Created

Defined in **two places** (they're identical functions — a known duplication):

| File | Function |
|---|---|
| `lib/data.js` | `slugify(str)` — used server-side in data loading |
| `lib/utils.js` | `slugify(str)` — safe for client components |

**The algorithm:**
```js
str
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')   // non-alphanumeric → hyphen
  .replace(/(^-|-$)/g, '')        // strip leading/trailing hyphens
```

**Examples:**
- `"Sandton"` → `sandton`
- `"Kempton Park"` → `kempton-park`
- `"Orange Farm"` → `orange-farm`
- `"Johannesburg CBD"` → `johannesburg-cbd`

The inverse (`deslugify`) does a simple title-case split on `-`. This means the displayed suburb name on the page is reconstructed from the URL slug, **not** stored separately — so `kempton-park` becomes `Kempton Park` in the UI.

**Slug matching** in `getListings()`:
```js
slugify(b.suburb) === slugify(suburb)
```
Both sides are slugified so casing/spacing differences in raw data don't break matching.

---

## Complete File Index (All Relevant Files)

### Routing & Pages
| File | Purpose |
|---|---|
| [`app/layout.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/layout.jsx) | Root HTML shell, font loading |
| [`app/page.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/page.jsx) | Homepage (8.2 KB) |
| [`app/[niche]/page.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/[niche]/page.jsx) | Category index page — lists suburbs with counts |
| [`app/[niche]/[suburb]/page.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/[niche]/[suburb]/page.jsx) | Suburb listing page — renders all businesses + sidebar |
| [`app/admin/page.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/admin/page.jsx) | Admin panel (SSR shell) |
| [`app/admin/AdminClient.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/admin/AdminClient.jsx) | Admin panel UI (client component, 11.6 KB) |
| [`app/sitemap.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/sitemap.js) | Auto XML sitemap |
| [`app/robots.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/robots.js) | robots.txt |

### API Routes
| File | Purpose |
|---|---|
| [`app/api/trigger-scrape/route.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/api/trigger-scrape/route.js) | POST → fires n8n webhook to scrape a niche+location |
| [`app/api/search/route.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/app/api/search/route.js) | GET → live search across all niche data |

### Library / Config
| File | Purpose |
|---|---|
| [`lib/niches.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/lib/niches.js) | Master niche registry — 37 niches, slugs, labels, icons, keywords, dataFile refs |
| [`lib/locations.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/lib/locations.js) | 39 Jozi areas for admin scrape dropdown (not used in page generation) |
| [`lib/data.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/lib/data.js) | loadNicheData, getSuburbsForNiche, getListings, getNicheStats, slugify, deslugify, starRating |
| [`lib/utils.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/lib/utils.js) | Client-safe slugify, deslugify, starRating (duplicate of data.js utilities) |
| [`lib/config.js`](file:///c:/Users/enrom/Dev/projects/jozi-directories/lib/config.js) | BASE_URL constant |

### Data Files (source of truth)
| File | Status |
|---|---|
| `data/barbers.json` | ✅ 128 KB populated |
| `data/nail-bars.json` | ✅ 122 KB populated |
| `data/auto-electricians.json` | ✅ 102 KB populated |
| `data/dog-groomers.json` | ✅ 100 KB populated |
| `data/solar-inverter-installers.json` | ✅ 92 KB populated |
| `data/phone-repair-shops.json` | ✅ 57 KB populated |
| `data/driving-schools.json` | ✅ 48 KB populated |
| `data/debt-review-consultants.json` | ✅ 44 KB populated |
| 30 other niche JSON files | ⬜ Empty (`[]`) |
| `data/featured.json` | ⬜ Empty — referenced in homepage |

### Components
| File | Purpose |
|---|---|
| [`components/Header.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/Header.jsx) | Site header with breadcrumbs |
| [`components/Footer.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/Footer.jsx) | Site footer |
| [`components/ListingCard.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/ListingCard.jsx) | Individual business card |
| [`components/SuburbSearch.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/SuburbSearch.jsx) | Client-side suburb filter/search grid (6.2 KB) |
| [`components/SuburbSidebarLinks.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/SuburbSidebarLinks.jsx) | "Other areas nearby" sidebar links |
| [`components/SearchBar.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/SearchBar.jsx) | Homepage search bar (5 KB) |
| [`components/FeaturedCarousel.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/FeaturedCarousel.jsx) | Featured listings carousel |
| [`components/TopRatedSection.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/TopRatedSection.jsx) | Top-rated businesses section |
| [`components/LocationBanner.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/LocationBanner.jsx) | Location context banner |
| [`components/HeroCardStack.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/HeroCardStack.jsx) | Homepage hero card stack |
| [`components/CategoryPillStrip.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/CategoryPillStrip.jsx) | Category pill navigation |
| [`components/Icons.jsx`](file:///c:/Users/enrom/Dev/projects/jozi-directories/components/Icons.jsx) | SVG icon components |

### Config / Root
| File | Purpose |
|---|---|
| `package.json` | Next 14.2.3, React 18, Tailwind 3 |
| `next.config.js` | `images.unoptimized: true` only |
| `tailwind.config.js` | Tailwind config |
| `jsconfig.json` | Path aliases |
| `.env.local` | ADMIN_ENABLED, N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET, BASE_URL |
| `Directory_Scraper_V1.8.json` | n8n workflow export (20 KB) |

---

## Key Observations

1. **Suburb pages are data-driven, not config-driven.** You don't predefine which suburbs exist — they emerge automatically from whatever `suburb` field values end up in the scraped JSON files. Add data, redeploy, and pages appear.

2. **`lib/locations.js` and page generation are decoupled.** The 39 areas in locations.js are just a convenience dropdown for triggering scrapes. The actual suburb URL slugs come from whatever the SerpAPI scraper returns in the `suburb` field.

3. **`slugify` is duplicated** between `lib/data.js` and `lib/utils.js`. Both are in use — data.js is server-only, utils.js is client-safe.

4. **No ISR, no on-demand revalidation.** Every data change requires a full Vercel rebuild (triggered automatically by GitHub push from n8n).

5. **38 niches defined in `NICHES`**, but only **8 have real data** right now. The other 30 show empty state pages.
