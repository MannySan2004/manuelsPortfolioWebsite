import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section.jsx'
import { Reveal, EASE } from '../lib/motion.jsx'
import { ArrowRightIcon } from './icons.jsx'
import { CERTIFICATIONS } from '../data/certs.js'

export default function Certifications() {
  const prefersReduced = useReducedMotion()

  return (
    <Section
      id="certifications"
      eyebrow="Credentials"
      title="Certifications"
      intro="Industry certifications backing up the cloud and AI/ML work."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CERTIFICATIONS.map((cert, i) => {
          const inProgress = /progress/i.test(cert.status)
          return (
            <Reveal key={cert.name} delay={i * 0.06}>
              <motion.div
                whileHover={prefersReduced ? undefined : { y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="card group flex h-full flex-col p-6 transition-shadow duration-300
                           hover:shadow-xl hover:shadow-brand-900/10 dark:hover:shadow-black/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-600 dark:text-brand-400">
                    {cert.issuer}
                  </span>
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                      inProgress
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {cert.status}
                  </span>
                </div>

                <h3 className="mt-4 flex-1 text-lg font-bold leading-snug tracking-tight">
                  {cert.name}
                </h3>

                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600
                               transition-colors hover:text-brand-500 dark:text-brand-400"
                  >
                    View credential <ArrowRightIcon className="h-4 w-4" />
                  </a>
                )}
              </motion.div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
