import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Linkedin, Mail, Github, MessageCircle, Calendar } from 'lucide-react';
import data from "../data/data.json";

const Intro = () => {
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
            Helping Fintech Founders Build <span className="text-primary">Investor-Grade Products</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-6 max-w-2xl opacity-0 animate-reveal" style={{ animationDelay: '0.4s' }}>
            {data.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 w-full max-w-3xl opacity-0 animate-reveal" style={{ animationDelay: '0.5s' }}>
            {data.tags.map((tag, index) => (
              <div className="bg-accent/10 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{tag.label}</h3>
                <p className="text-sm text-muted-foreground">{tag.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-reveal" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" className="font-medium px-8 py-6" asChild>
              <a href="https://calendly.com/batiaev/30min" target="_blank" rel="noreferrer">
                <Calendar className="mr-2 h-5 w-5" /> Apply for Strategy Call
              </a>
            </Button>
            <Button size="lg" variant="outline" className="font-medium px-8 py-6" asChild>
              <a href="https://www.linkedin.com/in/batiaev/" target="_blank" rel="noreferrer">
                <Linkedin className="mr-2 h-5 w-5" /> Connect on LinkedIn
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4 opacity-0 animate-reveal" style={{ animationDelay: '0.7s' }}>
            Limited complimentary strategy calls available for VC-backed founders. Minimum engagement starts at £5,000.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;
