import data from "@/data/data.json";
import { SECTIONS } from "@/learn/registry";

/**
 * The slice of the site's copy the persistent shell needs: names, links,
 * section and page titles. Written to src/data/nav.generated.json by
 * `npm run nav`, so the shell — which every route loads first — does not pull
 * in all of data.json, every strategy note and the options engine just to draw
 * a sidebar. Only build scripts import this file; the smoke test fails if the
 * generated copy has drifted from what this returns.
 */
export function buildNavData() {
  return {
    name: data.name,
    chip: data.chip,
    social: data.social.map(({ name, id, link }) => ({ name, id, link })),
    tools: data.teaching.tools.map(({ name, short, href, topic }) => ({
      name,
      short,
      href,
      topic,
    })),
    sections: SECTIONS.map((section) => ({
      id: section.id,
      title: section.title,
      pages: section.pages.map((page) => ({
        slug: page.slug,
        title: page.title,
        group: page.group ?? null,
      })),
    })),
  };
}

export type NavData = ReturnType<typeof buildNavData>;

export const serialiseNavData = () => `${JSON.stringify(buildNavData(), null, 2)}\n`;
