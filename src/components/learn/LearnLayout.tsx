import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LearnMobileNav } from "@/components/learn/LearnNav";
import { useScrollSpy } from "@/components/shell/useScrollSpy";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { SECTIONS, learnPath, neighbours, pageBySlug, relatedPages } from "@/learn/registry";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
}

/**
 * "On this page", read from the rendered article. rehype-slug gives every h2
 * an id, so the contents cannot drift from the prose — and it is collected
 * after render, so the prerendered markup and the first client render agree.
 */
function useHeadings(slug: string): Heading[] {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLHeadingElement>("article.prose-page h2[id]");
    setHeadings(
      Array.from(nodes).map((node) => ({ id: node.id, text: node.textContent ?? "" })),
    );
  }, [slug]);

  return headings;
}

const OnThisPage = ({ slug }: { slug: string }) => {
  const headings = useHeadings(slug);
  const ids = useMemo(() => headings.map((h) => h.id), [headings]);
  const active = useScrollSpy(ids, ids.length > 0);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="text-[13px]">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="border-border space-y-px border-l">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l py-1 pl-3 leading-snug transition-colors",
                heading.id === active
                  ? "border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

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
  const section = SECTIONS.find((s) => s.id === page?.section);
  const { previous, next } = neighbours(slug);
  const related = relatedPages(slug);

  useDocumentMeta({
    title: page ? `${page.title} — Learn | Anton Batiaev` : "Learn",
    description: page?.summary ?? "",
  });

  return (
    <div className="container mx-auto">
      <LearnMobileNav slug={slug} />

      <div className="mx-auto grid max-w-[64rem] grid-cols-1 gap-12 py-8 sm:py-12 xl:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="min-w-0 max-w-[44rem]">
          {page ? (
            <header className="border-border mb-8 border-b pb-8">
              <div className="highlight-chip">
                Knowledge{section ? ` · ${section.title}` : ""}
              </div>
              <h1 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.25rem]">
                {page.title}
              </h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-[17px]">
                {page.summary}
              </p>
              {page.tags.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Topics">
                  {page.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </header>
          ) : null}

          <article className="prose-page">{children}</article>

          {related.length > 0 ? (
            <section aria-label="Related pages" className="border-border mt-12 border-t pt-8">
              <h2 className="eyebrow mb-3">Related</h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {related.map((other) => (
                  <li key={other.slug}>
                    <Link to={learnPath(other.slug)} className="surface-link block h-full p-3">
                      <span className="block text-[13px] font-medium leading-snug">{other.title}</span>
                      <span className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                        {other.summary}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <nav
            aria-label="Adjacent pages"
            className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2"
          >
            {previous ? (
              <Link to={learnPath(previous.slug)} className="surface-link group flex flex-col gap-1 p-3">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                  Previous
                </span>
                <span className="text-[13px] font-medium">{previous.title}</span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next ? (
              <Link to={learnPath(next.slug)} className="surface-link group flex flex-col gap-1 p-3 sm:items-end sm:text-right">
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  Next
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="text-[13px] font-medium">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-[calc(var(--header-h)+2.5rem)]">
            <OnThisPage slug={slug} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LearnLayout;
