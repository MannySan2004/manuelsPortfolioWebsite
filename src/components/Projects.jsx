import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section.jsx'
import { Reveal, EASE } from '../lib/motion.jsx'
import { GithubIcon, ArrowRightIcon } from './icons.jsx'
import { PROJECTS } from '../data/projects.js'

export default function Projects() {
  const prefersReduced = useReducedMotion()

  return (
    <Section
      id="projects"
      eyebrow="Things I've built"
      title="Projects"
      intro="A selection of what I've been working on — from applied AI to web development."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <motion.div
              whileHover={prefersReduced ? undefined : { y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="card group flex h-full flex-col p-7 transition-shadow duration-300
                         hover:shadow-xl hover:shadow-brand-900/10 dark:hover:shadow-black/40"
            >
              <h3 className="text-xl font-bold tracking-tight">{p.title}</h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/70 dark:text-mist/70">
                {p.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {(p.github || p.demo) && (
              <div className="mt-6 flex items-center gap-4 border-t border-black/5 pt-5 dark:border-white/10">
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink/70
                               transition-colors hover:text-brand-600 dark:text-mist/70 dark:hover:text-brand-300"
                  >
                    <GithubIcon className="h-4 w-4" /> Code
                  </a>
                )}
                {p.demo && (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600
                               transition-colors hover:text-brand-500 dark:text-brand-400"
                  >
                    Live demo <ArrowRightIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
              )}
            </motion.div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
