import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import data from "@/data/data.json";

const Engagement = () => {
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

  const card = data.advisoryCard;

  return (
    <section
      id="engage"
      className="section bg-accent/30 py-16 sm:py-20"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <Link
          to={card.href}
          className="group mx-auto flex max-w-2xl flex-col rounded-lg border border-transparent bg-background p-6 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8"
        >
          <div className="highlight-chip self-start">{card.chip}</div>
          <h2 className="text-2xl font-semibold">{card.title}</h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
            {card.description}
          </p>
          <span className="text-primary mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-medium">
            {card.cta}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Engagement;
