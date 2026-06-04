import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Seed data: cities to show on cohort map before real data arrives
const SEED_CITIES = [
  { name: 'Sydney', count: 28 },
  { name: 'Melbourne', count: 19 },
  { name: 'Brisbane', count: 12 },
  { name: 'Perth', count: 8 },
  { name: 'Adelaide', count: 5 },
  { name: 'Canberra', count: 4 },
]

export async function GET() {
  try {
    const total = await redis.get<number>('ai-waitlist-total')
    const baseTotal = (total ?? 0) + SEED_CITIES.reduce((s, c) => s + c.count, 0)

    return NextResponse.json(
      {
        total: baseTotal,
        cities: SEED_CITIES,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        },
      }
    )
  } catch {
    return NextResponse.json({ total: 76, cities: SEED_CITIES })
  }
}
