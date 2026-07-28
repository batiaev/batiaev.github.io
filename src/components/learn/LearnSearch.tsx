import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { learnPath } from "@/learn/registry";
import { search } from "@/learn/searchIndex";

/**
 * Filters the knowledge base by title, summary, tags and body text.
 * Keyboard: `/` focuses it, arrows move, Enter opens, Escape clears.
 */
const LearnSearch = ({ compact = false }: { compact?: boolean }) => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const hits = useMemo(() => search(query), [query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
      return;
    }
    if (hits.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (current + 1) % hits.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (current - 1 + hits.length) % hits.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      navigate(learnPath(hits[active].page.slug));
      setQuery("");
    }
  };

  return (
    <div className="relative">
      <Search
        className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={compact ? "Search notes…" : "Search the notes…"}
        aria-label="Search the knowledge base"
        aria-expanded={hits.length > 0}
        role="combobox"
        aria-controls="learn-search-results"
        className="h-10 pl-9 pr-8"
      />
      {query ? (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 p-1"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      ) : (
        <kbd className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-xs sm:block">
          /
        </kbd>
      )}

      {query ? (
        <div
          id="learn-search-results"
          role="listbox"
          className="border-border bg-background absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-lg border shadow-elevated"
        >
          {hits.length === 0 ? (
            <p className="text-muted-foreground p-4 text-sm">
              Nothing matches “{query}”.
            </p>
          ) : (
            <ul className="p-1">
              {hits.map((hit, index) => (
                <li key={hit.page.slug}>
                  <Link
                    to={learnPath(hit.page.slug)}
                    onClick={() => setQuery("")}
                    onMouseEnter={() => setActive(index)}
                    role="option"
                    aria-selected={index === active}
                    className={`block rounded px-3 py-2 ${
                      index === active ? "bg-accent" : ""
                    }`}
                  >
                    <span className="block text-sm font-medium">
                      {hit.page.title}
                    </span>
                    <span className="text-muted-foreground mt-0.5 block text-xs leading-relaxed">
                      {hit.snippet}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default LearnSearch;
