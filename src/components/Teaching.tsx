import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, GraduationCap } from 'lucide-react'
import data from '@/data/data.json'

const Teaching = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    el.classList.add('reveal-on-scroll')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add('is-revealed')
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const { chip, title, subtitle, courses, tools } = data.teaching

  return (
    <section
      id="in-public"
      className="section border-border/40 border-t pb-8 pt-16 sm:pt-20"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">{chip}</div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle mx-auto">{subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="group flex flex-col rounded-lg border border-transparent bg-background p-6 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                {tool.topic}
              </p>
              <h3 className="mb-2 text-base font-semibold">{tool.name}</h3>
              <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                {tool.description}
              </p>
              <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                Open
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          ))}

          <div className="border-border/60 rounded-lg border border-dashed p-6">
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap className="text-primary h-5 w-5 shrink-0" aria-hidden />
              <h3 className="text-base font-semibold">
                <a
                  href={courses.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hover inline-flex items-center gap-1"
                >
                  {courses.institution}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </h3>
            </div>
            <p className="text-muted-foreground mb-4 text-sm">
              {courses.role} · {courses.period}
            </p>
            <ul className="space-y-1.5">
              {courses.items.map((course) => (
                <li key={course} className="text-muted-foreground text-sm leading-relaxed">
                  {course}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          <Link to="/tools" className="text-primary hover:underline">
            All calculators
          </Link>{' '}
          — free, no signup, nothing leaves your browser.
        </p>
      </div>
    </section>
  )
}

export default Teaching
