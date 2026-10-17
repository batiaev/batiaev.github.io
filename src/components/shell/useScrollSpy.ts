import { useEffect, useState } from "react";

/**
 * Which of a page's sections the reader is in.
 *
 * Reads section tops against a line just under the header rather than using
 * intersection ratios: with sections of very different heights, "most
 * visible" picks the tallest one, not the one being read. Starts as null so
 * the prerendered markup and the first client render agree.
 */
export function useScrollSpy(ids: readonly string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = 120;
      let current: string | null = null;
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) current = id;
      }
      // The last section rarely reaches the line on a tall screen; once the
      // page bottoms out, it is the one being read.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom && ids.length > 0 && document.getElementById(ids[ids.length - 1])) {
        current = ids[ids.length - 1];
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, enabled]);

  return active;
}
