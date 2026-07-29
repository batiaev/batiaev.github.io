import { pageBySlug } from "@/learn/registry";
import { ROUTE_META } from "@/lib/routeMeta";

const ORIGIN = "https://batiaev.com";
const AUTHOR = { "@type": "Person", name: "Anton Batiaev", url: `${ORIGIN}/` };

type Json = Record<string, unknown>;

function breadcrumbs(route: string): Json | null {
  const parts = route.split("/").filter(Boolean);
  if (parts.length === 0) return null;

  const crumbs = [{ name: "Home", url: `${ORIGIN}/` }];
  let path = "";
  parts.forEach((part) => {
    path += `/${part}`;
    const learn = path.startsWith("/learn/")
      ? pageBySlug(path.replace("/learn/", ""))
      : undefined;
    const meta = ROUTE_META[path];
    crumbs.push({
      name: learn?.title ?? meta?.title.split(" — ")[0] ?? titleise(part),
      url: `${ORIGIN}${path}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

function titleise(segment: string): string {
  return segment.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}

/**
 * Machine-readable description of a route, for search engines and for the
 * agents that increasingly read pages on someone's behalf. Emitted into the
 * static head at prerender time, so a crawler that runs no JavaScript sees it.
 */
export function structuredDataFor(route: string): Json[] {
  const blocks: Json[] = [];
  const crumbs = breadcrumbs(route);
  if (crumbs) blocks.push(crumbs);

  if (route.startsWith("/learn/")) {
    const page = pageBySlug(route.replace("/learn/", ""));
    if (page) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: page.title,
        description: page.summary,
        url: `${ORIGIN}${route}`,
        author: AUTHOR,
        publisher: AUTHOR,
        inLanguage: "en-GB",
        keywords: page.tags.join(", "),
        isAccessibleForFree: true,
        isPartOf: {
          "@type": "Collection",
          name: "From the inside",
          url: `${ORIGIN}/learn`,
        },
      });
    }
    return blocks;
  }

  if (route.startsWith("/tools/")) {
    const meta = ROUTE_META[route];
    if (meta) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: meta.title.split(" — ")[0].split(" | ")[0],
        description: meta.description,
        url: `${ORIGIN}${route}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any browser",
        author: AUTHOR,
        // Genuinely free with no account, which is the useful fact here.
        offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
      });
    }
    return blocks;
  }

  if (route === "/learn" || route === "/tools") {
    const meta = ROUTE_META[route];
    if (meta) {
      blocks.push({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: meta.title,
        description: meta.description,
        url: `${ORIGIN}${route}`,
        author: AUTHOR,
      });
    }
  }

  return blocks;
}
