import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarCheck2, Mic, PencilLine, FileText, Youtube } from 'lucide-react';
import data from "../data/data.json";

const tracks = [
  { id: 'all', label: 'All' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'leadership', label: 'Leadership' },
] as const;

type TrackId = (typeof tracks)[number]['id'];

const Talks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [track, setTrack] = useState<TrackId>('all');

  const visibleTalks = useMemo(
    () =>
      track === 'all'
        ? data.talks
        : data.talks.filter((talk) => talk.track === track),
    [track],
  );

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      sectionRef.current.classList.add('reveal-on-scroll');
      sectionObserver.observe(sectionRef.current);
    }

    return () => sectionObserver.disconnect();
  }, []);

  return (
    <section id="talks" className="section" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <div className="highlight-chip">Public record</div>
          <h2 className="section-title">A decade in front of the room</h2>
          <p className="section-subtitle mx-auto">
            Risk systems, cross-language architecture, and financial math on the
            engineering side; team building and product on the leadership side.
          </p>
        </div>

        <div
          className="mb-10 flex flex-wrap justify-center gap-2"
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
                className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTalks.map((talk) => (
            <Card
              key={talk.name}
              className="card-hover border-transparent shadow-subtle overflow-hidden lines-bg-card"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={talk.logo}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <a
                        href={talk.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary link-hover"
                    >
                    <h3 className="text-lg font-semibold mb-1">{talk.name}</h3>
                    </a>
                    <p className="text-sm text-muted-foreground mb-3">{talk.desc}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span>{talk.date}</span>
                      {talk.blog && (
                        <a
                          href={talk.blog}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <PencilLine className="h-4 w-4" />
                          <span>Read article</span>
                        </a>
                      )}
                      {talk.post && (
                        <a
                          href={talk.post}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <CalendarCheck2 className="h-4 w-4" />
                          <span>LinkedIn post</span>
                        </a>
                      )}
                      {talk.podcast && (
                        <a
                          href={talk.podcast}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <Mic className="h-4 w-4" />
                          <span>Listen</span>
                        </a>
                      )}
                      {talk.slides && (
                        <a
                          href={talk.slides}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Slides</span>
                        </a>
                      )}
                      {talk.youtube && (
                        <a
                          href={talk.youtube}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <Youtube className="h-4 w-4" />
                          <span>Watch</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Talks;
