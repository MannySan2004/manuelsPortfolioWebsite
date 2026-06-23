import { motion } from 'framer-motion'
import Section from './Section.jsx'
import { Reveal, staggerContainer, fadeUpItem } from '../lib/motion.jsx'
import { SKILLS } from '../data/skills.js'

export default function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="What I work with"
      title="Skills & interests"
      intro="A blend of technical depth and creative pursuits."
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {SKILLS.map((group, i) => (
          <Reveal key={group.group} delay={i * 0.06}>
            <div className="card h-full p-7">
              <h3 className="text-lg font-bold tracking-tight">{group.group}</h3>
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                className="mt-4 flex flex-wrap gap-2.5"
              >
                {group.items.map((item) => (
                  <motion.li
                    key={item}
                    variants={fadeUpItem}
                    className="rounded-xl border border-black/5 bg-mist/60 px-4 py-2 text-sm font-medium
                               text-ink/80 transition-colors hover:border-brand-500/40 hover:text-brand-700
                               dark:border-white/10 dark:bg-white/5 dark:text-mist/80 dark:hover:text-brand-300"
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
