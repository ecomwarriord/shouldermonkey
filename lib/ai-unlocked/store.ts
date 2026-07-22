import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface AiContact {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  age?: string
  ageRange: string
  tags: string[]
  parentGuardianName?: string
  parentGuardianEmail?: string
  parentGuardianPhone?: string
  parentalConsentDate?: string
  childName?: string
  joinedAt: number
  nurtureStep: number
  lastSentAt: number
  unsubscribed?: boolean
}

const CONTACTS_KEY = 'ai-unlocked:contacts'
const contactKey = (email: string) => `ai-unlocked:contact:${email}`

export async function saveContact(contact: AiContact): Promise<void> {
  // Record first, membership marker second: if the second call fails, a retry
  // still passes the contactExists() gate and re-runs the full save. The
  // reverse order can orphan an email in the set with no record behind it.
  await redis.set(contactKey(contact.email), contact)
  await redis.sadd(CONTACTS_KEY, contact.email)
}

export async function getContact(email: string): Promise<AiContact | null> {
  return redis.get<AiContact>(contactKey(email))
}

export async function contactExists(email: string): Promise<boolean> {
  return (await redis.sismember(CONTACTS_KEY, email)) === 1
}

export async function listContactEmails(): Promise<string[]> {
  return redis.smembers(CONTACTS_KEY)
}

export async function updateContact(
  email: string,
  patch: Partial<AiContact>
): Promise<void> {
  const existing = await getContact(email)
  if (!existing) return
  await redis.set(contactKey(email), { ...existing, ...patch })
}

export async function markUnsubscribed(email: string): Promise<void> {
  await updateContact(email, { unsubscribed: true })
}
