const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i

function json(data, init = {}) {
  const headers = { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) }
  return new Response(JSON.stringify(data), { ...init, headers })
}

// Turn an R2 object key into display metadata.
//   "Travel/golden-hour.jpg" -> { category: "Travel", caption: "Golden hour" }
//   "sunset_beach.webp"      -> { category: "",       caption: "Sunset beach" }
function describe(key) {
  const slash = key.lastIndexOf('/')
  const folder = slash >= 0 ? key.slice(0, slash) : ''
  const file = slash >= 0 ? key.slice(slash + 1) : key
  const category = folder ? folder.split('/')[0] : ''
  const base = file.replace(/\.[^.]+$/, '') // strip extension
  let caption = base.replace(/[-_]+/g, ' ').trim() // dashes/underscores -> spaces
  caption = caption.charAt(0).toUpperCase() + caption.slice(1)
  return { category, caption }
}

// GET /api/photos — public list of gallery photos, newest first.
// Reads straight from the R2 bucket, so any image dropped into the bucket via
// the Cloudflare dashboard shows up automatically.
//
// Edge-cached for 60s so this can't be hammered to rack up R2 list operations.
// The cache key is fixed to the path (query strings are ignored) so an attacker
// can't bust the cache with ?x=random and force a fresh bucket list every hit.
export async function onRequestGet({ request, env, waitUntil }) {
  if (!env.PHOTOS_BUCKET) return json({ photos: [] })

  const u = new URL(request.url)
  const cache = caches.default
  const cacheKey = new Request(`${u.origin}/api/photos`, { method: 'GET' })
  const hit = await cache.match(cacheKey)
  if (hit) return hit

  const objects = []
  let cursor
  do {
    const listing = await env.PHOTOS_BUCKET.list({ cursor, limit: 1000 })
    objects.push(...listing.objects)
    cursor = listing.truncated ? listing.cursor : undefined
  } while (cursor)

  const photos = objects
    .filter((o) => o.size > 0 && IMAGE_EXT.test(o.key)) // skip folders & non-images
    .sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded)) // newest first
    .map((o) => {
      const { category, caption } = describe(o.key)
      const url = '/api/img/' + o.key.split('/').map(encodeURIComponent).join('/')
      return { id: o.key, url, caption, category }
    })

  const resp = json({ photos }, { headers: { 'cache-control': 'public, max-age=60' } })
  if (waitUntil) waitUntil(cache.put(cacheKey, resp.clone()))
  return resp
}
