import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Library } from "lucide-react";
import PageHero, { Lede } from "@/components/PageHero";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import { SECTION_ICONS } from "@/lib/nav";
import { LearnSectionTabs } from "@/components/learn/LearnNav";
import { ALL_PAGES, SECTIONS, learnPath } from "@/learn/registry";

const LearnSearch = lazy(() => import("@/components/learn/LearnSearch"));

const slugify = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const LearnIndex = () => {
  useDocumentMeta(ROUTE_META["/learn"]);

  return (
    <>
      <PageHero chip="Knowledge" title="From the inside">
        <Lede>
          Two subjects, both from the side of the people who build the
          systems. Markets: options pricing, the risk systems underneath
          them, market data, market making and execution — a derivatives
          pricing engine and SPAN margining for 400k investors, a greenfield
          risk system at Revolut, execution and hedging at scale. And AI
          engineering: the harness, the workflows and the knowledge layer
          behind building with agents every day. Explanations of this
          material are not scarce. Knowing which details decide whether it
          holds up is.
        </Lede>
        <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">
          Every page that carries a number runs on the same pricing engine as
          the calculators, so nothing here can describe a shape the tools do
          not produce.
        </p>
        <div className="mt-6 max-w-md">
          <Suspense fallback={<div className="h-10" />}>
            <LearnSearch />
          </Suspense>
        </div>
      </PageHero>

      <LearnSectionTabs />

      <div className="container mx-auto py-8 sm:py-10">
        {/* A jump list rather than a scroll: the sections are the shape of
            the thing. On a phone the same list is pinned under the header
            instead, just above. */}
        <nav
          aria-label="Sections"
          className="mb-10 hidden grid-cols-3 gap-2 sm:grid lg:grid-cols-6"
        >
          {SECTIONS.map((section) => {
            const Icon = SECTION_ICONS[section.id] ?? Library;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="surface-link group flex flex-col gap-3 p-3"
              >
                <Icon className="text-muted-foreground group-hover:text-primary size-4 transition-colors" aria-hidden />
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[13px] font-medium">{section.title}</span>
                  <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                    {section.pages.length}
                  </span>
                </span>
              </a>
            );
          })}
        </nav>

        <div className="space-y-12">
          {SECTIONS.map((section) => {
            const Icon = SECTION_ICONS[section.id] ?? Library;
            return (
              <section
                key={section.id}
                id={section.id}
                /* Clears the header and, on a phone, the pinned section tabs. */
                className="scroll-mt-[7.5rem] sm:scroll-mt-20"
              >
                <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <div className="flex items-center gap-2.5">
                    <Icon className="text-primary size-4" aria-hidden />
                    <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
                    <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                      {section.pages.length} {section.pages.length === 1 ? "page" : "pages"}
                    </span>
                  </div>
                  <p className="text-muted-foreground max-w-xl text-[13px] leading-relaxed sm:text-right">
                    {section.blurb}
                  </p>
                </div>

                <ul className="border-border divide-border divide-y overflow-hidden rounded-lg border">
                  {section.pages.map((page, i) => (
                    <React.Fragment key={page.slug}>
                    {page.group && page.group !== section.pages[i - 1]?.group ? (
                      // The group's own anchor, so /learn#strategies — linked
                      // before strategies were folded into Options — still lands.
                      <li
                        id={slugify(page.group)}
                        role="presentation"
                        className="bg-muted/50 text-muted-foreground scroll-mt-[7.5rem] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] sm:scroll-mt-20"
                      >
                        {page.group}
                      </li>
                    ) : null}
                    <li>
                      <Link
                        to={learnPath(page.slug)}
                        className="hover:bg-accent/50 group grid gap-1 px-4 py-3 transition-colors focus-visible:bg-accent/50 focus-visible:outline-none sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)_1rem] sm:items-baseline sm:gap-6"
                      >
                        <h3 className="text-[14px] font-medium tracking-tight">{page.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 text-[13px] leading-relaxed lg:line-clamp-1">
                          {page.summary}
                        </p>
                        <ArrowRight
                          className="text-muted-foreground/50 group-hover:text-foreground hidden size-4 self-center transition-[transform,color] group-hover:translate-x-0.5 sm:block"
                          aria-hidden
                        />
                      </Link>
                    </li>
                    </React.Fragment>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <p className="text-muted-foreground mt-12 font-mono text-[11px] uppercase tracking-[0.08em]">
          {ALL_PAGES.length} pages · free · no signup ·{" "}
          <a href="/llms-full.txt" className="hover:text-foreground underline-offset-4 hover:underline">
            llms-full.txt
          </a>
        </p>
      </div>
    </>
  );
};

export default LearnIndex;
