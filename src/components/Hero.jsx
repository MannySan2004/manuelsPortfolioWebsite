import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { staggerContainer, fadeUpItem } from '../lib/motion.jsx'
import { DownloadIcon, ArrowRightIcon } from './icons.jsx'
import SocialLinks from './SocialLinks.jsx'
import { SITE, BIO } from '../data/site.js'

export default function Hero() {
  const prefersReduced = useReducedMotion()
  const { scrollY } = useScroll()
  // Gentle parallax drift on the background blobs as you scroll.
  const blobY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : 120])

  return (
    <section id="about" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Soft blue gradient backdrop */}
      <motion.div
        aria-hidden
        style={{ y: blobY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full
                        bg-brand-400/25 blur-[120px] dark:bg-brand-600/25" />
        <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-brand-300/20 blur-[100px] dark:bg-brand-500/15" />
      </motion.div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          <motion.p
            variants={fadeUpItem}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60
                       px-4 py-1.5 text-sm font-medium text-ink/70 backdrop-blur
                       dark:border-white/10 dark:bg-white/5 dark:text-mist/70"
          >
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            {SITE.school}
          </motion.p>

          <motion.h1
            variants={fadeUpItem}
            className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Hi, I&rsquo;m {SITE.name.split(' ')[0]}.
            <span className="block bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              {SITE.role}.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpItem}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink/65 dark:text-mist/65"
          >
            {SITE.tagline}
          </motion.p>

          <motion.div variants={fadeUpItem} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#projects" className="btn-primary">
              View my work <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a href={SITE.resumePath} download className="btn-ghost">
              <DownloadIcon className="h-4 w-4" /> Download résumé
            </a>
          </motion.div>

          <motion.div variants={fadeUpItem} className="mt-8">
            <SocialLinks />
          </motion.div>
        </motion.div>

        {/* Headshot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="justify-self-center lg:justify-self-end"
        >
          <div className="group relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-brand-500/30 to-brand-300/20 blur-xl" />
            <div className="relative h-64 w-64 overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br
                            from-brand-100 to-brand-50 shadow-2xl shadow-brand-900/10 sm:h-80 sm:w-80
                            dark:border-white/10 dark:from-slatecard dark:to-midnight">
              {/* Drop a headshot at /public/headshot.jpg to replace this placeholder */}
              <img
                src="/headshot.jpg"
                alt={SITE.name}
                onError={(e) => { e.currentTarget.style.display = 'none' }}
                className="h-full w-full object-cover transition-transform duration-700 ease-apple group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-7xl font-bold text-brand-500/40">
                {SITE.name.split(' ').map((w) => w[0]).join('')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bio paragraphs */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-20 max-w-3xl px-5 sm:px-8"
      >
        <div className="space-y-5 text-lg leading-relaxed text-ink/70 dark:text-mist/70">
          {BIO.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
