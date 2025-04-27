import React, { useEffect, useRef } from 'react';
import { CodeIcon, TrendingUpIcon, ShieldCheck, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import data from "../data/data.json";

const iconsByName = {
  'code': <CodeIcon className="h-8 w-8 text-primary" />,
  'trendingUp': <TrendingUpIcon className="h-8 w-8 text-primary" />,
  'shield': <ShieldCheck className="h-8 w-8 text-primary" />,
  'rocket': <Rocket className="h-8 w-8 text-primary" />
}

const Services = () => {
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
      <section id="services" className="section bg-accent/30" ref={sectionRef}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="highlight-chip">For VC-Backed Fintech Founders</div>
            <h2 className="section-title">Build an Investor-Grade Tech Stack</h2>
            <p className="section-subtitle mx-auto">
              Expert guidance to help you avoid costly mistakes, accelerate your MVP, and build a tech foundation that impresses investors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.services.map((service, index) => (
                <Card
                    key={index}
                    className="hero-card card-hover border-transparent shadow-subtle overflow-hidden lines-bg-card"
                    ref={el => cardsRef.current[index] = el}
                >
                  <CardHeader className="pb-0">
                    <div className="mb-5">{iconsByName[service.logo]}</div>
                    <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">{service.description}</CardDescription>
                    <ul className="space-y-2 mb-4">
                      {service.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                            <span>{outcome}</span>
                          </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <a href="#case-studies" className="text-primary hover:underline inline-flex items-center gap-2">
                        View Case Studies <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>
  );
};

export default Services;
