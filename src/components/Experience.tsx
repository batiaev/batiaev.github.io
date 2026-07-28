import React, { useEffect, useRef, Suspense, lazy } from 'react'
import { CheckCheck, ArrowUpRight } from 'lucide-react'
import data from '@/data/data.json'
import { roleAnchor } from '@/lib/showcase'

const ScopeChart = lazy(() => import('@/components/ScopeChart'))

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineItemsRef = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      sectionRef.current.classList.add('reveal-on-scroll')
      observer.observe(sectionRef.current)
    }

    timelineItemsRef.current.forEach((item) => {
      if (item) {
        item.classList.add('reveal-on-scroll')
        observer.observe(item)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="experience" className="section py-16 sm:py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">Selected experience</div>
          <h2 className="section-title">Four kinds of company, one track record</h2>
          <p className="section-subtitle mx-auto">
            Enterprise investment banks, hyperscalers, 0 → 1 startups, and platform transformation —
            each role is labelled with what it actually was.
          </p>
        </div>

        <ol className="mx-auto max-w-3xl space-y-6">
          {data.experiences.map((item, index) => (
            <li
              key={item.id}
              id={roleAnchor(item.anchor)}
              className="scroll-mt-24 rounded-lg border border-border/50 bg-background/80 p-5 transition-shadow target:ring-2 target:ring-primary/40 sm:p-6"
              ref={(el) => {
                timelineItemsRef.current[index] = el
              }}
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="text-muted-foreground text-sm font-medium">{item.period}</p>
                <ul className="flex flex-wrap gap-2">
                  {item.archetypes.map((archetype) => (
                    <li
                      key={archetype}
                      className="bg-accent text-accent-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
                    >
                      {archetype}
                    </li>
                  ))}
                </ul>
              </div>

              <h3 className="mt-2 text-lg font-semibold sm:text-xl">{item.title}</h3>
              <p className="text-primary mt-1 font-medium">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-hover inline-flex items-center gap-1"
                  >
                    {item.company}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ) : (
                  item.company
                )}
                <span className="text-muted-foreground font-normal"> · {item.city}</span>
              </p>

              <ul className="mt-4 space-y-2">
                {item.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-base">
                    <CheckCheck
                      className="text-primary mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                      aria-hidden
                    />
                    <span className="text-muted-foreground">{achievement}</span>
                  </li>
                ))}
              </ul>

              {'proofLink' in item && item.proofLink ? (
                <a
                  href={item.proofLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary mt-4 inline-flex min-h-11 items-center text-sm hover:underline"
                >
                  Related public note
                </a>
              ) : null}
            </li>
          ))}
        </ol>

        <Suspense fallback={null}>
          <ScopeChart />
        </Suspense>

        <div className="border-border/50 mx-auto mt-12 max-w-3xl border-t pt-8">
          <h3 className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
            {data.credentials.title}
          </h3>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {data.credentials.items.map((item) => (
              <li key={item.qualification} className="text-sm">
                <span className="font-medium">{item.qualification}</span>
                <span className="text-muted-foreground"> · {item.institution}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Experience
