import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Section from './Section.jsx'
import Lightbox from './Lightbox.jsx'
import { EASE } from '../lib/motion.jsx'
import { fetchPhotos } from '../lib/api.js'

export default function Gallery() {
  const [photos, setPhotos] = useState([])
  const [isSample, setIsSample] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    let alive = true
    fetchPhotos().then(({ photos, isSample }) => {
      if (!alive) return
      setPhotos(photos)
      setIsSample(isSample)
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  const categories = useMemo(() => {
    const set = new Set(photos.map((p) => p.category).filter(Boolean))
    return ['All', ...set]
  }, [photos])

  const visible = useMemo(
    () => (filter === 'All' ? photos : photos.filter((p) => p.category === filter)),
    [photos, filter],
  )

  return (
    <Section
      id="photography"
      eyebrow="Through my lens"
      title="Photography"
      intro="Moments captured while traveling and exploring new cultures."
    >
      {isSample && (
        <p className="-mt-8 mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          Showing sample images. Once the gallery backend is connected, your uploaded photos appear here automatically.
        </p>
      )}

      {categories.length > 2 && (
        <div className="mb-10 flex flex-wrap gap-2.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                filter === c
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                  : 'border border-black/10 text-ink/70 hover:border-brand-500/50 hover:text-brand-600 dark:border-white/15 dark:text-mist/70 dark:hover:text-brand-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid place-items-center py-20 text-ink/50 dark:text-mist/50">Loading photos…</div>
      ) : visible.length === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed border-black/10 py-20 text-ink/50 dark:border-white/15 dark:text-mist/50">
          No photos here yet.
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {visible.map((photo, i) => (
            <motion.button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.05 }}
              className="group relative block w-full break-inside-avoid overflow-hidden rounded-2xl
                         border border-black/5 shadow-sm focus:outline-none focus-visible:ring-2
                         focus-visible:ring-brand-500 dark:border-white/10"
            >
              <img
                src={photo.url}
                alt={photo.caption || 'Photograph'}
                loading="lazy"
                className="w-full object-cover transition-transform duration-700 ease-apple group-hover:scale-[1.06]"
              />
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t
                              from-black/55 via-transparent to-transparent opacity-0 transition-opacity
                              duration-300 group-hover:opacity-100">
                {photo.caption && (
                  <span className="p-4 text-sm font-medium text-white">{photo.caption}</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}

      <Lightbox
        photos={visible}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </Section>
  )
}
