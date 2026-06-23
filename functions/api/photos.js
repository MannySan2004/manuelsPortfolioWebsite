import { json } from '../_shared/auth.js'

// GET /api/photos — public list of gallery photos, newest first.
export async function onRequestGet({ env }) {
  if (!env.DB) return json({ photos: [] })

  const { results } = await env.DB.prepare(
    'SELECT id, key, caption, category FROM photos ORDER BY created_at DESC',
  ).all()

  const photos = (results || []).map((r) => ({
    id: r.id,
    url: `/api/img/${r.key}`,
    caption: r.caption || '',
    category: r.category || '',
  }))

  return json({ photos })
}
