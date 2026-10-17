import React, { Suspense, lazy, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import Footer from "@/components/Footer";
import { useSidebarCollapsed } from "@/lib/theme";
import Sidebar, { Brand, SidebarFooter, SidebarNav } from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import ThemeMenu from "./ThemeMenu";

/* ⌘K carries the registry and the full-text index; neither belongs on a first
   load. The chunk is fetched when the search control is first approached. */
const loadCommandMenu = () => import("./CommandMenu");
const CommandMenu = lazy(loadCommandMenu);

/** What a lazy route shows while its chunk loads: the tile stays, empty. */
const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center" aria-busy>
    <div className="bg-muted-foreground/40 h-1 w-16 animate-pulse rounded-full" />
  </div>
);

/**
 * Animate only short hops, and only for people who have not asked for less
 * motion. A smooth scroll across eight screens of the home page is slow and
 * tells the reader nothing the jump does not; a short glide keeps them oriented.
 */
function scrollBehaviour(target: Element): ScrollBehavior {
  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return "auto";
  const distance = Math.abs(target.getBoundingClientRect().top);
  return distance <= window.innerHeight * 1.5 ? "smooth" : "auto";
}

/**
 * Scroll on navigation, which a persistent shell has to do for itself: a new
 * route starts at the top, a hash lands on its target. The target may belong
 * to a lazy section that has not rendered yet, so look for it for a few frames
 * before giving up.
 */
function useScrollOnNavigate() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    let frame = 0;
    const find = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) target.scrollIntoView({ behavior: scrollBehaviour(target), block: "start" });
      else if (tries++ < 30) frame = requestAnimationFrame(find);
    };
    frame = requestAnimationFrame(find);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
}

const isMac = () =>
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

/**
 * The application frame, after the dealing tool: a sticky sidebar on a tinted
 * canvas, a 48px header with the breadcrumb and search, and the page in an
 * inset tile. It is a layout route, so moving between pages swaps the tile's
 * contents and nothing else. The prerenderer and the smoke test wrap each page
 * in it too — pass `children` there, the router's outlet is used otherwise.
 *
 * The document keeps its one scroll. The tile is `overflow-clip`, not
 * `overflow-hidden`: clip rounds the corners without making the tile a scroll
 * container, which would silently break every sticky element inside it.
 */
const AppShell = ({ children }: { children?: React.ReactNode }) => {
  const [collapsed, toggleSidebar] = useSidebarCollapsed();
  const [searchOpen, setSearchOpen] = useState(false);
  // Mounted once — when idle, or on a first open that beats it — and kept.
  const [searchMounted, setSearchMounted] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mac, setMac] = useState(true);
  const { pathname } = useLocation();

  useScrollOnNavigate();
  useEffect(() => {
    if (searchOpen) setSearchMounted(true);
  }, [searchOpen]);

  // Off the critical path, but mounted (closed) before anyone reaches for ⌘K.
  // Mounting on open lost the first keystrokes: even with the chunk cached, a
  // lazy component suspends once on first render, so the input arrived late.
  useEffect(() => {
    let live = true;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(() => {
      loadCommandMenu().then(() => {
        if (live) setSearchMounted(true);
      });
    });
    return () => {
      live = false;
      cancel(handle);
    };
  }, []);
  useEffect(() => setMac(isMac()), []);
  useEffect(() => setSheetOpen(false), [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      const key = event.key.toLowerCase();
      if (key === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      } else if (key === "b") {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleSidebar]);

  return (
    <div className="bg-canvas flex min-h-svh overflow-x-clip">
      <a
        href="#main"
        className="bg-foreground text-background sr-only z-50 rounded-md px-3 py-2 text-sm focus:not-sr-only focus:fixed focus:left-3 focus:top-2"
      >
        Skip to content
      </a>

      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      <div className="flex min-w-0 flex-1 flex-col md:pb-2 md:pr-2">
        <header className="bg-canvas/85 supports-[backdrop-filter]:bg-canvas/70 border-border sticky top-0 z-30 flex h-12 shrink-0 items-center gap-1.5 border-b px-2 backdrop-blur-md md:border-b-0 md:px-1">
          <SheetPrimitive.Root open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetPrimitive.Trigger
              aria-label="Open navigation"
              className="text-muted-foreground hover:text-foreground grid size-9 place-items-center rounded-md md:hidden"
            >
              <Menu className="size-[18px]" aria-hidden />
            </SheetPrimitive.Trigger>
            <SheetPrimitive.Portal>
              <SheetPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/30 dark:bg-black/60" />
              <SheetPrimitive.Content
                aria-describedby={undefined}
                className="bg-canvas data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left fixed inset-y-0 left-0 z-50 flex w-[17rem] max-w-[85vw] flex-col border-r px-2 duration-200"
              >
                <SheetPrimitive.Title className="sr-only">Navigation</SheetPrimitive.Title>
                <div className="flex h-12 shrink-0 items-center">
                  <Brand onNavigate={() => setSheetOpen(false)} />
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto pb-4 pt-2">
                  <SidebarNav onNavigate={() => setSheetOpen(false)} />
                </div>
                <div className="pb-3">
                  <SidebarFooter />
                </div>
              </SheetPrimitive.Content>
            </SheetPrimitive.Portal>
          </SheetPrimitive.Root>

          <Breadcrumbs />

          <div className="ml-auto flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              onPointerEnter={loadCommandMenu}
              onFocus={loadCommandMenu}
              className="border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/20 hidden h-8 w-56 items-center gap-2 rounded-md border px-2.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex lg:w-64"
            >
              <Search className="size-3.5" aria-hidden />
              Search…
              <span className="ml-auto flex items-center gap-0.5">
                <kbd className="kbd">{mac ? "⌘" : "Ctrl"}</kbd>
                <kbd className="kbd">K</kbd>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="text-muted-foreground hover:text-foreground grid size-9 place-items-center rounded-md sm:hidden"
            >
              <Search className="size-[18px]" aria-hidden />
            </button>
            <ThemeMenu />
          </div>
        </header>

        <div className="bg-background md:border-border flex min-h-[calc(100svh-3.5rem)] flex-1 flex-col overflow-clip md:rounded-xl md:border md:shadow-[0_1px_3px_hsl(var(--foreground)/0.04)]">
          <main id="main" className="flex-1">
            <Suspense fallback={<RouteFallback />}>{children ?? <Outlet />}</Suspense>
          </main>
          <Footer />
        </div>
      </div>

      {searchMounted ? (
        <Suspense fallback={null}>
          <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default AppShell;
