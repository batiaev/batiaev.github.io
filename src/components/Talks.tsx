import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarCheck2, Mic, PencilLine, FileText } from 'lucide-react';
import data from "../data/data.json";

const Talks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-scale-in');
            }, parseInt(entry.target.getAttribute('data-delay') || '0'));
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.setAttribute('data-delay', `${index * 100}`);
        cardObserver.observe(card);
      }
    });

    return () => {
      if (sectionRef.current) {
        sectionObserver.unobserve(sectionRef.current);
      }
      cardsRef.current.forEach((card) => {
        if (card) cardObserver.unobserve(card);
      });
    };
  }, []);

  return (
    <section id="talks" className="section" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="highlight-chip">Public Speaking</div>
          <h2 className="section-title">Talks & Presentations</h2>
          <p className="section-subtitle mx-auto">
            Sharing insights and experiences through conferences, podcasts, and educational content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.talks.map((talk, index) => (
            <Card
              key={index}
              className="hero-card card-hover border-transparent shadow-subtle overflow-hidden lines-bg-card"
              ref={el => cardsRef.current[index] = el}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={talk.logo}
                      alt={talk.name}
                      className="w-full h-full object-cover"
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{talk.date}</span>
                      {talk.blog && (
                        <a
                          href={talk.blog}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <PencilLine className="h-4 w-4" />
                          <span>Read Case Study</span>
                        </a>
                      )}
                      {talk.event && (
                        <a
                          href={talk.event}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <CalendarCheck2 className="h-4 w-4" />
                          <span>Check Event</span>
                        </a>
                      )}
                      {talk.podcast && (
                        <a
                          href={talk.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                        >
                          <Mic className="h-4 w-4" />
                          <span>Listen Podcast</span>
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
                          <span>View Slides</span>
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
