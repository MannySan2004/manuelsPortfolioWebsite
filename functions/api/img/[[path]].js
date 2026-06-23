// GET /api/img/<key> — streams an image out of the R2 bucket (public read).
// Keeps the bucket private; everything is served from your own origin.
//
// Edge-cached (immutable, 1y). The cache key is fixed to the path so query-string
// cache-busting can't force a fresh R2 read on every request.
export async function onRequestGet({ request, env, waitUntil }) {
  if (!env.PHOTOS_BUCKET) return new Response('Not found', { status: 404 })

  const u = new URL(request.url)
  const cache = caches.default
  const cacheKey = new Request(`${u.origin}${u.pathname}`, { method: 'GET' })
  const hit = await cache.match(cacheKey)
  if (hit) return hit

  // Rebuild the key from the raw path so filenames with spaces / special
  // characters (common with dashboard uploads) decode correctly.
  const key = decodeURIComponent(u.pathname.replace(/^\/api\/img\//, ''))
  const object = await env.PHOTOS_BUCKET.get(key)
  if (!object) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  const resp = new Response(object.body, { headers })
  if (waitUntil) waitUntil(cache.put(cacheKey, resp.clone()))
  return resp
}
