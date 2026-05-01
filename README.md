# Jozi Directories

Static Next.js directory website. Hosted on Cloudflare Pages. Zero backend.

## Stack
- Next.js 14 (static export)
- Tailwind CSS
- Data: `/data/*.json` (populated by n8n scraper)

## Routes
- `/` — Home, all niches
- `/[niche]` — Niche index, all suburbs
- `/[niche]/[suburb]` — Suburb listings page

## Adding a new niche
1. Add entry to `lib/niches.js`
2. Drop scraped JSON into `data/[slug].json`
3. Push to main → Cloudflare auto-deploys

## Data format (per listing)
```json
{
  "niche": "Driving Schools",
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

## Dev
```bash
npm install
npm run dev
```

## Build & Deploy
```bash
npm run build
# /out folder → push to GitHub → Cloudflare Pages auto-deploys
```

## Refreshing data
Run n8n scraper → it writes to Google Sheet Results tab →
export Results tab as JSON → drop into `/data/[niche].json` → push to main.
