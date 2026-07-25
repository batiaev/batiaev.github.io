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

  return (
    <section id="engage" className="section bg-accent/30 py-16 sm:py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">Ways to engage</div>
          <h2 className="section-title">Where to start</h2>
          <p className="section-subtitle mx-auto">
            For VCs and builders, exec search, and selective expert work — pick
            the path that fits.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {data.engagementPaths.map((path) => {
            const isInternalRoute = path.href.startsWith("/");
            const className =
              "group flex min-h-[10rem] flex-col rounded-lg border border-transparent bg-background p-6 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

            const body = (
              <>
                <h3 className="mb-2 text-lg font-semibold">{path.title}</h3>
                <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                  {path.description}
                </p>
                <span className="text-primary inline-flex min-h-11 items-center gap-1 text-sm font-medium">
                  {path.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </>
            );

            if (isInternalRoute) {
              return (
                <Link key={path.title} to={path.href} className={className}>
                  {body}
                </Link>
              );
            }

            return (
              <a key={path.title} href={path.href} className={className}>
                {body}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Engagement;
