import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import data from '@/data/data.json'
import { shouldEnableDotField, isNarrowViewport } from '@/lib/dotFieldGuards'
import {
  currentRoles,
  previousRoles,
  roleAnchor,
  type ShowcaseRole,
} from '@/lib/showcase'

const RoleLogos = ({ label, roles }: { label: string; roles: ShowcaseRole[] }) => {
  if (roles.length === 0) return null

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-halo text-xs uppercase tracking-wider">
        {label}
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {roles.map((role) => (
          <li key={role.anchor}>
            <a
              href={`#${roleAnchor(role.anchor)}`}
              title={`See the ${role.company} role`}
              className="flex min-h-11 items-center opacity-60 grayscale transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                    className="h-8 w-auto sm:h-9"
                  />
                  <span className="sr-only">— see the {role.company} role</span>
                </>
              ) : (
                <span className="font-display text-halo text-base font-semibold tracking-tight sm:text-lg">
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

const Intro = () => {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el || !shouldEnableDotField()) return

    let destroyed = false
    let instance: { destroy: () => void } | null = null

    const narrow = isNarrowViewport()

    import('@batiaev/dot-field').then(({ DotField }) => {
      if (destroyed || !heroRef.current) return
      instance = DotField.init(heroRef.current, {
        background: '#f8fafc',
        dotColor: '#64748b',
        dotBaseAlpha: narrow ? 0.07 : 0.09,
        hotAlpha: narrow ? 0.22 : 0.34,
        fps: narrow ? 24 : 30,
        areaCount: narrow ? 2 : 3,
        hotCount: narrow ? 2 : 3,
        // Push the coverage islands and bright spots away from the centre, so
        // the activity lives in the margins rather than under the headline.
        areaSpread: 0.2,
        hotSpread: narrow ? 0.26 : 0.32,
        pulseAmount: 0.12,
      })
    })

    return () => {
      destroyed = true
      instance?.destroy()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-[70vh] overflow-hidden py-16 sm:py-20 md:py-28"
    >
      <div className="container relative z-10 mx-auto px-4">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-10 text-center sm:px-12 sm:py-14">
          <div
            aria-hidden
            className="hero-scrim pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 sm:-inset-x-20 sm:-inset-y-8"
          />

          <div className="highlight-chip">{data.chip}</div>

          <h1 className="font-display text-halo mb-4 mt-1 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {data.name}
          </h1>

          <p className="text-primary text-halo mb-4 max-w-2xl text-lg font-medium sm:text-xl md:text-2xl">
            {data.headline}
          </p>

          <p className="text-muted-foreground text-halo mb-8 max-w-2xl text-sm leading-relaxed sm:text-base">
            {data.operatorLine}
          </p>

          <Button size="lg" className="min-h-11 px-6 font-medium" asChild>
            <a href={data.heroCta.href}>
              {data.heroCta.label}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </a>
          </Button>

          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
            <RoleLogos label="Now" roles={currentRoles} />
            <RoleLogos label="Previously" roles={previousRoles} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Intro
