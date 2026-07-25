/** Whether DotField animation should run (skip on reduced motion / Save-Data / low-end). */
export function shouldEnableDotField(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };

  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) return false;

  const effective = nav.connection?.effectiveType;
  if (effective === "slow-2g" || effective === "2g") return false;

  return true;
}

export function isNarrowViewport(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(max-width: 768px)").matches;
}
