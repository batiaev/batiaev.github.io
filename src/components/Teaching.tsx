import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Bot, GraduationCap, Radio } from 'lucide-react'
import { revealOnScroll } from '@/lib/reveal'
import ToolList from '@/components/tools/ToolList'
import { SECTION_ICONS } from '@/lib/nav'
import { SECTIONS, learnPath } from '@/learn/registry'
import data from '@/data/data.json'

const MARKET_SECTIONS = ['options', 'risk', 'markets', 'library']

const CARD = 'surface flex flex-col p-5 sm:p-6'

/** A labelled card header: icon tile, title, and a one-line description. */
const CardHead = ({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Radio
  title: string
  children: React.ReactNode
}) => (
  <div className="mb-4">
    <span className="border-border bg-muted/60 text-foreground/80 mb-4 grid size-8 place-items-center rounded-md border">
      <Icon className="size-4" aria-hidden />
    </span>
    <h4 className="text-[15px] font-semibold tracking-tight">{title}</h4>
    <p className="text-muted-foreground mt-1.5 text-[13px] leading-relaxed">{children}</p>
  </div>
)

const Teaching = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => revealOnScroll([sectionRef.current]), [])

  const { chip, title, subtitle, courses, tools, notes } = data.teaching
  const ai = SECTIONS.find((s) => s.id === 'ai')

  return (
    <section id="toolkit" className="border-border scroll-mt-14 border-t" ref={sectionRef}>
      <div className="container mx-auto space-y-10 py-12 sm:py-16">
        <div>
          <div className="highlight-chip">{chip}</div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle !mb-0">{subtitle}</p>
        </div>

        <div>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h3 className="eyebrow">Knowledge</h3>
            <Link to={notes.href} className="text-muted-foreground hover:text-foreground text-[13px] transition-colors">
              {notes.cta} →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {/* Markets: the sections, with counts — the shape of the thing. */}
            <div className={CARD}>
              <CardHead icon={Radio} title="Markets, derivatives & risk">
                {notes.description}
              </CardHead>
              <ul className="border-border divide-border mt-auto divide-y border-t">
                {SECTIONS.filter((s) => MARKET_SECTIONS.includes(s.id)).map((section) => {
                  const Icon = SECTION_ICONS[section.id]
                  return (
                    <li key={section.id}>
                      <Link
                        to={`/learn#${section.id}`}
                        className="hover:text-foreground text-foreground/80 group flex items-center gap-2.5 py-2 text-[13px] transition-colors"
                      >
                        {Icon ? <Icon className="text-muted-foreground size-3.5" aria-hidden /> : null}
                        {section.title}
                        <span className="text-muted-foreground ml-auto font-mono text-[11px] tabular-nums">
                          {section.pages.length}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* AI engineering: few enough pages to list by name. */}
            {ai ? (
              <div className={CARD}>
                <CardHead icon={Bot} title="AI engineering">
                  {ai.blurb}
                </CardHead>
                <ul className="border-border divide-border mt-auto divide-y border-t">
                  {ai.pages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        to={learnPath(page.slug)}
                        className="hover:text-foreground text-foreground/80 group flex items-center gap-2 py-2 text-[13px] transition-colors"
                      >
                        <span className="truncate">{page.title}</span>
                        <ArrowRight
                          className="text-muted-foreground/60 ml-auto size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Teaching in a classroom, alongside the notes: explaining things
                to people. The calculators are a different kind of output. */}
            <a
              href={courses.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${CARD} surface-link group`}
            >
              <div className="flex items-start justify-between">
                <CardHead icon={GraduationCap} title={courses.institution}>
                  {courses.role} · {courses.period}
                </CardHead>
                <ArrowUpRight
                  className="text-muted-foreground/60 group-hover:text-foreground size-4 shrink-0 transition-colors"
                  aria-hidden
                />
              </div>
              <ul className="border-border divide-border mt-auto divide-y border-t">
                {courses.items.map((course) => (
                  <li key={course} className="text-foreground/80 py-2 text-[13px] leading-snug">
                    {course}
                  </li>
                ))}
              </ul>
            </a>
          </div>
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="eyebrow">Tools</h3>
            <p className="text-muted-foreground text-[13px]">
              Free, no signup, nothing leaves your browser ·{' '}
              <Link to="/tools" className="hover:text-foreground underline-offset-4 hover:underline">
                all calculators
              </Link>
            </p>
          </div>
          <ToolList tools={tools} heading="h4" />
        </div>
      </div>
    </section>
  )
}

export default Teaching
