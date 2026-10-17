import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Mail, MessageCircle, PanelLeft } from "lucide-react";
import { HOME_SPY_IDS, NAV, NAV_SECTIONS, SITE, learnPath, learnSectionFor, type NavItem } from "@/lib/nav";
import { socialLink } from "@/lib/social";
import { cn } from "@/lib/utils";
import { useScrollSpy } from "./useScrollSpy";


const SOCIAL = [
  { network: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { network: "github", label: "GitHub", Icon: Github },
  { network: "telegram", label: "Telegram", Icon: MessageCircle },
  { network: "email", label: "Email", Icon: Mail },
] as const;

const ITEM =
  "group/item relative flex h-8 w-full items-center gap-2.5 rounded-md px-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.045] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring collapsed:justify-center collapsed:px-0";

/** Raised chip on the canvas — the active item reads as a piece of the tile. */
const ACTIVE =
  "bg-background text-foreground shadow-[0_0_0_1px_hsl(var(--border)),0_1px_2px_hsl(var(--foreground)/0.05)] hover:bg-background";

function useActive() {
  const { pathname, hash } = useLocation();
  const onHome = pathname === "/";
  const spied = useScrollSpy(HOME_SPY_IDS, onHome);
  const learnSection = learnSectionFor(pathname);

  return (item: NavItem): boolean => {
    const [path, anchor] = item.href.split("#");
    if (path === "/" && !anchor) return onHome && spied === null;
    if (path === "/") return onHome && spied === anchor;
    if (path === "/learn" && anchor) {
      return learnSection === anchor || (pathname === "/learn" && hash === `#${anchor}`);
    }
    return pathname === path;
  };
}

/**
 * The nav itself — rendered by the desktop rail and by the mobile sheet, which
 * is why it takes `onNavigate` rather than knowing which one it is in.
 */
export const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  // The rail and the mobile sheet can both be in the DOM; keep label ids unique.
  const idPrefix = onNavigate ? "sheet-nav" : "rail-nav";
  const isActive = useActive();
  const { pathname } = useLocation();
  const learnSection = learnSectionFor(pathname);

  return (
    <nav aria-label="Site" className="flex flex-col gap-5">
      {NAV.map((group) => (
        <div key={group.id}>
          {/* A label, not a heading: as h2s these put "Profile, Knowledge,
              Tools" ahead of every page's h1 in the outline screen readers and
              crawlers walk. The list is named by it instead. */}
          <p
            id={`${idPrefix}-${group.id}`}
            className="eyebrow mb-1 flex h-6 items-center px-2 collapsed:sr-only"
          >
            {group.label}
          </p>
          <ul aria-labelledby={`${idPrefix}-${group.id}`} className="flex flex-col gap-px">
            {group.items.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              const sectionId = item.href.startsWith("/learn#")
                ? item.href.split("#")[1]
                : undefined;
              const expanded = sectionId !== undefined && sectionId === learnSection;
              const section = expanded
                ? NAV_SECTIONS.find((s) => s.id === sectionId)
                : undefined;

              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={item.label}
                    className={cn(ITEM, active && ACTIVE)}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        active ? "text-primary" : "text-muted-foreground/80 group-hover/item:text-foreground",
                      )}
                      aria-hidden
                    />
                    <span className="truncate collapsed:sr-only">{item.label}</span>
                    {item.badge !== undefined ? (
                      <span className="text-muted-foreground ml-auto font-mono text-[11px] tabular-nums collapsed:hidden">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>

                  {/* The open section's pages, nested under it — the tree the
                      old knowledge-base sidebar carried, now part of the one
                      navigation instead of a second one beside it. */}
                  {section ? (
                    <ul className="border-border ml-[1.05rem] mt-0.5 flex flex-col gap-px border-l py-0.5 pl-2 collapsed:hidden">
                      {section.pages.map((page, i) => {
                        const current = pathname === learnPath(page.slug);
                        // Options holds concepts and strategies; a small label
                        // where the group changes keeps fourteen titles scannable.
                        const groupStart =
                          page.group && page.group !== section.pages[i - 1]?.group;
                        return (
                          <React.Fragment key={page.slug}>
                          {groupStart ? (
                            <li
                              role="presentation"
                              className="text-muted-foreground px-2 pb-0.5 pt-2 font-mono text-[11px] uppercase tracking-[0.08em] first:pt-1"
                            >
                              {page.group}
                            </li>
                          ) : null}
                          <li>
                            <Link
                              to={learnPath(page.slug)}
                              onClick={onNavigate}
                              title={page.title}
                              aria-current={current ? "page" : undefined}
                              className={cn(
                                "relative block truncate rounded-md px-2 py-1 text-[12.5px] leading-5 transition-colors",
                                current
                                  ? "text-foreground bg-foreground/[0.05] font-medium before:bg-primary before:absolute before:-left-[9px] before:top-1.5 before:h-4 before:w-px"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {page.title}
                            </Link>
                          </li>
                          </React.Fragment>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export const Brand = ({ onNavigate }: { onNavigate?: () => void }) => (
  <Link
    to="/"
    onClick={onNavigate}
    className="flex min-w-0 items-center gap-2.5 rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <span
      aria-hidden
      className="bg-foreground text-background grid size-7 shrink-0 place-items-center rounded-md font-mono text-[11px] font-semibold tracking-tight transition-opacity collapsed:group-hover/rail:opacity-0"
    >
      AB
    </span>
    <span className="min-w-0 leading-tight collapsed:sr-only">
      <span className="block truncate text-[13px] font-semibold">{SITE.name}</span>
      <span className="text-muted-foreground block truncate text-[11px]">
        {SITE.chip} · London
      </span>
    </span>
  </Link>
);

export const SidebarFooter = () => (
  <div className="border-border flex items-center gap-0.5 border-t px-1 pt-3">
    {SOCIAL.map(({ network, label, Icon }) => (
      <a
        key={network}
        href={socialLink(network)}
        {...(network === "email" ? {} : { target: "_blank", rel: "noreferrer" })}
        aria-label={label}
        title={label}
        className="text-muted-foreground hover:text-foreground hover:bg-foreground/[0.045] grid size-8 place-items-center rounded-md transition-colors"
      >
        <Icon className="size-4" aria-hidden />
      </a>
    ))}
  </div>
);

/**
 * The desktop rail: sticky to the viewport rather than a scroll container of
 * its own around the page, so the document keeps the one scroll it always had
 * — anchors, scroll-reveal and sticky elements all depend on it.
 */
const Sidebar = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => (
  // `contents`, so the wrapper adds no box: it exists only to scope the
  // `collapsed:` variant to the rail, including the aside itself.
  <div data-rail className="contents">
  <aside
    className="group/rail sticky top-0 z-20 hidden h-svh w-60 shrink-0 flex-col px-2 transition-[width] duration-200 ease-out md:flex collapsed:w-14"
  >
    <div className="relative flex h-12 shrink-0 items-center justify-between gap-1">
      <Brand />
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={`${collapsed ? "Expand" : "Collapse"} sidebar (⌘B)`}
        className="text-muted-foreground hover:text-foreground hover:bg-foreground/[0.045] grid size-7 shrink-0 place-items-center rounded-md transition-[colors,opacity] collapsed:pointer-events-none collapsed:absolute collapsed:left-1.5 collapsed:top-2.5 collapsed:opacity-0 collapsed:group-hover/rail:pointer-events-auto collapsed:group-hover/rail:opacity-100"
      >
        <PanelLeft className="size-4" aria-hidden />
      </button>
    </div>

    <div className="-mx-2 min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-2 [scrollbar-width:none]">
      <SidebarNav />
    </div>

    <div className="pb-3 collapsed:hidden">
      <SidebarFooter />
    </div>
  </aside>
  </div>
);

export default Sidebar;
