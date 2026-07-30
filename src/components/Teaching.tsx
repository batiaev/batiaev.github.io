import React, { useEffect, useRef } from 'react'
import { revealOnScroll } from '@/lib/reveal'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BookOpen, GraduationCap } from 'lucide-react'
import ToolList from '@/components/tools/ToolList'
import data from '@/data/data.json'

const Teaching = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => revealOnScroll([sectionRef.current]), [])

  const { chip, title, subtitle, courses, tools, notes } = data.teaching

  return (
    <section
      id="toolkit"
      className="border-border/40 border-t pb-8 pt-16 sm:pt-20"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">{chip}</div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle mx-auto">{subtitle}</p>
        </div>

        <div className="mx-auto max-w-5xl space-y-10">
          {/* Explaining things to people: the notes and the courses belong
              together. The calculators are a different kind of output. */}
          <div>
            <h3 className="text-muted-foreground mb-4 text-xs font-medium uppercase tracking-wider">
              Teaching
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Link
                to={notes.href}
                className="group flex flex-col rounded-lg border border-transparent bg-background p-6 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="text-primary h-5 w-5 shrink-0" aria-hidden />
                  <h4 className="text-base font-semibold">{notes.title}</h4>
                </div>
                <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                  {notes.description}
                </p>
                <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                  {notes.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>

              {/* The whole card is the link, with the arrow in the corner —
                  same shape as the product cards, rather than an arrow
                  hanging off the end of the title. */}
              <a
                href={courses.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border-border/60 hover:border-border flex flex-col rounded-lg border p-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="text-primary h-5 w-5 shrink-0" aria-hidden />
                    <h4 className="text-base font-semibold">
                      {courses.institution}
                    </h4>
                  </div>
                  <ArrowUpRight
                    className="text-muted-foreground h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </div>
                <p className="text-muted-foreground mb-3 text-sm">
                  {courses.role} · {courses.period}
                </p>
                <ul className="space-y-1.5">
                  {courses.items.map((course) => (
                    <li
                      key={course}
                      className="text-muted-foreground text-sm leading-relaxed"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </a>
            </div>
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Tools
              </h3>
              <p className="text-muted-foreground text-xs">
                Free, no signup, nothing leaves your browser ·{' '}
                <Link to="/tools" className="text-primary hover:underline">
                  all calculators
                </Link>
              </p>
            </div>
            <ToolList tools={tools} heading="h4" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Teaching
