import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Quote } from 'lucide-react';
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

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -top-8 -left-8 text-primary/10">
            <Quote className="h-32 w-32" />
          </div>
          <div className="absolute -bottom-8 -right-8 text-primary/10 rotate-180">
            <Quote className="h-32 w-32" />
          </div>
          
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
                    <Card className="border-transparent shadow-subtle bg-background/50 backdrop-blur-sm">
                      <CardContent className="p-8 md:p-12">
                        <div className="relative">
                          <Quote className="absolute -top-4 -left-4 h-8 w-8 text-primary/20" />
                          <blockquote className="text-xl md:text-2xl font-display leading-relaxed mb-8 pl-8">
                            "{testimonial.quote}"
                          </blockquote>
                        </div>
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-3 mb-2">
                            <cite className="text-lg font-medium not-italic">
                              {testimonial.author}
                            </cite>
                            <a 
                              href={testimonial.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-primary transition-colors"
                              aria-label={`Visit ${testimonial.author}'s LinkedIn profile`}
                            >
                              <Linkedin className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">LinkedIn</span>
                            </a>
                          </div>
                          <span className="text-muted-foreground text-sm">
                            {testimonial.title}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-16" />
            <CarouselNext className="hidden md:flex -right-16" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
