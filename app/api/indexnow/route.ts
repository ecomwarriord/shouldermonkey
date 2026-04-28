import { NextResponse } from 'next/server'

const KEY = process.env.INDEXNOW_KEY ?? ''
const HOST = 'www.shouldermonkey.co'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

const URLS = [
  `https://${HOST}`,
  `https://${HOST}/salon`,
  `https://${HOST}/gym`,
  `https://${HOST}/clinic`,
  `https://${HOST}/allied-health`,
  `https://${HOST}/mortgage-broker`,
  `https://${HOST}/print`,
  `https://${HOST}/privacy`,
  `https://${HOST}/terms`,
]

export async function POST() {
  if (!KEY) return NextResponse.json({ error: 'INDEXNOW_KEY not set' }, { status: 500 })

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: URLS }),
  })
  console.log(`[IndexNow] submitted ${URLS.length} URLs — status ${res.status}`)
  return NextResponse.json({ status: res.status })
}
