import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarCheck2, FileText, Mic, PencilLine, Youtube, type LucideIcon } from 'lucide-react';
import { revealOnScroll } from '@/lib/reveal';
import data from '../data/data.json';

const tracks = [
  { id: 'all', label: 'All' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'leadership', label: 'Leadership' },
] as const;

type TrackId = (typeof tracks)[number]['id'];
type Talk = (typeof data.talks)[number];

const LINKS: { key: keyof Talk; label: string; Icon: LucideIcon }[] = [
  { key: 'youtube', label: 'Watch', Icon: Youtube },
  { key: 'podcast', label: 'Listen', Icon: Mic },
  { key: 'slides', label: 'Slides', Icon: FileText },
  { key: 'blog', label: 'Article', Icon: PencilLine },
  { key: 'post', label: 'Post', Icon: CalendarCheck2 },
];

/** "26 Oct 2021" and "25 MAR 2025" both arrive; show them one way. */
const formatDate = (raw: string) =>
  raw.replace(/\b([A-Z])([A-Z]{2})\b/g, (_, a: string, b: string) => a + b.toLowerCase());

/**
 * Talks as a list, newest first — a dozen items read faster as rows than as a
 * wall of cards, and the format (watch, listen, slides) is what people scan for.
 */
const Talks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [track, setTrack] = useState<TrackId>('all');

  const visibleTalks = useMemo(
    () => (track === 'all' ? data.talks : data.talks.filter((talk) => talk.track === track)),
    [track],
  );

  useEffect(() => revealOnScroll([sectionRef.current]), []);

  return (
    <section id="talks" className="border-border scroll-mt-14 border-t" ref={sectionRef}>
      <div className="container mx-auto py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="highlight-chip">On the record</div>
            <h2 className="section-title">Talks, podcasts &amp; writing</h2>
            <p className="section-subtitle !mb-0">
              Risk systems, cross-language architecture, and financial math on the
              engineering side; team building and product on the leadership side.
            </p>
          </div>

          <div
            className="border-border bg-muted/50 inline-flex shrink-0 self-start rounded-md border p-0.5 sm:self-auto"
            role="group"
            aria-label="Filter talks by track"
          >
            {tracks.map((option) => {
              const active = option.id === track;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTrack(option.id)}
                  aria-pressed={active}
                  className={`h-8 rounded-[5px] px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? 'bg-background text-foreground shadow-[0_0_0_1px_hsl(var(--border)),0_1px_2px_hsl(var(--foreground)/0.06)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="border-border divide-border mt-8 divide-y overflow-hidden rounded-lg border">
          {visibleTalks.map((talk) => (
            <li
              key={talk.name}
              className="hover:bg-accent/40 grid grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-4 gap-y-2 px-4 py-3.5 transition-colors sm:grid-cols-[2.75rem_minmax(0,1fr)_auto_6.5rem] sm:items-center sm:px-5"
            >
              <img
                src={talk.logo}
                alt=""
                width={44}
                height={44}
                loading="lazy"
                decoding="async"
                className="border-border size-11 rounded-md border object-cover"
              />
              <div className="min-w-0">
                <a
                  href={talk.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] font-medium tracking-tight underline-offset-4 hover:underline"
                >
                  {talk.name}
                </a>
                <p className="text-muted-foreground mt-0.5 text-[13px] leading-snug">{talk.desc}</p>
              </div>
              <div className="col-start-2 flex flex-wrap gap-1 sm:col-start-auto sm:justify-end">
                {LINKS.filter(({ key }) => talk[key]).map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={String(talk[key])}
                    target="_blank"
                    rel="noreferrer"
                    className="border-border text-muted-foreground hover:text-foreground hover:bg-background inline-flex h-7 items-center gap-1.5 rounded-md border px-2 text-xs transition-colors"
                  >
                    <Icon className="size-3.5" aria-hidden />
                    {label}
                  </a>
                ))}
              </div>
              <span className="text-muted-foreground col-start-2 font-mono text-[11px] tabular-nums sm:col-start-auto sm:text-right">
                {formatDate(talk.date)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Talks;
