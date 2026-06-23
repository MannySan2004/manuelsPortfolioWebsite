import { GithubIcon, LinkedinIcon } from './icons.jsx'
import { SITE } from '../data/site.js'

export default function SocialLinks({ size = 'md' }) {
  const dims = size === 'lg' ? 'h-12 w-12' : 'h-11 w-11'
  const icon = size === 'lg' ? 'h-5.5 w-5.5' : 'h-5 w-5'

  const links = [
    { href: SITE.github, label: 'GitHub', Icon: GithubIcon },
    { href: SITE.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
  ]

  return (
    <div className="flex items-center gap-3">
      {links.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
          aria-label={label}
          className={`grid ${dims} place-items-center rounded-full border border-black/10 text-ink/80
                      transition-all duration-300 ease-apple hover:-translate-y-0.5 hover:border-brand-500/60
                      hover:text-brand-600 hover:shadow-lg hover:shadow-brand-600/15
                      dark:border-white/15 dark:text-mist/80 dark:hover:text-brand-300`}
        >
          <Icon className={icon} />
        </a>
      ))}
    </div>
  )
}
