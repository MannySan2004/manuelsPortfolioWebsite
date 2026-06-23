import { SITE } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-10 text-sm
                      text-ink/50 sm:flex-row sm:px-8 dark:text-mist/50">
        <p>© {SITE.name}. Built with React, Tailwind &amp; Cloudflare.</p>
        <a href="#about" className="font-medium transition-colors hover:text-brand-600 dark:hover:text-brand-300">
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
