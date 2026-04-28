import * as fs from 'fs'
import * as https from 'https'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!

// ── Config ────────────────────────────────────────────────────────────────────

const CITIES = [
  'Sydney, Australia',
  'Melbourne, Australia',
  'Brisbane, Australia',
  'Perth, Australia',
  'Adelaide, Australia',
]

const VERTICALS: Record<string, string[]> = {
  salons:             ['hair salon', 'beauty salon', 'nail salon', 'barber'],
  gyms:               ['gym', 'fitness centre', 'personal trainer', 'crossfit'],
  clinics:            ['medical clinic', 'dental clinic', 'physiotherapy', 'chiropractic', 'osteopath'],
  mortgage_brokers:   ['mortgage broker', 'home loan broker'],
  allied_health:      ['occupational therapist', 'speech therapist', 'psychologist', 'dietitian'],
}

// Website quality signals
const BAD_PLATFORMS = [
  'wixsite.com', 'wix.com',
  'weebly.com',
  'godaddysites.com',
  'yolasite.com',
  'jimdo.com',
  'site123.me',
  'mystrikingly.com',
]

const POOR_INDICATORS = [
  'squarespace.com', // Not always bad but worth flagging
  'wordpress.com',   // Free wordpress.com (not self-hosted)
  'blogspot.com',
]

// ── Types ─────────────────────────────────────────────────────────────────────

interface Place {
  displayName?: { text: string }
  formattedAddress?: string
  nationalPhoneNumber?: string
  internationalPhoneNumber?: string
  websiteUri?: string
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
}

interface Lead {
  business_name: string
  phone: string
  address: string
  website: string
  website_status: 'no_website' | 'poor' | 'mediocre' | 'good'
  website_notes: string
  email: string
  rating: string
  review_count: string
  google_maps_url: string
  vertical: string
  city: string
  tags: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function fetchJson(url: string, options: { method?: string; headers?: Record<string, string>; body?: string } = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    }
    const req = https.request(reqOptions, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { resolve({}) }
      })
    })
    req.on('error', reject)
    if (options.body) req.write(options.body)
    req.end()
  })
}

function fetchHtml(url: string): Promise<{ html: string; finalUrl: string; statusCode: number }> {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url)
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search || '/',
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; businesschecker/1.0)',
          'Accept': 'text/html',
        },
        timeout: 8000,
      }
      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', chunk => { if (data.length < 50000) data += chunk })
        res.on('end', () => resolve({ html: data, finalUrl: url, statusCode: res.statusCode || 0 }))
      })
      req.on('error', () => resolve({ html: '', finalUrl: url, statusCode: 0 }))
      req.on('timeout', () => { req.destroy(); resolve({ html: '', finalUrl: url, statusCode: 0 }) })
      req.end()
    } catch {
      resolve({ html: '', finalUrl: url, statusCode: 0 })
    }
  })
}

async function checkWebsite(url: string): Promise<{ status: Lead['website_status']; notes: string; email: string }> {
  if (!url) return { status: 'no_website', notes: 'No website listed', email: '' }

  // Check for obviously bad platforms by URL alone
  const lowerUrl = url.toLowerCase()
  for (const platform of BAD_PLATFORMS) {
    if (lowerUrl.includes(platform)) {
      return { status: 'poor', notes: `Hosted on ${platform}`, email: '' }
    }
  }

  // Check if HTTP (no SSL)
  if (url.startsWith('http://')) {
    return { status: 'poor', notes: 'No SSL (http only)', email: '' }
  }

  // Fetch the website
  const { html, statusCode } = await fetchHtml(url)

  if (statusCode === 0 || statusCode >= 400) {
    return { status: 'poor', notes: `Site unreachable (${statusCode || 'timeout'})`, email: '' }
  }

  // Extract email
  const emailMatch = html.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g)
  const email = emailMatch
    ? emailMatch.find(e => !e.includes('example') && !e.includes('sentry') && !e.includes('wix')) || ''
    : ''

  // Check for poor indicators
  for (const indicator of POOR_INDICATORS) {
    if (lowerUrl.includes(indicator)) {
      return { status: 'poor', notes: `Free platform (${indicator})`, email }
    }
  }

  // Check mobile responsiveness (viewport meta tag)
  const hasMobileViewport = /viewport/.test(html)
  if (!hasMobileViewport) {
    return { status: 'mediocre', notes: 'No mobile viewport detected', email }
  }

  // Check for very thin sites (under 5KB of HTML — likely near-empty)
  if (html.length < 5000) {
    return { status: 'mediocre', notes: 'Very thin site (minimal content)', email }
  }

  return { status: 'good', notes: 'Appears functional', email }
}

// ── Google Places API ─────────────────────────────────────────────────────────

async function searchPlaces(query: string, city: string, pageToken?: string): Promise<{ places: Place[]; nextPageToken?: string }> {
  const body: any = {
    textQuery: `${query} in ${city}`,
    maxResultCount: 20,
    languageCode: 'en',
  }
  if (pageToken) body.pageToken = pageToken

  const data = await fetchJson('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,nextPageToken',
    },
    body: JSON.stringify(body),
  })

  return {
    places: data.places || [],
    nextPageToken: data.nextPageToken,
  }
}

// ── CSV ───────────────────────────────────────────────────────────────────────

function toCSV(leads: Lead[]): string {
  const headers = [
    'Business Name', 'Phone', 'Address', 'Website', 'Website Status',
    'Website Notes', 'Email', 'Rating', 'Review Count',
    'Google Maps URL', 'Vertical', 'City', 'Tags'
  ]
  const escape = (v: string) => `"${(v || '').replace(/"/g, '""')}"`
  const rows = leads.map(l => [
    escape(l.business_name),
    escape(l.phone),
    escape(l.address),
    escape(l.website),
    escape(l.website_status),
    escape(l.website_notes),
    escape(l.email),
    escape(l.rating),
    escape(l.review_count),
    escape(l.google_maps_url),
    escape(l.vertical),
    escape(l.city),
    escape(l.tags),
  ].join(','))
  return [headers.join(','), ...rows].join('\n')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (!API_KEY) {
    console.error('Missing GOOGLE_PLACES_API_KEY')
    process.exit(1)
  }

  const outputDir = './scripts/output'
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const allLeads: Record<string, Lead[]> = {}
  for (const vertical of Object.keys(VERTICALS)) allLeads[vertical] = []

  for (const [vertical, queries] of Object.entries(VERTICALS)) {
    console.log(`\n── ${vertical.toUpperCase()} ──`)

    for (const city of CITIES) {
      for (const query of queries) {
        console.log(`  Searching: "${query}" in ${city}`)

        let pageToken: string | undefined
        let page = 0

        do {
          const { places, nextPageToken } = await searchPlaces(query, city, pageToken)
          pageToken = nextPageToken
          page++

          for (const place of places) {
            const name = place.displayName?.text || ''
            const phone = place.nationalPhoneNumber || place.internationalPhoneNumber || ''
            const website = place.websiteUri || ''

            // Skip if already have this business (dedup by name + city)
            const exists = allLeads[vertical].some(
              l => l.business_name === name && l.city === city
            )
            if (exists) continue

            process.stdout.write(`    Checking: ${name}... `)
            const { status, notes, email } = await checkWebsite(website)
            console.log(status)

            // Skip "good" websites — not our target
            if (status === 'good') continue

            const tags = [
              `vertical:${vertical}`,
              `website:${status}`,
              `city:${city.split(',')[0].toLowerCase()}`,
              'source:google-maps-scraper',
            ].join(', ')

            allLeads[vertical].push({
              business_name: name,
              phone,
              address: place.formattedAddress || '',
              website,
              website_status: status,
              website_notes: notes,
              email,
              rating: place.rating?.toString() || '',
              review_count: place.userRatingCount?.toString() || '',
              google_maps_url: place.googleMapsUri || '',
              vertical,
              city: city.split(',')[0],
              tags,
            })

            await sleep(200) // polite rate limiting
          }

          if (pageToken) await sleep(1000)
        } while (pageToken && page < 3) // max 3 pages (60 results) per query
      }
    }

    // Write CSV for this vertical
    const csv = toCSV(allLeads[vertical])
    const filename = `${outputDir}/${vertical}.csv`
    fs.writeFileSync(filename, csv)
    console.log(`  ✓ ${allLeads[vertical].length} leads → ${filename}`)
  }

  console.log('\n── DONE ──')
  for (const [vertical, leads] of Object.entries(allLeads)) {
    const noSite = leads.filter(l => l.website_status === 'no_website').length
    const poor = leads.filter(l => l.website_status === 'poor').length
    const mediocre = leads.filter(l => l.website_status === 'mediocre').length
    console.log(`${vertical}: ${leads.length} total | ${noSite} no website | ${poor} poor | ${mediocre} mediocre`)
  }
}

main().catch(console.error)
