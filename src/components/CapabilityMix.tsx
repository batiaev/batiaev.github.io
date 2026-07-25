import React, { useEffect, useRef } from "react";
import data from "@/data/data.json";

const CapabilityMix = () => {
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
    <section
      id="capability"
      className="section border-t border-border/40 py-16 sm:py-20"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">How I operate</div>
          <h2 className="section-title">One mix for build and transform</h2>
          <p className="section-subtitle mx-auto">
            AI-native product work and enterprise digital transformation share the
            same operating stack.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {data.capabilityMix.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border/50 bg-background/60 p-5 sm:p-6"
            >
              <h3 className="mb-2 text-base font-semibold sm:text-lg">
                {item.label}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilityMix;
