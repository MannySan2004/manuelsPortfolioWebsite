// GET /api/img/<key> — streams an image out of the R2 bucket (public read).
// Keeps the bucket private; everything is served from your own origin.
export async function onRequestGet({ params, env }) {
  if (!env.PHOTOS_BUCKET) return new Response('Not found', { status: 404 })

  const key = Array.isArray(params.path) ? params.path.join('/') : params.path
  const object = await env.PHOTOS_BUCKET.get(key)
  if (!object) return new Response('Not found', { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')
  return new Response(object.body, { headers })
}
