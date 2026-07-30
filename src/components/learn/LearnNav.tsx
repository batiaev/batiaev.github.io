import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, List } from "lucide-react";
import { SECTIONS, learnPath, pageBySlug } from "@/learn/registry";

const LearnSearch = lazy(() => import("@/components/learn/LearnSearch"));

/** The whole tree. The sidebar on a desktop, the dropdown on a phone. */
export const LearnTree = ({
  current,
  onNavigate,
}: {
  current: string;
  onNavigate?: () => void;
}) => (
  <nav aria-label="Knowledge base" className="text-sm">
    {SECTIONS.map((section) => (
      <div key={section.id} className="mb-6 last:mb-0">
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
                  onClick={onNavigate}
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
 * Knowledge-base navigation on a phone.
 *
 * The sidebar used to render above the article on a small screen: twenty-odd
 * links, and the note you had just tapped through to started a screen and a half
 * down. This is the same information in the two moves that are actually used —
 * search, and jump to another page — pinned under the header so they are
 * available from anywhere in a long note, with the full tree one tap away.
 */
export const LearnMobileNav = ({ slug }: { slug: string }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const container = useRef<HTMLDivElement>(null);
  const page = pageBySlug(slug);
  const section = SECTIONS.find((s) => s.id === page?.section);

  useEffect(() => setOpen(false), [location.pathname]);

  // Tapping the article, or Escape, closes the contents panel.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={container}
      className="border-border/40 bg-background/95 sticky top-[var(--header-h)] z-30 -mx-4 border-b px-4 py-2 backdrop-blur md:-mx-8 md:px-8 lg:hidden"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="learn-contents"
          className="border-border/60 text-muted-foreground hover:text-foreground inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-md border px-2.5 text-sm transition-colors"
        >
          <List className="h-4 w-4" aria-hidden />
          Contents
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
        <div className="min-w-0 flex-1">
          <Suspense fallback={<div className="h-10" />}>
            <LearnSearch compact />
          </Suspense>
        </div>
      </div>

      {open ? (
        <div
          id="learn-contents"
          className="border-border/40 bg-background animate-fade-in absolute left-0 right-0 top-full max-h-[70vh] overflow-y-auto border-b px-4 py-4 shadow-elevated"
        >
          <LearnTree current={slug} onNavigate={() => setOpen(false)} />
        </div>
      ) : null}

      {/* The siblings of this page, in reading order — the move the prev/next
          footer serves at the bottom of a note, available at the top of it. */}
      {section ? (
        <nav
          aria-label={`${section.title} notes`}
          className="scroll-row mt-2 lg:hidden"
        >
          {section.pages.map((other) => (
            <SiblingPill
              key={other.slug}
              to={learnPath(other.slug)}
              active={other.slug === slug}
            >
              {other.title}
            </SiblingPill>
          ))}
        </nav>
      ) : null}
    </div>
  );
};

/** Scrolls itself into view when it is the current page. */
const SiblingPill = ({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (active) {
      ref.current?.scrollIntoView({ block: "nearest", inline: "center" });
    }
  }, [active]);

  return (
    <Link
      ref={ref}
      to={to}
      aria-current={active ? "page" : undefined}
      className="nav-pill max-w-[14rem] truncate"
    >
      {children}
    </Link>
  );
};

/**
 * Which section the index is currently showing.
 *
 * Reads the section headings against the top of the viewport rather than using
 * intersection ratios: with sections of three and eleven cards, "most visible"
 * picks the tallest one, not the one you are looking at.
 */
function useVisibleSection(): string {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const onScroll = () => {
      // Just below the header and the tabs themselves.
      const line = 160;
      const current = SECTIONS.reduce((found, section) => {
        const top = document.getElementById(section.id)?.getBoundingClientRect()
          .top;
        return top !== undefined && top <= line ? section.id : found;
      }, SECTIONS[0].id);
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return active;
}

/**
 * Section tabs for the index, pinned under the header on a phone. Anchors
 * rather than routes: the sections are all on the one page, and the tab tracks
 * which one you have scrolled to.
 */
export const LearnSectionTabs = () => {
  const active = useVisibleSection();

  return (
    <div className="border-border/40 bg-background/95 sticky top-[var(--header-h)] z-30 border-b px-4 py-2 backdrop-blur sm:hidden">
      <nav aria-label="Sections" className="scroll-row">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={section.id === active ? "location" : undefined}
            className="nav-pill"
          >
            {section.title}
            <span className="text-muted-foreground/70 text-xs tabular-nums">
              {section.pages.length}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
};
