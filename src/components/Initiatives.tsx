import React, { useEffect, useRef } from "react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import data from "@/data/data.json";

type Initiative = (typeof data.initiatives)[number];

const Media = ({ item }: { item: Initiative }) => {
  const image = "image" in item ? item.image : undefined;

  if (image) {
    return (
      <img
        src={image}
        alt=""
        width={64}
        height={64}
        loading="lazy"
        decoding="async"
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="bg-primary/10 text-primary font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl font-semibold"
    >
      {item.name.charAt(0)}
    </div>
  );
};

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
    <section
      id="building"
      className="section bg-accent/30 py-16 sm:py-20"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <div className="highlight-chip">Building now</div>
          <h2 className="section-title">Two products, both mine</h2>
          <p className="section-subtitle mx-auto">
            Not side projects with a landing page — registered, in private beta,
            and built on the same problems I get paid to solve.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {data.initiatives.map((item) => (
            <a
              key={item.name}
              href={item.link}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex flex-col rounded-lg border border-transparent bg-background p-6 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start gap-4">
                <Media item={item} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <ArrowUpRight
                      className="text-muted-foreground h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </div>
                  <p className="text-primary mt-1 text-sm font-medium">
                    {item.tagline}
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mt-4 flex-1 text-sm leading-relaxed">
                {item.description}
              </p>

              <p className="border-border/60 text-muted-foreground mt-5 flex items-start gap-2 border-t pt-4 text-sm leading-relaxed">
                <ShieldCheck
                  className="text-primary mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden
                />
                <span>{item.proof}</span>
              </p>

              <p className="text-muted-foreground mt-4 text-xs font-medium uppercase tracking-wider">
                {item.status}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Initiatives;
