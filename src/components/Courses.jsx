import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Section from './Section.jsx'
import { COURSES } from '../data/courses.js'

const SPEED = 2600 // ms to advance one full card (smaller = faster)
const COUNT = COURSES.length
const CARD_W = 244
const CARD_H = 172
const ANGLE = 28 // degrees of arc per card offset
const RADIUS = 460 // arc radius in px

// Smooth, continuous 3D coverflow placement for a (fractional) offset.
function placeFor(off) {
  const th = (off * ANGLE * Math.PI) / 180
  const a = Math.abs(off)
  return {
    x: Math.sin(th) * RADIUS,
    z: (Math.cos(th) - 1) * RADIUS, // 0 at front, recedes to the sides
    ry: Math.max(-50, Math.min(50, -off * 22)),
    scale: Math.max(0.62, 1 - a * 0.12),
    opacity: Math.max(0, 1 - a / 3.2),
    z9: Math.round(1000 - a * 100),
  }
}

export default function Courses() {
  const prefersReduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const pausedRef = useRef(false)

  // Continuous, per-frame motion — no steps, so it never stutters.
  useEffect(() => {
    if (prefersReduced) return
    let raf
    let last = null
    const step = (now) => {
      if (last === null) last = now
      const dt = now - last
      last = now
      if (!pausedRef.current) {
        setProgress((p) => (p + dt / SPEED) % COUNT)
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [prefersReduced])

  // Accessibility: skip the auto 3D carousel for reduced-motion users.
  if (prefersReduced) {
    return (
      <Section
        id="courses"
        eyebrow="What I studied"
        title="Coursework"
        intro="Courses behind the skills — across IT, security, cloud, AI, and business."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <div key={c.name} className="card p-4">
              <p className="font-semibold leading-snug">{c.name}</p>
              <p className="mt-1 text-sm text-ink/50 dark:text-mist/50">
                {c.code ? `${c.code} · ` : ''}
                {c.org}
              </p>
            </div>
          ))}
        </div>
      </Section>
    )
  }

  return (
    <Section
      id="courses"
      eyebrow="What I studied"
      title="Coursework"
      intro="A slow, continuous 3D carousel of the courses behind the skills — hover to pause."
    >
      <div
        className="relative mx-auto max-w-5xl overflow-hidden"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        <div className="relative h-[320px]" style={{ perspective: '1400px' }}>
          <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {COURSES.map((c, i) => {
              // shortest signed (fractional) distance from the moving center
              let off = i - progress
              off = ((off % COUNT) + COUNT) % COUNT
              if (off > COUNT / 2) off -= COUNT
              const p = placeFor(off)
              const isCenter = Math.abs(off) < 0.5

              return (
                <div
                  key={i}
                  aria-hidden={p.opacity < 0.05}
                  className={`card absolute left-1/2 top-1/2 flex select-none flex-col items-center
                              justify-center p-6 text-center ${
                                isCenter ? 'ring-1 ring-brand-500/30 shadow-xl shadow-brand-900/10 dark:shadow-black/40' : ''
                              }`}
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    marginLeft: -CARD_W / 2,
                    marginTop: -CARD_H / 2,
                    transform: `translate3d(${p.x}px, 0, ${p.z}px) rotateY(${p.ry}deg) scale(${p.scale})`,
                    opacity: p.opacity,
                    zIndex: p.z9,
                    willChange: 'transform, opacity',
                  }}
                >
                  {c.code && (
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-600 dark:text-brand-400">
                      {c.code}
                    </span>
                  )}
                  <p className="mt-2 text-[15px] font-bold leading-snug tracking-tight">{c.name}</p>
                  <p className="mt-2 text-xs text-ink/50 dark:text-mist/50">{c.org}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}
