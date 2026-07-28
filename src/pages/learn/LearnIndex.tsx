import React, { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import { SECTIONS, learnPath } from "@/learn/registry";

const LearnSearch = lazy(() => import("@/components/learn/LearnSearch"));

const LearnIndex = () => {
  useDocumentMeta(ROUTE_META["/learn"]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main>
        <section className="border-border/40 border-b py-10 sm:py-14">
          <div className="container mx-auto px-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground mb-6 inline-flex min-h-11 items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
            <div className="max-w-2xl">
              <div className="highlight-chip">Notes</div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Options, plainly
              </h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
                What I wish someone had written down for me when I was building
                a pricing engine for the first time. Every strategy page carries
                a live payoff chart driven by the same model as the calculator,
                so nothing here can describe a shape the tool does not produce.
              </p>
              <div className="mt-6 max-w-md">
                <Suspense fallback={<div className="h-10" />}>
                  <LearnSearch />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="container mx-auto space-y-12 px-4">
            {SECTIONS.map((section) => (
              <div key={section.id}>
                <div className="mb-5 max-w-2xl">
                  <h2 className="font-display text-2xl font-semibold tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {section.blurb}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {section.pages.map((page) => (
                    <Link
                      key={page.slug}
                      to={learnPath(page.slug)}
                      className="group flex flex-col rounded-lg border border-transparent bg-background p-5 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <h3 className="mb-2 font-semibold">{page.title}</h3>
                      <p className="text-muted-foreground mb-3 flex-1 text-sm leading-relaxed">
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
