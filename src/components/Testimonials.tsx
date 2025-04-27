import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin } from 'lucide-react';
import data from "../data/data.json";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      sectionRef.current.classList.add('reveal-on-scroll');
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section id="testimonials" className="section bg-accent/30" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <div className="highlight-chip">Client Success</div>
          <h2 className="section-title">What Others Say</h2>
          <p className="section-subtitle mx-auto">
            Feedback from founders, executives, and technical leaders I've partnered with.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {data.testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-transparent shadow-subtle">
                      <CardContent className="p-8 md:p-12">
                        <blockquote className="text-xl md:text-2xl font-display leading-relaxed mb-8">
                          "{testimonial.quote}"
                        </blockquote>
                        <div className="flex flex-col">
                          <cite className="text-lg font-medium not-italic">
                            {testimonial.author}
                          </cite>
                          <span className="text-muted-foreground">
                            {testimonial.title}
                          </span>
                          <span className="text-muted-foreground pt-2">
                            <a 
                              href={testimonial.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                              aria-label={`Visit ${testimonial.author}'s LinkedIn profile`}
                            >
                              <Linkedin className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">LinkedIn</span>
                            </a>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
