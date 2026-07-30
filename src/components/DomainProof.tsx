import React, { useEffect, useRef, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { revealOnScroll } from "@/lib/reveal";
import data from "@/data/data.json";

const HedgeFigure = lazy(() => import("@/components/learn/HedgeFigure"));

const DomainProof = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => revealOnScroll([sectionRef.current]), []);

  const { chip, title, subtitle, items } = data.domainProof;

  return (
    <section
      id="derivatives"
      className="border-border/40 border-t py-16 sm:py-20"
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

        <div className="mx-auto mt-12 max-w-3xl">
          <Suspense fallback={null}>
            <HedgeFigure
              compact
              caption="Sell a thirty-day call at 25% implied and hedge it to expiry. The premium is not income — it is what the hedge is about to cost you."
              footer={
                <Link
                  to="/learn/risk/dynamic-hedging"
                  className="text-primary hover:underline"
                >
                  Read the note →
                </Link>
              }
            />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default DomainProof;
