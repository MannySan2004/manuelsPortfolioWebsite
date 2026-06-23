import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadIcon, TrashIcon, CloseIcon } from '../components/icons.jsx'
import { EASE } from '../lib/motion.jsx'
import { fetchPhotos, uploadPhoto, deletePhoto } from '../lib/api.js'
import { resizeImage } from '../lib/resizeImage.js'

// NOTE: This page is gated by Cloudflare Access at the edge — only your
// whitelisted email can load /admin or call the upload/delete APIs. The UI
// below assumes you're already authenticated.

export default function Admin() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [backendReady, setBackendReady] = useState(true)
  const [queue, setQueue] = useState([]) // [{ file, caption, category, preview }]
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const inputRef = useRef(null)

  const load = () => {
    setLoading(true)
    fetchPhotos().then(({ photos, isSample }) => {
      setPhotos(photos)
      setBackendReady(!isSample)
      setLoading(false)
    })
  }
  useEffect(load, [])

  const notify = (msg, kind = 'ok') => {
    setToast({ msg, kind })
    setTimeout(() => setToast(null), 3500)
  }

  const addFiles = (fileList) => {
    const items = Array.from(fileList)
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ file: f, caption: '', category: '', preview: URL.createObjectURL(f), id: `${f.name}-${f.size}` }))
    setQueue((q) => [...q, ...items])
  }

  const updateQueue = (id, patch) =>
    setQueue((q) => q.map((it) => (it.id === id ? { ...it, ...patch } : it)))

  const removeFromQueue = (id) =>
    setQueue((q) => q.filter((it) => it.id !== id))

  const uploadAll = async () => {
    if (!queue.length) return
    setBusy(true)
    let ok = 0
    for (const item of queue) {
      try {
        const { blob } = await resizeImage(item.file)
        await uploadPhoto({ blob, caption: item.caption, category: item.category })
        ok++
      } catch (err) {
        notify(`Failed: ${item.file.name} — ${err.message}`, 'err')
      }
    }
    setBusy(false)
    setQueue([])
    if (ok) {
      notify(`Uploaded ${ok} photo${ok > 1 ? 's' : ''}.`)
      load()
    }
  }

  const handleDelete = async (id) => {
    try {
      await deletePhoto(id)
      setPhotos((p) => p.filter((x) => x.id !== id))
      notify('Photo deleted.')
    } catch (err) {
      notify(`Delete failed — ${err.message}`, 'err')
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="glass sticky top-0 z-40 border-b border-black/5 dark:border-white/10">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5 sm:px-8">
          <h1 className="text-base font-bold tracking-tight">Photo Admin</h1>
          <Link to="/" className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
            ← Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
        {!backendReady && (
          <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-700 dark:text-amber-300">
            <strong>Backend not connected yet.</strong> Uploading needs the Cloudflare
            R2 + D1 + Functions setup (see <code>SETUP.md</code>). Until then this page is a preview.
          </div>
        )}

        {/* Dropzone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
          className="grid cursor-pointer place-items-center rounded-3xl border-2 border-dashed border-black/15
                     bg-white/50 px-6 py-16 text-center transition-colors hover:border-brand-500/60
                     dark:border-white/15 dark:bg-white/5"
        >
          <UploadIcon className="h-10 w-10 text-brand-500" />
          <p className="mt-4 text-lg font-semibold">Drop photos here or click to browse</p>
          <p className="mt-1 text-sm text-ink/50 dark:text-mist/50">
            Images are resized to ~1600px &amp; converted to WebP before upload.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* Upload queue */}
        {queue.length > 0 && (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Ready to upload ({queue.length})</h2>
              <button onClick={uploadAll} disabled={busy} className="btn-primary disabled:opacity-60">
                {busy ? 'Uploading…' : 'Upload all'}
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {queue.map((item) => (
                <div key={item.id} className="card flex gap-4 p-4">
                  <img src={item.preview} alt="" className="h-24 w-24 flex-none rounded-xl object-cover" />
                  <div className="flex-1 space-y-2">
                    <input
                      value={item.caption}
                      onChange={(e) => updateQueue(item.id, { caption: e.target.value })}
                      placeholder="Caption"
                      className="w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm
                                 outline-none focus:border-brand-500 dark:border-white/15"
                    />
                    <input
                      value={item.category}
                      onChange={(e) => updateQueue(item.id, { category: e.target.value })}
                      placeholder="Category (e.g. Travel)"
                      className="w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm
                                 outline-none focus:border-brand-500 dark:border-white/15"
                    />
                  </div>
                  <button
                    onClick={() => removeFromQueue(item.id)}
                    aria-label="Remove"
                    className="h-8 w-8 flex-none rounded-full text-ink/40 hover:bg-black/5 dark:text-mist/40 dark:hover:bg-white/10"
                  >
                    <CloseIcon className="mx-auto h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing photos */}
        <div className="mt-12">
          <h2 className="mb-4 text-lg font-bold">In your gallery ({photos.length})</h2>
          {loading ? (
            <p className="text-ink/50 dark:text-mist/50">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {photos.map((p) => (
                <div key={p.id} className="group relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
                  <img src={p.url} alt={p.caption || ''} loading="lazy" className="aspect-square w-full object-cover" />
                  <button
                    onClick={() => handleDelete(p.id)}
                    aria-label="Delete photo"
                    className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-black/60
                               text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  {p.caption && (
                    <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent p-2 text-xs text-white">
                      {p.caption}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: EASE }}
            className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium text-white shadow-lg ${
              toast.kind === 'err' ? 'bg-red-600' : 'bg-brand-600'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
