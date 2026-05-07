// app/sitemap.js
// Generates a full XML sitemap for all static pages.
// Next.js 13+ App Router convention — returns an array of URL objects.

import { NICHES } from '../lib/niches'
import { getSuburbsForNiche, getListings, slugify } from '../lib/data'
import { BASE_URL } from '../lib/config'

export default function sitemap() {
  const urls = []

  // Homepage
  urls.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1.0,
  })

  for (const niche of NICHES) {
    // Niche category page
    urls.push({
      url: `${BASE_URL}/${niche.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    // Suburb listing pages
    const suburbs = getSuburbsForNiche(niche)
    for (const suburb of suburbs) {
      const suburbSlug = slugify(suburb)
      urls.push({
        url: `${BASE_URL}/${niche.slug}/${suburbSlug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })

      // Individual business pages
      const listings = getListings(niche, suburbSlug)
      for (const business of listings) {
        if (business.business_name) {
          const businessSlug = slugify(business.business_name)
          if (businessSlug) {
            urls.push({
              url: `${BASE_URL}/${niche.slug}/${suburbSlug}/${businessSlug}`,
              lastModified: new Date(),
              changeFrequency: 'monthly',
              priority: 0.6,
            })
          }
        }
      }
    }
  }

  return urls
}
