import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {Calendar, CheckCheck, Download, MessageCircle, PlayCircle, Target, Lightbulb, ChartLine} from 'lucide-react';
import data from "../data/data.json";
import {Button} from "@/components/ui/button.tsx";

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
            }
          });
        },
        { threshold: 0.1 }
    );

    if (sectionRef.current) {
      sectionRef.current.classList.add('reveal-on-scroll');
      observer.observe(sectionRef.current);
    }

    timelineItemsRef.current.forEach((item) => {
      if (item) {
        item.classList.add('reveal-on-scroll');
        observer.observe(item);
      }
    });

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      timelineItemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section id="case-studies" className="section" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="highlight-chip">Case Studies</div>
          <h2 className="section-title">Client Success Stories</h2>
          <p className="section-subtitle mx-auto">
            Real-world examples of how I've helped organizations solve complex technical challenges
            and achieve measurable business outcomes.
          </p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-[calc(50%-1px)] before:w-[2px] before:bg-border before:hidden before:lg:block max-w-5xl mx-auto">
          {data.experiences.map((item, index) => (
              <div
                  key={index}
                  className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
                  ref={el => timelineItemsRef.current[index] = el}
              >
                <div className="lg:w-1/2 relative">
                  <Card className="card-hover border-transparent shadow-subtle">
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-muted-foreground">{item.period}</p>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        {item.url ? (
                            <a href={item.url} className="text-primary link-hover">
                              <p className="text-primary font-medium">{item.company} <span className="text-muted-foreground font-normal">· {item.city}</span></p>
                            </a>
                        ) : (
                            <p className="text-primary font-medium">{item.company} <span className="text-muted-foreground font-normal">· {item.city}</span></p>
                        )}
                      </div>

                      <div className="space-y-6">
                        {item.challenge && (
                            <div className="flex items-start gap-3">
                              <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-medium mb-2">Client Challenge</h4>
                                <p className="text-muted-foreground">{item.challenge}</p>
                              </div>
                            </div>
                        )}

                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium mb-2">Solution Approach</h4>
                            <ul className="space-y-2">
                              {item.achievements.map((achievement, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <CheckCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>{achievement}</span>
                                  </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {item.proofLink && (
                            <div className="flex items-start gap-3">
                              <ChartLine className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-medium mb-2">Results & Impact</h4>
                                <a href={item.proofLink} className="inline-flex items-center gap-2 text-primary hover:underline">
                                  <MessageCircle className="h-5 w-5" />
                                  <span>View Success Story</span>
                                </a>
                              </div>
                            </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-primary shadow-lg text-white z-10">
                  {index + 1}
                </div>
                <div className="lg:w-1/2"></div>
              </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-semibold mb-4">Ready to Transform Your Business?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how I can help solve your technical challenges and drive measurable business outcomes.
          </p>
          <Button size="lg" className="font-medium px-8 py-6" asChild>
            <a href={data.social[5].link} target="_blank" rel="noreferrer">
              <Calendar className="mr-2 h-5 w-5" /> Book a Consultation
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Experience;
