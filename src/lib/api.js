// ─────────────────────────────────────────────────────────────────────────────
// Talks to the Cloudflare Pages Functions backend (functions/api/*).
// Until R2 + D1 are wired up, GET /api/photos simply isn't there yet, so the
// gallery falls back to a few sample images so the page still looks complete.
// ─────────────────────────────────────────────────────────────────────────────

// Sample photos used only when the backend API isn't available yet.
// (Replace by uploading your real photos from the /admin page once deployed.)
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
    // Backend not deployed yet — show samples so the page is never empty.
    return { photos: SAMPLE_PHOTOS, isSample: true }
  }
}

/** Upload a resized photo blob (admin only — gated by Cloudflare Access). */
export async function uploadPhoto({ blob, caption, category }) {
  const form = new FormData()
  form.append('file', blob, 'photo.webp')
  form.append('caption', caption || '')
  form.append('category', category || '')
  const res = await fetch('/api/upload', { method: 'POST', body: form })
  if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status})`)
  return res.json()
}

/** Delete a photo by id (admin only — gated by Cloudflare Access). */
export async function deletePhoto(id) {
  const res = await fetch('/api/delete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error(`Delete failed (HTTP ${res.status})`)
  return res.json()
}
