import { Reveal } from '../lib/motion.jsx'
import SocialLinks from './SocialLinks.jsx'
import { MailIcon, DownloadIcon } from './icons.jsx'
import { SITE } from '../data/site.js'

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-gradient-to-br
                        from-brand-600 to-brand-500 px-8 py-16 text-center shadow-xl shadow-brand-900/20 sm:px-16">
          <div aria-hidden className="pointer-events-none absolute -top-16 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-white/15 blur-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Get in touch</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Let&rsquo;s build something together.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Whether it&rsquo;s an opportunity, a collaboration, or just to talk cloud, security, or photography — my inbox is open.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3
                         text-sm font-semibold text-brand-700 shadow-sm transition-all duration-300 ease-apple
                         hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              <MailIcon className="h-4 w-4" /> Say hello
            </a>
            <a
              href={SITE.resumePath}
              download
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40
                         px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-apple
                         hover:bg-white/10 active:scale-95"
            >
              <DownloadIcon className="h-4 w-4" /> Résumé
            </a>
          </div>

          <div className="mt-9 flex justify-center [&_a]:border-white/30 [&_a]:text-white [&_a:hover]:border-white [&_a:hover]:text-white">
            <SocialLinks size="lg" />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
