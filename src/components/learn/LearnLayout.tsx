import React, { Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import {
  SECTIONS,
  learnPath,
  neighbours,
  pageBySlug,
  relatedPages,
} from "@/learn/registry";

// The search index carries the full prose, so it loads only when rendered.
const LearnSearch = lazy(() => import("@/components/learn/LearnSearch"));

const Sidebar = ({ current }: { current: string }) => (
  <nav aria-label="Knowledge base" className="text-sm">
    {SECTIONS.map((section) => (
      <div key={section.id} className="mb-6">
        <h2 className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
          {section.title}
        </h2>
        <ul className="space-y-0.5">
          {section.pages.map((page) => {
            const active = page.slug === current;
            return (
              <li key={page.slug}>
                <Link
                  to={learnPath(page.slug)}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded px-2 py-1.5 leading-snug transition-colors ${
                    active
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {page.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    ))}
  </nav>
);

/**
 * Shared chrome for every knowledge-base page. Content pages supply only their
 * body; the title, description, navigation and neighbours all come from the
 * registry, so they cannot disagree with the sidebar.
 */
const LearnLayout = ({
  slug,
  children,
}: {
  slug: string;
  children: React.ReactNode;
}) => {
  const page = pageBySlug(slug);
  const { previous, next } = neighbours(slug);
  const related = relatedPages(slug);
  const location = useLocation();

  useDocumentMeta({
    title: page ? `${page.title} — Learn | Anton Batiaev` : "Learn",
    description: page?.summary ?? "",
  });

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Link
              to="/learn"
              className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              All notes
            </Link>
            <div className="mb-6">
              <Suspense fallback={<div className="h-10" />}>
                <LearnSearch compact />
              </Suspense>
            </div>
            <Sidebar current={slug} />
          </aside>

          <div className="min-w-0">
            <article className="prose-page">
              {page ? (
                <header className="mb-8">
                  <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    {page.title}
                  </h1>
                  <p className="text-muted-foreground mt-3 text-base leading-relaxed sm:text-lg">
                    {page.summary}
                  </p>
                </header>
              ) : null}
              {children}
            </article>

            {page && page.tags.length > 0 ? (
              <ul className="mt-10 flex flex-wrap gap-2" aria-label="Topics">
                {page.tags.map((tag) => (
                  <li
                    key={tag}
                    className="bg-accent text-accent-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}

            {related.length > 0 ? (
              <section
                aria-label="Related pages"
                className="border-border/40 mt-8 border-t pt-6"
              >
                <h2 className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
                  Related
                </h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {related.map((other) => (
                    <li key={other.slug}>
                      <Link
                        to={learnPath(other.slug)}
                        className="border-border/60 hover:border-border block h-full rounded-lg border p-3 transition-colors"
                      >
                        <span className="block text-sm font-medium">
                          {other.title}
                        </span>
                        <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                          {other.summary.slice(0, 90)}…
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <nav
              aria-label="Adjacent pages"
              className="border-border/40 mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between"
            >
              {previous ? (
                <Link
                  to={learnPath(previous.slug)}
                  className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
                >
                  <ArrowLeft
                    className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                    aria-hidden
                  />
                  {previous.title}
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  to={learnPath(next.slug)}
                  className="group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm sm:text-right"
                >
                  {next.title}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              ) : null}
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearnLayout;
