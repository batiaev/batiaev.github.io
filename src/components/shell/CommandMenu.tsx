import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, CornerDownLeft, FileText, Search } from "lucide-react";
import { NAV, type NavItem } from "@/lib/nav";
import { ALL_PAGES, SECTIONS, learnPath, type LearnPage } from "@/learn/registry";
import { cn } from "@/lib/utils";
import data from "@/data/data.json";

type SearchModule = typeof import("@/learn/searchIndex");

interface Entry {
  key: string;
  group: string;
  label: string;
  href: string;
  icon: NavItem["icon"];
  hint?: string;
  /** Second line — a summary or the matching passage of a note. */
  detail?: string;
  haystack: string;
}

const NAV_ENTRIES: Entry[] = NAV.flatMap((group) =>
  group.items.map((item) => ({
    key: item.href,
    group: group.label,
    label: item.label,
    href: item.href,
    icon: item.icon,
    hint: group.id === "knowledge" ? `${item.badge} notes` : undefined,
    haystack: `${item.label} ${group.label} ${item.keywords ?? ""}`.toLowerCase(),
  })),
);

const sectionTitle = (page: LearnPage) =>
  SECTIONS.find((s) => s.id === page.section)?.title ?? "";

const noteEntry = (page: LearnPage, detail?: string): Entry => ({
  key: learnPath(page.slug),
  group: "Notes",
  label: page.title,
  href: learnPath(page.slug),
  icon: FileText,
  hint: sectionTitle(page),
  detail: detail ?? page.summary,
  haystack: "",
});

const matches = (haystack: string, terms: string[]) =>
  terms.every((term) => haystack.includes(term));

/**
 * ⌘K. Pages, sections and tools from the site map, and the knowledge base by
 * title — then by its full text, once the index has loaded. The prose index is
 * a separate chunk fetched the first time the menu opens, so the shell does not
 * carry thirty pages of text for people who never search.
 */
const CommandMenu = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchModule | null>(null);
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !index) {
      import("@/learn/searchIndex").then(setIndex).catch(() => {
        // Title search still works without the prose index.
      });
    }
    if (!open) setQuery("");
  }, [open, index]);

  const results = useMemo<Entry[]>(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return NAV_ENTRIES;

    const nav = NAV_ENTRIES.filter((entry) => matches(entry.haystack, terms));
    const notes = index
      ? index.search(query, 8).map((hit) => noteEntry(hit.page, hit.snippet))
      : ALL_PAGES.filter((page) =>
          matches(
            `${page.title} ${page.summary} ${page.tags.join(" ")}`.toLowerCase(),
            terms,
          ),
        )
          .slice(0, 8)
          .map((page) => noteEntry(page));

    return [...nav, ...notes];
  }, [query, index]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    onOpenChange(false);
    navigate(entry.href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(results[active]);
    }
  };

  let lastGroup = "";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px] dark:bg-black/60" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onKeyDown={onKeyDown}
          className="bg-popover text-popover-foreground border-border data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] fixed left-1/2 top-[12vh] z-50 flex max-h-[min(36rem,76vh)] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border shadow-elevated focus:outline-none"
        >
          <DialogPrimitive.Title className="sr-only">Search the site</DialogPrimitive.Title>
          <div className="border-border flex h-12 shrink-0 items-center gap-2.5 border-b px-3.5">
            <Search className="text-muted-foreground size-4 shrink-0" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages, notes and tools…"
              aria-label="Search"
              aria-controls="command-results"
              aria-activedescendant={results[active] ? `command-${active}` : undefined}
              role="combobox"
              aria-expanded
              className="placeholder:text-muted-foreground h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none"
            />
            <kbd className="kbd">esc</kbd>
          </div>

          <div
            ref={listRef}
            id="command-results"
            role="listbox"
            className="min-h-0 flex-1 overflow-y-auto p-1.5"
          >
            {results.length === 0 ? (
              <p className="text-muted-foreground px-3 py-8 text-center text-sm">
                Nothing matches “{query}”.
              </p>
            ) : (
              results.map((entry, i) => {
                const heading = entry.group !== lastGroup ? entry.group : null;
                lastGroup = entry.group;
                const Icon = entry.icon;
                const selected = i === active;
                return (
                  <React.Fragment key={entry.key + entry.group}>
                    {heading ? (
                      <div className="eyebrow px-2 pb-1 pt-2.5">{heading}</div>
                    ) : null}
                    <div
                      id={`command-${i}`}
                      role="option"
                      aria-selected={selected}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => go(entry)}
                      className={cn(
                        "flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-2 text-[13px]",
                        selected && "bg-accent",
                      )}
                    >
                      <Icon
                        className={cn(
                          "mt-px size-4 shrink-0",
                          selected ? "text-primary" : "text-muted-foreground",
                        )}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className="truncate font-medium">{entry.label}</span>
                          {entry.hint ? (
                            <span className="text-muted-foreground shrink-0 text-[11px]">
                              {entry.hint}
                            </span>
                          ) : null}
                        </span>
                        {entry.detail && query ? (
                          <span className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                            {entry.detail}
                          </span>
                        ) : null}
                      </span>
                      {selected ? (
                        <ArrowRight className="text-muted-foreground mt-px size-3.5 shrink-0" aria-hidden />
                      ) : null}
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </div>

          <div className="border-border text-muted-foreground flex h-9 shrink-0 items-center gap-4 border-t px-3.5 text-[11px]">
            <span className="flex items-center gap-1.5">
              <kbd className="kbd">↑</kbd>
              <kbd className="kbd">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="kbd">
                <CornerDownLeft className="size-3" aria-hidden />
              </kbd>
              open
            </span>
            <span className="ml-auto">{ALL_PAGES.length} notes · {data.teaching.tools.length} tools</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default CommandMenu;
