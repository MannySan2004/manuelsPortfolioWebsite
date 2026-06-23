import { Reveal } from '../lib/motion.jsx'

/**
 * Consistent section shell: vertical rhythm, max width, and an animated
 * eyebrow + title header that reveals on scroll.
 */
export default function Section({ id, eyebrow, title, intro, children, className = '' }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28 ${className}`}>
      {(eyebrow || title) && (
        <Reveal className="mb-14 max-w-2xl">
          {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
          {title && <h2 className="section-title">{title}</h2>}
          {intro && <p className="mt-4 text-lg text-ink/60 dark:text-mist/60">{intro}</p>}
        </Reveal>
      )}
      {children}
    </section>
  )
}
