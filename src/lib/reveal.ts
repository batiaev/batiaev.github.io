const REVEAL_CLASS = "reveal-on-scroll";
const REVEALED_CLASS = "is-revealed";

/** Matches the guard the hero dot-field already used, so the whole site agrees. */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Fires as soon as any sliver is on screen, a touch before the edge. */
const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0,
  rootMargin: "0px 0px -5% 0px",
};

/**
 * Fades elements in as they enter the viewport.
 *
 * This replaces nine near-identical copies of the same effect, all of which
 * were wrong in the same way: `threshold: 0.1` asks for a tenth of the element
 * to be on screen, which is fine for a card and broken for a section. The
 * experience list is ~4,900px tall on a phone, so a tenth of it is 488px —
 * the heading stayed invisible until you had already scrolled well past it,
 * and the hero CTA jumped you to what looked like a blank page.
 *
 * Once revealed an element is unobserved, so it can never fade back out.
 */
export function revealOnScroll(
  elements: readonly (Element | null | undefined)[],
): () => void {
  const targets = elements.filter((el): el is Element => Boolean(el));
  if (targets.length === 0) return () => {};

  // Someone who asked for less motion gets the content, not the animation.
  if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
    targets.forEach((el) => el.classList.add(REVEALED_CLASS));
    return () => {};
  }

  // Only hide once we know we can reveal again: if this module never runs, the
  // prerendered markup stays visible, which is the right way to fail.
  targets.forEach((el) => el.classList.add(REVEAL_CLASS));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add(REVEALED_CLASS);
      observer.unobserve(entry.target);
    });
  }, OBSERVER_OPTIONS);

  targets.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

/**
 * Adds `className` to each element in turn as the group scrolls into view.
 *
 * The version this replaces stashed the delay in a `data-delay` attribute and
 * never cleared its timers, so unmounting mid-stagger left them running against
 * detached nodes.
 */
export function staggerIn(
  elements: readonly (Element | null | undefined)[],
  className: string,
  stepMs = 100,
): () => void {
  const targets = elements.filter((el): el is Element => Boolean(el));
  if (targets.length === 0) return () => {};

  // No animation to stagger: the cards are simply present.
  if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
    return () => {};
  }

  const timers: ReturnType<typeof setTimeout>[] = [];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const step = Math.max(targets.indexOf(entry.target), 0) * stepMs;
      timers.push(
        setTimeout(() => entry.target.classList.add(className), step),
      );
    });
  }, OBSERVER_OPTIONS);

  targets.forEach((el) => observer.observe(el));

  return () => {
    observer.disconnect();
    timers.forEach(clearTimeout);
  };
}
