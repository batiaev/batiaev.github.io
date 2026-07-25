import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import data from "@/data/data.json";

const DomainProof = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.classList.add("reveal-on-scroll");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("is-revealed");
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { chip, title, subtitle, items, cta } = data.domainProof;

  return (
    <section
      id="derivatives"
      className="section border-border/40 border-t py-16 sm:py-20"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">{chip}</div>
          <h2 className="section-title">{title}</h2>
          <p className="section-subtitle mx-auto">{subtitle}</p>
        </div>

        <ul className="mx-auto max-w-3xl divide-y divide-border/60">
          {items.map((item) => (
            <li
              key={item.claim}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <span className="text-primary shrink-0 font-medium sm:w-40">
                {item.metric}
              </span>
              <span className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {item.claim}
                <span className="text-muted-foreground/70"> · {item.context}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Button size="lg" className="min-h-11 px-6 font-medium" asChild>
            <Link to={cta.href}>
              {cta.label}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <p className="text-muted-foreground mt-3 text-sm">
            Free, no signup, runs entirely in your browser.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DomainProof;
