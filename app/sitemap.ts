import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.shouldermonkey.co',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.shouldermonkey.co/salon',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.shouldermonkey.co/gym',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.shouldermonkey.co/clinic',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.shouldermonkey.co/allied-health',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.shouldermonkey.co/mortgage-broker',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://www.shouldermonkey.co/print',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.shouldermonkey.co/privacy',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://www.shouldermonkey.co/terms',
      lastModified: new Date('2026-04-01'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
