import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpenText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import data from '@/data/data.json'
import { shouldEnableDotField, isNarrowViewport } from '@/lib/dotFieldGuards'
import { isDark, onThemeChange } from '@/lib/theme'
import {
  currentRoles,
  previousRoles,
  roleAnchor,
  type ShowcaseRole,
} from '@/lib/showcase'

/* The dot field parses hex only, so the two themes carry their own pair rather
   than reading the CSS tokens. Dark needs more alpha to read at all. */
const DOTS = {
  light: { dotColor: '#64748b', base: 0.09, hot: 0.34 },
  dark: { dotColor: '#d4d4d8', base: 0.11, hot: 0.42 },
}

/* Logos ship on opaque white. Multiply drops the white in light mode;
   invert-and-screen drops it (black by then) in dark mode. */
const RoleLogos = ({ label, roles }: { label: string; roles: ShowcaseRole[] }) => {
  if (roles.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="eyebrow text-halo">{label}</p>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {roles.map((role) => (
          <li key={role.anchor}>
            <a
              href={`#${roleAnchor(role.anchor)}`}
              title={`See the ${role.company} role`}
              className="flex min-h-10 items-center rounded-sm opacity-55 grayscale transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:opacity-70 dark:hover:opacity-100"
            >
              {role.logo ? (
                <>
                  <img
                    src={role.logo}
                    alt={role.company}
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                    className="h-7 w-auto mix-blend-multiply dark:mix-blend-screen dark:invert sm:h-8"
                  />
                  <span className="sr-only">— see the {role.company} role</span>
                </>
              ) : (
                <span className="text-halo text-[15px] font-semibold tracking-tight">
                  {role.company}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * A row of figures, each with where it comes from. These are the only numbers
 * above the fold, and every one is a cited fact about a real role — not a
 * ticker, not a feed, nothing that only looks live.
 */
const Stats = () => (
  <dl className="border-border grid grid-cols-2 border-t lg:grid-cols-4">
    {data.stats.map((stat, i) => (
      <div
        key={stat.label}
        className={`border-border flex flex-col gap-1 px-4 py-5 sm:px-6 lg:px-10 ${
          i % 2 === 1 ? 'border-l' : ''
        } ${i >= 2 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
      >
        <dt className="text-muted-foreground order-2 text-[13px] leading-snug">
          {stat.label}
          <span className="text-muted-foreground mt-1 block font-mono text-[11px] uppercase tracking-[0.08em]">
            {stat.source}
          </span>
        </dt>
        <dd className="order-1 font-mono text-xl font-medium tabular-nums tracking-tight sm:text-2xl">
          {stat.value}
        </dd>
      </div>
    ))}
  </dl>
)

const Intro = () => {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el || !shouldEnableDotField()) return

    let destroyed = false
    let instance: { destroy: () => void; setConfig: (c: object) => unknown } | null = null
    let stopWatching = () => {}

    const narrow = isNarrowViewport()
    const palette = () => {
      const p = isDark() ? DOTS.dark : DOTS.light
      return {
        dotColor: p.dotColor,
        dotBaseAlpha: narrow ? p.base * 0.8 : p.base,
        hotAlpha: narrow ? p.hot * 0.65 : p.hot,
      }
    }

    import('@batiaev/dot-field').then(({ DotField }) => {
      if (destroyed || !heroRef.current) return
      instance = DotField.init(heroRef.current, {
        ...palette(),
        background: '#ffffff',
        // The tile shows through, so the field is right in either theme
        // without repainting a background.
        background_transparent: true,
        fps: narrow ? 24 : 30,
        areaCount: narrow ? 2 : 3,
        hotCount: narrow ? 2 : 3,
        // Push the coverage islands and bright spots to the right, away from
        // the left-aligned headline, so the activity lives in the margin.
        areaSpread: 0.24,
        hotSpread: narrow ? 0.26 : 0.34,
        pulseAmount: 0.12,
      })
      stopWatching = onThemeChange(() => instance?.setConfig(palette()))
    })

    return () => {
      destroyed = true
      stopWatching()
      instance?.destroy()
    }
  }, [])

  return (
    <div className="border-border border-b">
      <section ref={heroRef} className="relative isolate overflow-hidden">
        <div className="container relative z-10 mx-auto py-14 sm:py-20 lg:py-24">
          <div className="relative max-w-2xl">
            <div
              aria-hidden
              className="hero-scrim pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 sm:-inset-x-16 sm:-inset-y-10"
            />

            <div className="highlight-chip text-halo">{data.chip}</div>

            <h1 className="text-halo text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[3.25rem] lg:text-[3.75rem]">
              {data.name}
            </h1>

            <p className="text-halo text-foreground/90 mt-5 text-lg font-medium leading-snug tracking-[-0.01em] sm:text-[1.375rem]">
              {data.headline}
            </p>

            <p className="text-halo text-muted-foreground mt-4 max-w-xl text-[15px] leading-relaxed">
              {data.operatorLine}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Button className="min-h-10" asChild>
                <a href={data.heroCta.href}>
                  {data.heroCta.label}
                  <ArrowRight aria-hidden />
                </a>
              </Button>
              <Button variant="outline" className="min-h-10" asChild>
                <Link to="/learn">
                  <BookOpenText aria-hidden />
                  Read the notes
                </Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-row flex-wrap items-start gap-x-10 gap-y-6">
              <RoleLogos label="Now" roles={currentRoles} />
              <RoleLogos label="Previously" roles={previousRoles} />
            </div>
          </div>
        </div>
      </section>

      <Stats />
    </div>
  )
}

export default Intro
