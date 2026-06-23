import { useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from './icons.jsx'
import { EASE } from '../lib/motion.jsx'

export default function Lightbox({ photos, index, onClose, onNavigate }) {
  const open = index !== null && index >= 0
  const photo = open ? photos[index] : null

  const go = useCallback(
    (dir) => {
      if (!open) return
      const next = (index + dir + photos.length) % photos.length
      onNavigate(next)
    },
    [open, index, photos.length, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, go])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full
                       bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); go(-1) }}
                aria-label="Previous"
                className="absolute left-3 sm:left-6 grid h-12 w-12 place-items-center rounded-full
                           bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); go(1) }}
                aria-label="Next"
                className="absolute right-3 sm:right-6 grid h-12 w-12 place-items-center rounded-full
                           bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          <motion.figure
            key={photo.id}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] max-w-[92vw] flex-col items-center"
          >
            <img
              src={photo.url}
              alt={photo.caption || 'Photograph'}
              className="max-h-[80vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
            />
            {(photo.caption || photo.category) && (
              <figcaption className="mt-4 text-center text-sm text-white/80">
                {photo.caption}
                {photo.category && <span className="text-white/50"> · {photo.category}</span>}
              </figcaption>
            )}
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
