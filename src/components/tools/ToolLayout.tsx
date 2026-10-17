import React from "react";
import { Link } from "react-router-dom";
import PageHero, { Lede } from "@/components/PageHero";
import { TOOL_ICONS } from "@/lib/nav";
import data from "@/data/data.json";

/**
 * The width of the working area, which is the only thing that genuinely differs
 * between the calculators: a payoff chart with a legs table wants the full
 * container, a form of eight fields does not.
 */
const WIDTHS = {
  full: "container mx-auto",
  wide: "container mx-auto max-w-5xl",
  narrow: "container mx-auto max-w-4xl",
} as const;

interface Props {
  /** Route of this tool. Highlights it in the switcher and nothing else. */
  route: string;
  chip: string;
  title: string;
  intro: React.ReactNode;
  /** Second, smaller paragraph — provenance or a caveat about the defaults. */
  note?: React.ReactNode;
  width?: keyof typeof WIDTHS;
  children: React.ReactNode;
}

/**
 * Every tool sits at `/tools/…`, and once you are in one calculator the next one
 * you want is usually a sibling. The switcher is a segmented row — a single
 * swipeable strip on a phone, which is also how you reach the rest of the set
 * there without opening the menu.
 */
const ToolSwitcher = ({ route }: { route: string }) => (
  <nav aria-label="Calculators" className="scroll-row mt-6">
    {data.teaching.tools.map((tool) => {
      const Icon = TOOL_ICONS[tool.href];
      return (
        <Link
          key={tool.href}
          to={tool.href}
          className="nav-pill"
          aria-current={tool.href === route ? "page" : undefined}
        >
          {Icon ? <Icon className="size-3.5 opacity-70" aria-hidden /> : null}
          {tool.short}
        </Link>
      );
    })}
  </nav>
);

/**
 * Shared chrome for the calculators. Holding the header, the switcher and the
 * content widths in one place is what keeps six pages that were written weeks
 * apart from disagreeing about type sizes or spacing.
 */
const ToolLayout = ({
  route,
  chip,
  title,
  intro,
  note,
  width = "full",
  children,
}: Props) => (
  <>
    <PageHero chip={chip} title={title} footer={<ToolSwitcher route={route} />}>
      <Lede>{intro}</Lede>
      {note ? (
        <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">{note}</p>
      ) : null}
    </PageHero>

    {/* One vertical rhythm for the working area, so a tool cannot space its
        own blocks differently from the tool next to it. */}
    <section className="py-8 sm:py-10">
      <div className={`${WIDTHS[width]} space-y-8`}>{children}</div>
    </section>
  </>
);

export default ToolLayout;
