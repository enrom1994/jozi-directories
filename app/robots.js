// app/robots.js
// Serves /robots.txt — tells Google to crawl everything and where the sitemap is.

import { BASE_URL } from '../lib/config'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
