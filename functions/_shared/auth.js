// Shared helpers for the photo API. Files/folders starting with "_" are NOT
// routed by Cloudflare Pages — they're import-only.

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
    ...init,
  })
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0
  s += '='.repeat(pad)
  const bin = atob(s)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

// Small in-memory cache of Cloudflare Access signing keys.
let jwksCache = { keys: null, exp: 0 }

async function getKeys(teamDomain, now) {
  if (jwksCache.keys && jwksCache.exp > now) return jwksCache.keys
  const url = `https://${teamDomain}.cloudflareaccess.com/cdn-cgi/access/certs`
  const res = await fetch(url)
  const data = await res.json()
  jwksCache = { keys: data.keys || [], exp: now + 60 * 60 * 1000 }
  return jwksCache.keys
}

async function verifyAccessJwt(token, env) {
  const [h, p, s] = token.split('.')
  if (!h || !p || !s) return false

  const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h)))
  const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)))
  const now = Date.now()

  if (payload.exp && now / 1000 > payload.exp) return false
  if (env.ACCESS_AUD) {
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
    if (!auds.includes(env.ACCESS_AUD)) return false
  }

  const keys = await getKeys(env.ACCESS_TEAM_DOMAIN, now)
  const jwk = keys.find((k) => k.kid === header.kid)
  if (!jwk) return false

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  )
  const data = new TextEncoder().encode(`${h}.${p}`)
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(s), data)
}

/**
 * Gate admin-only endpoints. Returns null if allowed, or a 401 Response.
 *
 *  Primary:  Cloudflare Access — verifies the JWT it injects, against your
 *            team's public keys. Requires env.ACCESS_TEAM_DOMAIN + ACCESS_AUD.
 *  Fallback: a shared secret in env.ADMIN_TOKEN, sent as the x-admin-token
 *            header (handy for local testing before Access is set up).
 */
export async function requireAdmin(request, env) {
  const cookie = request.headers.get('Cookie') || ''
  const token =
    request.headers.get('Cf-Access-Jwt-Assertion') ||
    (cookie.match(/CF_Authorization=([^;]+)/) || [])[1]

  if (token && env.ACCESS_TEAM_DOMAIN) {
    try {
      if (await verifyAccessJwt(token, env)) return null
    } catch {
      // fall through to deny
    }
  }

  if (env.ADMIN_TOKEN && request.headers.get('x-admin-token') === env.ADMIN_TOKEN) {
    return null
  }

  return json({ error: 'Unauthorized' }, { status: 401 })
}
