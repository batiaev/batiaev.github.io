import { useCallback, useEffect, useState } from "react";

export type ThemeChoice = "light" | "dark" | "system";

const THEME_KEY = "theme";
const SIDEBAR_KEY = "sidebar";

/*
 * Storage helpers that never throw. A private window or blocked site data
 * makes localStorage throw on access; the site then simply forgets, which is
 * the right way for a preference to fail.
 */
function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Preference not persisted; the current page still reflects it.
  }
}

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Mirrors the inline script in index.html, which runs before first paint. */
function apply(choice: ThemeChoice): void {
  const dark = choice === "dark" || (choice === "system" && systemPrefersDark());
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
}

function storedTheme(): ThemeChoice {
  const value = read(THEME_KEY);
  return value === "light" || value === "dark" ? value : "system";
}

/**
 * Light, dark or follow the system. The initial render always says "system" so
 * the prerendered markup and the first client render agree; the stored choice
 * is read on mount. The page itself is already painted in the right theme by
 * then, because the class on <html> was set before any of this ran.
 */
export function useTheme(): [ThemeChoice, (next: ThemeChoice) => void] {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  useEffect(() => setChoice(storedTheme()), []);

  useEffect(() => {
    if (choice !== "system" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [choice]);

  const update = useCallback((next: ThemeChoice) => {
    write(THEME_KEY, next);
    apply(next);
    setChoice(next);
  }, []);

  return [choice, update];
}

/** Whether <html> currently carries the dark class. */
export function isDark(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  );
}

/**
 * Calls back whenever the theme class on <html> changes — for the one piece
 * of the page that paints its own pixels, the hero dot field.
 */
export function onThemeChange(callback: () => void): () => void {
  if (typeof MutationObserver === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

/** Icon-only sidebar, toggled with ⌘B as in the dealing tool. */
export function useSidebarCollapsed(): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(document.documentElement.dataset.sidebar === "collapsed");
  }, []);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.sidebar !== "collapsed";
    if (next) root.dataset.sidebar = "collapsed";
    else delete root.dataset.sidebar;
    write(SIDEBAR_KEY, next ? "collapsed" : "open");
    setCollapsed(next);
  }, []);

  return [collapsed, toggle];
}
