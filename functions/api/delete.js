import { json, requireAdmin } from '../_shared/auth.js'

// POST /api/delete  { id }  — admin only. Removes from R2 + D1.
export async function onRequestPost({ request, env }) {
  const denied = await requireAdmin(request, env)
  if (denied) return denied

  if (!env.PHOTOS_BUCKET || !env.DB) {
    return json({ error: 'Storage not configured' }, { status: 500 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { id } = body || {}
  if (!id) return json({ error: 'Missing id' }, { status: 400 })

  const row = await env.DB.prepare('SELECT key FROM photos WHERE id = ?').bind(id).first()
  if (row && row.key) await env.PHOTOS_BUCKET.delete(row.key)
  await env.DB.prepare('DELETE FROM photos WHERE id = ?').bind(id).run()

  return json({ ok: true })
}
