import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from '../lib/motion.jsx'

const TAG_STYLES = {
  education: 'bg-brand-500/10 text-brand-700 dark:text-brand-300',
  work: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  project: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  leadership: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  music: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  certification: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
  milestone: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
}

export default function TimelineCard({ entry, side, index }) {
  const prefersReduced = useReducedMotion()
  const tagClass = TAG_STYLES[entry.tag] || TAG_STYLES.milestone
  const fromX = prefersReduced ? 0 : side === 'left' ? -40 : 40

  return (
    <motion.article
      initial={{ opacity: 0, x: fromX, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.04 }}
      whileHover={prefersReduced ? undefined : { scale: 1.04, y: -4 }}
      className="card group cursor-default p-6 transition-shadow duration-300
                 hover:shadow-xl hover:shadow-brand-900/10 dark:hover:shadow-black/40"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${tagClass}`}>
          {entry.tag}
        </span>
        <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">{entry.period}</span>
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight">{entry.title}</h3>
      {entry.org && (
        <p className="mt-1 text-sm font-medium text-ink/50 dark:text-mist/50">{entry.org}</p>
      )}
      <p className="mt-3 text-[15px] leading-relaxed text-ink/70 dark:text-mist/70">
        {entry.description}
      </p>
    </motion.article>
  )
}
