
import React, { useEffect, useRef } from 'react';
import { BriefcaseIcon, CodeIcon, GraduationCap, BarChartIcon, TrendingUpIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import data from "../data/data.json";

const iconsByName = {
    'briefcase': <BriefcaseIcon className="h-8 w-8 text-primary" />,
    'trendingUp': <TrendingUpIcon className="h-8 w-8 text-primary" />,
    'code': <CodeIcon className="h-8 w-8 text-primary" />,
    'barChart': <BarChartIcon className="h-8 w-8 text-primary" />,
    'graduationCap': <GraduationCap className="h-8 w-8 text-primary" />
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
          <div className="highlight-chip">Expert Services</div>
          <h2 className="section-title">How I Can Help You</h2>
          <p className="section-subtitle mx-auto">
            Leveraging my experience as a fintech leader to provide strategic guidance and technical expertise for your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.services.map((service, index) => (
            <Card
              key={index}
              className="hero-card card-hover border-transparent shadow-subtle overflow-hidden lines-bg-card "
              ref={el => cardsRef.current[index] = el}
            >
              <CardHeader className="pb-0">
                <div className="mb-5">{iconsByName[service.logo]}</div>
                <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
