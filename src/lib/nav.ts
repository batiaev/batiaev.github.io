import {
  AtSign,
  Bot,
  Briefcase,
  ChartScatter,
  ChartSpline,
  Gauge,
  Handshake,
  Hourglass,
  LayoutDashboard,
  Library,
  MessageSquareQuote,
  Mic,
  Radio,
  Receipt,
  Repeat2,
  Scale,
  Sigma,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import nav from "@/data/nav.generated.json";

/**
 * The site map, once. The sidebar, the mobile sheet, the ⌘K menu and the
 * breadcrumbs all read from here, so a page cannot be reachable from one and
 * missing from another.
 *
 * It reads the generated slice of the copy, never data.json or the registry:
 * this module is in the shell, and the shell is on every route's first load.
 * `npm run nav` regenerates the slice; the smoke test fails if it is stale.
 */

export const SITE = { name: nav.name, chip: nav.chip };
export const NAV_SECTIONS = nav.sections;
export const NAV_TOOLS = nav.tools;

export const learnPath = (slug: string) => `/learn/${slug}`;

const PAGES = new Map(
  nav.sections.flatMap((section) =>
    section.pages.map((page) => [page.slug, { ...page, section: section.id }] as const),
  ),
);

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Small trailing count, as the dealing tool shows on its sidebar groups. */
  badge?: number;
  /** Extra words the ⌘K filter matches on. */
  keywords?: string;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

/** The record half of the home page, in page order. */
export const HOME_SECTIONS = [
  { id: "experience", label: "Track record", icon: Briefcase, keywords: "experience roles career cv" },
  { id: "derivatives", label: "Through-line", icon: Waypoints, keywords: "derivatives pricing risk proof" },
  { id: "talks", label: "Talks & writing", icon: Mic, keywords: "conference podcast blog" },
] as const;

/**
 * Every anchored section of the home page, in page order, for scroll-spy —
 * including ones without a nav item of their own, so the highlight moves off
 * the last section once the reader has passed it.
 */
export const HOME_SPY_IDS = [
  "experience",
  "derivatives",
  "toolkit",
  "talks",
  "testimonials",
  "contact",
] as const;

export const SECTION_ICONS: Record<string, LucideIcon> = {
  options: Sigma,
  risk: Gauge,
  markets: Radio,
  ai: Bot,
  library: Library,
};

export const TOOL_ICONS: Record<string, LucideIcon> = {
  "/tools/options-pnl": ChartSpline,
  "/tools/hedging": Repeat2,
  "/tools/smile": ChartScatter,
  "/tools/retirement": Hourglass,
  "/tools/take-home": Receipt,
  "/tools/offer": Scale,
};

export const NAV: NavGroup[] = [
  {
    id: "profile",
    label: "Profile",
    items: [
      { label: "Overview", href: "/", icon: LayoutDashboard, keywords: "home about" },
      ...HOME_SECTIONS.map((section) => ({
        label: section.label,
        href: `/#${section.id}`,
        icon: section.icon,
        keywords: section.keywords,
      })),
    ],
  },
  {
    id: "knowledge",
    label: "Knowledge",
    items: nav.sections.map((section) => ({
      label: section.title,
      href: `/learn#${section.id}`,
      icon: SECTION_ICONS[section.id] ?? Library,
      badge: section.pages.length,
      keywords: section.pages.map((page) => page.title).join(" "),
    })),
  },
  {
    id: "tools",
    label: "Tools",
    items: nav.tools.map((tool) => ({
      label: tool.short,
      href: tool.href,
      icon: TOOL_ICONS[tool.href] ?? ChartSpline,
      keywords: `${tool.name} ${tool.topic}`,
    })),
  },
  // The way out, last: what others say, how an engagement works, how to reach
  // me — in the order someone deciding would want them.
  {
    id: "work",
    label: "Work with me",
    items: [
      { label: "Testimonials", href: "/#testimonials", icon: MessageSquareQuote, keywords: "feedback references what others say quotes" },
      { label: "Advisory", href: "/advisory", icon: Handshake, keywords: "diligence fractional cto consulting" },
      { label: "Contact", href: "/#contact", icon: AtSign, keywords: "email linkedin telegram calendar" },
    ],
  },
];

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Where a route sits, for the header. Derived from the same registry and tool
 * list as the sidebar, so the trail and the highlighted item always agree.
 */
export function crumbsFor(pathname: string): Crumb[] {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return [{ label: "Overview" }];
  if (path === "/advisory") return [{ label: "Work with me" }, { label: "Advisory" }];
  if (path === "/tools") return [{ label: "Tools" }];
  if (path === "/learn") return [{ label: "Knowledge" }];

  if (path.startsWith("/tools/")) {
    const tool = nav.tools.find((t) => t.href === path);
    return [{ label: "Tools", href: "/tools" }, { label: tool?.name ?? "Not found" }];
  }

  if (path.startsWith("/learn/")) {
    const page = PAGES.get(path.replace("/learn/", ""));
    const section = nav.sections.find((s) => s.id === page?.section);
    if (!page || !section) return [{ label: "Knowledge", href: "/learn" }, { label: "Not found" }];
    return [
      { label: "Knowledge", href: "/learn" },
      { label: section.title, href: `/learn#${section.id}` },
      { label: page.title },
    ];
  }

  return [{ label: "Not found" }];
}

/** The section a knowledge-base route belongs to, if any. */
export function learnSectionFor(pathname: string): string | undefined {
  if (!pathname.startsWith("/learn/")) return undefined;
  return PAGES.get(pathname.replace("/learn/", ""))?.section;
}
