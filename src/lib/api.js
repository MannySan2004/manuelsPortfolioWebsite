// ─────────────────────────────────────────────────────────────────────────────
// Talks to the Cloudflare Pages Functions backend (functions/api/*).
// The gallery is read-only: photos are added by dropping images into the R2
// bucket via the Cloudflare dashboard. GET /api/photos lists the bucket.
// ─────────────────────────────────────────────────────────────────────────────

// Sample photos used only when the bucket is still empty, so the page is never
// blank. They disappear automatically once you upload your first real photo.
export const SAMPLE_PHOTOS = [
  { id: 's1', url: 'https://picsum.photos/seed/tokyo/800/1100', caption: 'Tokyo', category: 'Travel' },
  { id: 's2', url: 'https://picsum.photos/seed/deer/800/600', caption: 'Nara deer', category: 'Wildlife' },
  { id: 's3', url: 'https://picsum.photos/seed/skytree/800/1000', caption: 'Skytree', category: 'City' },
  { id: 's4', url: 'https://picsum.photos/seed/hotel/800/600', caption: 'Architecture', category: 'City' },
  { id: 's5', url: 'https://picsum.photos/seed/bellevue/800/900', caption: 'Bellevue', category: 'City' },
  { id: 's6', url: 'https://picsum.photos/seed/sunset/800/700', caption: 'Golden hour', category: 'Nature' },
  { id: 's7', url: 'https://picsum.photos/seed/street/800/1050', caption: 'Street', category: 'Street' },
  { id: 's8', url: 'https://picsum.photos/seed/mountain/800/650', caption: 'Mountains', category: 'Nature' },
]

/** Fetch the public gallery. Returns { photos, isSample }. */
export async function fetchPhotos() {
  try {
    const res = await fetch('/api/photos', { headers: { accept: 'application/json' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const photos = Array.isArray(data) ? data : data.photos || []
    if (!photos.length) return { photos: SAMPLE_PHOTOS, isSample: true }
    return { photos, isSample: false }
  } catch {
    // Backend unreachable — show samples so the page is never empty.
    return { photos: SAMPLE_PHOTOS, isSample: true }
  }
}
