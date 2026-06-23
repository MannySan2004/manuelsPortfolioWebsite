// ─────────────────────────────────────────────────────────────────────────────
// Resize + compress an image in the browser BEFORE uploading. This keeps your
// Cloudflare R2 storage tiny (a web gallery only needs ~1600px) and makes the
// gallery load fast. Returns a WebP Blob.
// ─────────────────────────────────────────────────────────────────────────────

export async function resizeImage(file, { maxSize = 1600, quality = 0.82 } = {}) {
  const bitmap = await createImageBitmap(file)

  let { width, height } = bitmap
  if (width > maxSize || height > maxSize) {
    const scale = Math.min(maxSize / width, maxSize / height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality),
  )
  return { blob, width, height }
}
