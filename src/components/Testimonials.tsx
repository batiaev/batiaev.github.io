import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {ChevronLeft, ChevronRight, Linkedin} from 'lucide-react';
import data from "../data/data.json";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? data.testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === data.testimonials.length - 1 ? 0 : prev + 1));
  };

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

  useEffect(() => {
    if (testimonialsRef.current) {
      testimonialsRef.current.style.opacity = '0';
      testimonialsRef.current.style.transform = 'translateY(10px)';

      const timer = setTimeout(() => {
        if (testimonialsRef.current) {
          testimonialsRef.current.style.opacity = '1';
          testimonialsRef.current.style.transform = 'translateY(0)';
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

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
          <div
            ref={testimonialsRef}
            className="transition-all duration-500"
          >
            <Card className="border-transparent shadow-subtle">
              <CardContent className="p-8 md:p-12">
                <blockquote className="text-xl md:text-2xl font-display leading-relaxed mb-8">
                  "{data.testimonials[currentIndex].quote}"
                </blockquote>
                <div className="flex flex-col">
                  <cite className="text-lg font-medium not-italic">
                    {data.testimonials[currentIndex].author}
                  </cite>
                  <span className="text-muted-foreground">
                    {data.testimonials[currentIndex].title}
                  </span>
                  <span className="text-muted-foreground pt-2">
                    <a 
                      href={data.testimonials[currentIndex].linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                      aria-label={`Visit ${data.testimonials[currentIndex].author}'s LinkedIn profile`}
                    >
                      <Linkedin className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center items-center mt-8 gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            {data.testimonials.map((_, index) => (
              <Button
                key={index}
                variant={index === currentIndex ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Testimonial ${index + 1}`}
                className="h-2 w-2 rounded-full p-0"
                style={{ width: '10px', height: '10px', padding: '0' }}
              >
                <span className="sr-only">Testimonial {index + 1}</span>
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
