import { json, requireAdmin } from '../_shared/auth.js'

// POST /api/upload — admin only. Stores the resized blob in R2 + a row in D1.
export async function onRequestPost({ request, env }) {
  const denied = await requireAdmin(request, env)
  if (denied) return denied

  if (!env.PHOTOS_BUCKET || !env.DB) {
    return json({ error: 'Storage not configured' }, { status: 500 })
  }

  const form = await request.formData()
  const file = form.get('file')
  if (!file || typeof file === 'string') {
    return json({ error: 'No file provided' }, { status: 400 })
  }

  const caption = (form.get('caption') || '').toString().slice(0, 200)
  const category = (form.get('category') || '').toString().slice(0, 60)

  const id = crypto.randomUUID()
  const ext = (file.type && file.type.split('/')[1]) || 'webp'
  const key = `${id}.${ext}`

  await env.PHOTOS_BUCKET.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'image/webp' },
  })

  const createdAt = new Date().toISOString()
  await env.DB.prepare(
    'INSERT INTO photos (id, key, caption, category, created_at) VALUES (?, ?, ?, ?, ?)',
  )
    .bind(id, key, caption, category, createdAt)
    .run()

  return json({ id, url: `/api/img/${key}`, caption, category })
}
