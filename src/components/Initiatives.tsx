import React, { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import data from "@/data/data.json";

const Initiatives = () => {
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
    <section id="building" className="section bg-accent/30 py-16 sm:py-20" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">Building now</div>
          <h2 className="section-title">Own products</h2>
          <p className="section-subtitle mx-auto">
            Public faces of work in progress — AI-native development and personal
            financial planning.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {data.initiatives.map((item) => (
            <a
              key={item.name}
              href={item.link}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex min-h-[11rem] flex-col rounded-lg border border-transparent bg-background p-6 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <ArrowUpRight
                  className="text-muted-foreground h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </div>
              <p className="text-muted-foreground flex-1 text-sm leading-relaxed">
                {item.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Initiatives;
