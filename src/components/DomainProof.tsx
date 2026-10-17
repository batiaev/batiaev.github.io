import React, { useEffect, useRef, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { revealOnScroll } from "@/lib/reveal";
import data from "@/data/data.json";

const HedgeFigure = lazy(() => import("@/components/learn/HedgeFigure"));

/**
 * The through-line as a table — the shape a risk report would take. Metric,
 * what was built, where. A reader scanning the first column gets the domain;
 * the third column gets them the employers.
 */
const DomainProof = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => revealOnScroll([sectionRef.current]), []);

  const { chip, title, subtitle, items } = data.domainProof;

  return (
    <section
      id="derivatives"
      className="border-border scroll-mt-14 border-t"
      ref={sectionRef}
    >
      <div className="container mx-auto py-12 sm:py-16">
        <div className="highlight-chip">{chip}</div>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>

        <div className="border-border overflow-hidden rounded-lg border">
          <table className="w-full border-collapse text-left">
            <thead className="bg-muted/50 hidden sm:table-header-group">
              <tr className="border-border border-b">
                <th scope="col" className="eyebrow w-48 px-4 py-2.5 font-medium sm:px-5">
                  Measure
                </th>
                <th scope="col" className="eyebrow px-4 py-2.5 font-medium">
                  What was built
                </th>
                <th scope="col" className="eyebrow w-44 px-4 py-2.5 text-right font-medium sm:px-5">
                  Where
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {items.map((item) => (
                <tr
                  key={item.claim}
                  className="hover:bg-accent/40 flex flex-col gap-1 px-4 py-3.5 transition-colors sm:table-row sm:p-0"
                >
                  <td className="text-foreground font-mono text-[13px] font-medium tabular-nums sm:px-5 sm:py-3.5">
                    {item.metric}
                  </td>
                  <td className="text-foreground/80 text-[14px] leading-relaxed sm:px-4 sm:py-3.5">
                    {item.claim}
                  </td>
                  <td className="text-muted-foreground text-[13px] sm:px-5 sm:py-3.5 sm:text-right">
                    {item.context}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Suspense fallback={null}>
            <HedgeFigure
              compact
              caption="Sell a thirty-day call at 25% implied and hedge it to expiry. The premium is not income — it is what the hedge is about to cost you."
              footer={
                <Link to="/learn/risk/dynamic-hedging" className="text-primary hover:underline">
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
