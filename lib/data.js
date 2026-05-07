// lib/data.js
// Helpers to load and query scraped business data from /data/*.json

import fs from 'fs'
import path from 'path'
import { NICHES } from './niches'

const DATA_DIR = path.join(process.cwd(), 'data')

// Validates a suburb string from raw scraper data.
// Filters out HTML entities (&nbsp;), postal codes, street addresses,
// and strings that are too short to be a real suburb name.
function isValidSuburb(str) {
  if (!str) return false
  // Decode common HTML entities that leak from scrapers
  const decoded = str.replace(/&[a-z]+;?/gi, '').trim()
  if (!decoded) return false
  // Too short to be a suburb name
  if (decoded.length < 3) return false
  // Pure numeric string — postal code or partial data
  if (/^\d+$/.test(decoded)) return false
  // Starts with a digit — almost always a street address ("10 Rio Road")
  if (/^\d/.test(decoded)) return false
  // Contains common address-type words
  if (/\b(ave|avenue|road|rd|str|street|drive|dr|crescent|cres|blvd|lane|ln|close|cl)\b/i.test(decoded)) return false
  return true
}

export function loadNicheData(dataFile) {
  const filePath = path.join(DATA_DIR, dataFile)
  if (!fs.existsSync(filePath)) return []
  const raw = fs.readFileSync(filePath, 'utf-8')
  const cleaned = raw.replace(/^\uFEFF/, '').trim()
  if (!cleaned) return []
  try {
    return JSON.parse(cleaned)
  } catch {
    return []
  }
}

// Get all unique suburbs for a niche
export function getSuburbsForNiche(niche) {
  const data = loadNicheData(niche.dataFile)
  const suburbs = [...new Set(
    data
      .map(b => b.suburb?.trim())
      .filter(isValidSuburb)
  )].sort()
  return suburbs
}

// Get suburbs with listing counts, sorted alphabetically
export function getSuburbsWithCounts(niche) {
  const data = loadNicheData(niche.dataFile)
  const counts = {}
  data.forEach(b => {
    const s = b.suburb?.trim()
    if (isValidSuburb(s)) counts[s] = (counts[s] || 0) + 1
  })
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

// Get listings for a niche + suburb combo
export function getListings(niche, suburb) {
  const data = loadNicheData(niche.dataFile)
  return data
    .filter(b => {
      if (!suburb) return true
      return slugify(b.suburb) === slugify(suburb)
    })
    .sort((a, b) => {
      // Normalise: empty string / "N/A" / null → 0 so unrated listings sink to the bottom
      const rA = parseFloat(a.rating) || 0
      const rB = parseFloat(b.rating) || 0
      if (rB !== rA) return rB - rA
      // Secondary: most reviews first
      const revA = parseInt(a.review_count) || 0
      const revB = parseInt(b.review_count) || 0
      return revB - revA
    })
}

// Get a single business by its slugified name
export function getBusinessBySlug(niche, suburb, businessSlug) {
  const listings = getListings(niche, suburb)
  return listings.find(b => slugify(b.business_name) === businessSlug) || null
}

// Get stats for a niche
export function getNicheStats(niche) {
  const data = loadNicheData(niche.dataFile)
  const withWebsite = data.filter(b => b.has_website === 'TRUE').length
  const suburbs = [...new Set(data.map(b => b.suburb?.trim()).filter(Boolean))]
  // Only include entries that have a real numeric rating in the average
  const rated = data.filter(b => parseFloat(b.rating) > 0)
  const avgRating = rated.length
    ? (rated.reduce((s, b) => s + parseFloat(b.rating), 0) / rated.length).toFixed(1)
    : 0
  return {
    total: data.length,
    withWebsite,
    withoutWebsite: data.length - withWebsite,
    suburbs: suburbs.length,
    avgRating,
  }
}

export function slugify(str = '') {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function deslugify(slug = '') {
  return slug
    .split('-')
    .map(w => w.length <= 2 || w === w.toUpperCase() ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function starRating(rating) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}
