
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Linkedin, Mail, Github, MessageCircle, Calendar } from 'lucide-react';
import data from "../data/data.json";

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section className="py-20 md:py-32" ref={heroRef}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="highlight-chip animate-fade-in">
            Fintech Expert & Technology Advisor
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight mb-6 opacity-0 animate-reveal" style={{ animationDelay: '0.2s' }}>
            Accelerating <span className="text-primary">Fintech Innovation</span> Through Strategic Expertise
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl opacity-0 animate-reveal" style={{ animationDelay: '0.4s' }}>
            {data.description}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8 opacity-0 animate-reveal" style={{ animationDelay: '0.5s' }}>
            {data.tags.map((tag, index) => (
                <span key={index} className="bg-accent/50 text-sm px-3 py-1 rounded-full flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full bg-${tag.color || 'green'}-500`}></span>
                  {tag.label}
                </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-reveal" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="font-medium px-8 py-6" asChild>
              <a href="https://calendly.com/batiaev/30min" target="_blank" rel="noreferrer">
                <Calendar className="mr-2 h-5 w-5" /> Book a Free Strategy Call
              </a>
            </Button>
            <Button size="lg" variant="outline" className="font-medium px-8 py-6" asChild>
              <a href="https://www.linkedin.com/in/batiaev/" target="_blank" rel="noreferrer">
                <Linkedin className="mr-2 h-5 w-5" /> Connect on LinkedIn
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
