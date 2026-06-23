import { motion } from 'framer-motion'
import Section from './Section.jsx'
import TimelineCard from './TimelineCard.jsx'
import { TIMELINE } from '../data/timeline.js'

export default function Timeline() {
  return (
    <Section
      id="experience"
      eyebrow="My Journey"
      title="Experience timeline"
      intro="A walk through my college experience — hover any milestone to take a closer look."
    >
      <div className="relative">
        {/* Center line (desktop) / left rail (mobile) */}
        <div
          aria-hidden
          className="absolute bottom-0 top-0 w-px bg-gradient-to-b from-transparent via-brand-500/40 to-transparent
                     left-[7px] md:left-1/2 md:-translate-x-1/2"
        />

        <div className="space-y-10 md:space-y-16">
          {TIMELINE.map((entry, i) => {
            const side = i % 2 === 0 ? 'left' : 'right'
            return (
              <div key={i} className="relative md:grid md:grid-cols-2 md:gap-12">
                {/* Node dot on the line */}
                <motion.span
                  aria-hidden
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-7 z-10 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full
                             bg-brand-500 ring-4 ring-mist left-[7px] md:left-1/2 dark:ring-midnight"
                />

                {/* Card placed on the correct side */}
                <div
                  className={`pl-9 md:pl-0 ${
                    side === 'left'
                      ? 'md:col-start-1 md:pr-12 md:text-right'
                      : 'md:col-start-2 md:pl-12'
                  }`}
                >
                  <TimelineCard entry={entry} side={side} index={i} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
