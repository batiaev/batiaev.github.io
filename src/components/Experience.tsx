import React, { useEffect, useRef, Suspense, lazy } from 'react'
import { ArrowUpRight } from 'lucide-react'
import data from '@/data/data.json'
import { roleAnchor } from '@/lib/showcase'
import { revealOnScroll } from '@/lib/reveal'

const ScopeChart = lazy(() => import('@/components/ScopeChart'))

/**
 * The record as a ledger: when and how big on the left, what it was on the
 * right. Every row has the same shape, so a reader can run down the left
 * column and see the rungs without reading a word of the right one.
 */
const Experience = () => {
  const headerRef = useRef<HTMLDivElement>(null)
  const timelineItemsRef = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const carousel = window.matchMedia('(max-width: 639px)').matches
    return revealOnScroll(
      carousel
        ? [headerRef.current]
        : [headerRef.current, ...timelineItemsRef.current],
    )
  }, [])

  return (
    <section id="experience" className="container mx-auto scroll-mt-14 py-12 sm:py-16">
      <div ref={headerRef}>
        <div className="highlight-chip">Selected experience</div>
        <h2 className="section-title">Four kinds of company, one track record</h2>
        <p className="section-subtitle">
          Enterprise investment banks, hyperscalers, 0 → 1 startups, and platform
          transformation — each role is labelled with what it actually was.
        </p>
      </div>

      <nav aria-label="Roles" className="scroll-row mb-4 sm:hidden">
        {data.experiences.map((item) => (
          <a key={item.id} href={`#${roleAnchor(item.anchor)}`} className="nav-pill">
            {item.company}
          </a>
        ))}
      </nav>

      <ol className="card-row sm:border-border sm:divide-border sm:divide-y sm:overflow-hidden sm:rounded-lg sm:border">
        {data.experiences.map((item, index) => (
          <li
            key={item.id}
            id={roleAnchor(item.anchor)}
            className="border-border target:bg-primary/[0.04] scroll-mt-[7.5rem] rounded-lg border p-5 transition-colors sm:grid sm:scroll-mt-20 sm:grid-cols-[10.5rem_minmax(0,1fr)] sm:gap-8 sm:rounded-none sm:border-0 sm:px-6 sm:py-6 lg:grid-cols-[12rem_minmax(0,1fr)]"
            ref={(el) => {
              timelineItemsRef.current[index] = el
            }}
          >
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mb-0 sm:flex-col sm:gap-1.5">
              <p className="text-foreground font-mono text-[12px] tabular-nums">
                {item.period}
              </p>
              <p className="text-muted-foreground text-xs">{item.city}</p>
              {'scaleNote' in item && item.scaleNote ? (
                <p className="text-muted-foreground font-mono text-[11px] tabular-nums sm:mt-2">
                  {item.scaleNote}
                </p>
              ) : null}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 className="text-[16px] font-semibold tracking-tight sm:text-[17px]">
                  {item.title}
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {item.archetypes.map((archetype) => (
                    <li key={archetype} className="tag">
                      {archetype}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-1 text-[14px]">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-0.5 font-medium underline-offset-4 hover:underline"
                  >
                    {item.company}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : (
                  <span className="font-medium">{item.company}</span>
                )}
              </p>

              <ul className="mt-4 space-y-2">
                {item.achievements.map((achievement, i) => (
                  <li
                    key={i}
                    className="text-foreground/80 relative pl-4 text-[14px] leading-relaxed before:bg-muted-foreground/40 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2"
                  >
                    {achievement}
                  </li>
                ))}
              </ul>

              {'proofLink' in item && item.proofLink ? (
                <a
                  href={item.proofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground mt-4 inline-flex min-h-10 items-center gap-1 text-[13px] transition-colors sm:min-h-0"
                >
                  Related public note
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Suspense fallback={null}>
          <ScopeChart />
        </Suspense>

        <div className="surface p-5 sm:p-6">
          <h3 className="eyebrow mb-4">{data.credentials.title}</h3>
          <ul className="divide-border divide-y">
            {data.credentials.items.map((item) => (
              <li key={item.qualification} className="py-2.5 first:pt-0 last:pb-0">
                <span className="block text-[14px] font-medium">{item.qualification}</span>
                <span className="text-muted-foreground block text-[13px]">{item.institution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Experience
