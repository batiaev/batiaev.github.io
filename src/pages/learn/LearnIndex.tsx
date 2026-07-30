import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import { LearnSectionTabs } from "@/components/learn/LearnNav";
import { SECTIONS, learnPath } from "@/learn/registry";

const LearnSearch = lazy(() => import("@/components/learn/LearnSearch"));

const LearnIndex = () => {
  useDocumentMeta(ROUTE_META["/learn"]);

  // A cold load of /learn#risk lands at the top: the browser looks for the
  // anchor before React has rendered it. Repeat the scroll once it exists, so
  // a link to a section is worth sharing.
  React.useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    requestAnimationFrame(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header />
      <main>
        <PageHero
          back={{ to: "/", label: "Back to home" }}
          chip="Domain depth"
          title="From the inside"
        >
          <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
            A deliberately narrow set of subjects: options pricing, the risk
            systems underneath them, and the reading that shaped how I think
            about both. I have built each of these in production — a
            derivatives pricing engine and SPAN margining for 400k
            investors, a greenfield risk system at Revolut, execution and
            hedging at scale. Explanations of this material are not scarce.
            Knowing which details decide whether it holds up is.
          </p>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Every page that carries a number runs on the same pricing engine
            as the calculators, so nothing here can describe a shape the
            tools do not produce.
          </p>
          <div className="mt-6 max-w-md">
            <Suspense fallback={<div className="h-10" />}>
              <LearnSearch />
            </Suspense>
          </div>

          {/* A jump list rather than a scroll: the sections are the shape of
              the thing, and there will be more of them. On a phone the same
              list is pinned under the header instead, just below. */}
          <nav
            aria-label="Sections"
            className="mt-6 hidden flex-wrap gap-2 sm:flex"
          >
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="nav-pill"
              >
                {section.title}
                <span className="text-muted-foreground/70 text-xs tabular-nums">
                  {section.pages.length}
                </span>
              </a>
            ))}
          </nav>
        </PageHero>

        <LearnSectionTabs />

        <section className="py-10 sm:py-14">
          <div className="container mx-auto space-y-12 px-4">
            {SECTIONS.map((section) => (
              <div
                key={section.id}
                id={section.id}
                /* Clears the header and, on a phone, the pinned section tabs. */
                className="scroll-mt-[8rem] sm:scroll-mt-24"
              >
                <div className="mb-5 max-w-2xl">
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-display text-2xl font-semibold tracking-tight">
                      {section.title}
                    </h2>
                    <span className="text-muted-foreground text-sm tabular-nums">
                      {section.pages.length}{" "}
                      {section.pages.length === 1 ? "page" : "pages"}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {section.blurb}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {section.pages.map((page) => (
                    <Link
                      key={page.slug}
                      to={learnPath(page.slug)}
                      className="group flex flex-col rounded-lg border border-transparent bg-background p-4 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-5"
                    >
                      <h3 className="mb-2 font-semibold">{page.title}</h3>
                      <p className="text-muted-foreground mb-3 line-clamp-2 flex-1 text-sm leading-relaxed sm:line-clamp-none">
                        {page.summary}
                      </p>
                      <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                        Read
                        <ArrowRight
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LearnIndex;
