import { motion, useReducedMotion } from 'framer-motion'

// Apple-style easing — long, soft deceleration (easeOutExpo family).
export const EASE = [0.16, 1, 0.3, 1]
export const EASE_APPLE = [0.28, 0.11, 0.32, 1]

// Standard fade-up reveal, the signature Apple "rises into place" motion.
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

// Container that staggers its children's reveals.
export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

/**
 * Reveal — wraps content so it fades + rises into view on scroll, once.
 * Honors prefers-reduced-motion by rendering content statically.
 */
export function Reveal({
  children,
  as = 'div',
  className = '',
  delay = 0,
  y = 28,
  amount = 0.2,
  ...rest
}) {
  const prefersReduced = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (prefersReduced) {
    const Tag = as
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: '0px 0px -80px 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
