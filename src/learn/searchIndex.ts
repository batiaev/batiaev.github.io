import { ALL_PAGES, type LearnPage } from "./registry";
import generated from "./search-index.json";

/**
 * Search over the knowledge base.
 *
 * The body text is generated at build time by `scripts/llms-txt.ts` — the MDX
 * plugin is pre-enforced and claims .mdx before Vite's raw loader, so globbing
 * the sources with `?raw` in the client hands back compiled components rather
 * than text. A test fails if the generated index drifts from the registry.
 *
 * Only the lazily-loaded search UI imports this, so the prose lands in that
 * chunk and costs nothing until someone searches.
 */

const bodies = new Map(
  (generated as { slug: string; body: string }[]).map((entry) => [
    entry.slug,
    entry.body,
  ]),
);

export interface IndexedPage {
  page: LearnPage;
  /** Lower-cased haystack: title, summary, tags and body. */
  haystack: string;
  /** Body text, kept in original case for snippets. */
  body: string;
}

export const INDEX: IndexedPage[] = ALL_PAGES.map((page) => {
  const body = bodies.get(page.slug) ?? "";
  return {
    page,
    body,
    haystack: [page.title, page.summary, page.tags.join(" "), body]
      .join(" ")
      .toLowerCase(),
  };
});

/** Pages the generated index has no body for — a stale-index guard. */
export function missingFromIndex(): string[] {
  return ALL_PAGES.filter((page) => !bodies.get(page.slug)).map((p) => p.slug);
}

export interface SearchHit {
  page: LearnPage;
  /** Context around the first body match, for the result list. */
  snippet: string;
  score: number;
}

/**
 * Ranked substring search. Deliberately not fuzzy — over twenty pages a
 * predictable match beats a clever one, and every term must appear.
 */
export function search(query: string, limit = 8): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return INDEX.map(({ page, haystack, body }) => {
    if (!terms.every((term) => haystack.includes(term))) return null;

    const title = page.title.toLowerCase();
    const tags = page.tags.join(" ").toLowerCase();
    const summary = page.summary.toLowerCase();

    // Weight where the match landed: a title hit is a much stronger signal
    // than the word appearing somewhere in a thousand words of prose.
    const score = terms.reduce((total, term) => {
      if (title.includes(term)) return total + 10;
      if (tags.includes(term)) return total + 6;
      if (summary.includes(term)) return total + 4;
      return total + 1;
    }, 0);

    return { page, score, snippet: snippetFor(body, terms[0]) };
  })
    .filter((hit): hit is SearchHit => hit !== null)
    .sort((a, b) => b.score - a.score || a.page.title.localeCompare(b.page.title))
    .slice(0, limit);
}

function snippetFor(body: string, term: string): string {
  const at = body.toLowerCase().indexOf(term);
  if (at < 0) return body.slice(0, 140).trim();

  const start = Math.max(0, at - 60);
  const text = body.slice(start, start + 160).trim();
  return `${start > 0 ? "…" : ""}${text}…`;
}
