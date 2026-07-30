import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import data from "@/data/data.json";

/**
 * The width of the working area, which is the only thing that genuinely differs
 * between the calculators: a payoff chart with a legs table wants the full
 * container, a form of eight fields does not.
 */
const WIDTHS = {
  full: "container mx-auto px-4",
  wide: "container mx-auto max-w-5xl px-4",
  narrow: "container mx-auto max-w-4xl px-4",
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
 * Every tool sits at `/tools/…`, so the way back is the toolkit, not the home
 * page — and once you are in one calculator the next one you want is usually a
 * sibling. The switcher is a single swipeable row on a phone, which is also
 * how you reach the rest of the set there without going up a level first.
 */
const ToolSwitcher = ({ route }: { route: string }) => (
  <nav aria-label="Calculators" className="scroll-row mt-6">
    {data.teaching.tools.map((tool) => (
      <Link
        key={tool.href}
        to={tool.href}
        className="nav-pill"
        aria-current={tool.href === route ? "page" : undefined}
      >
        {tool.short}
      </Link>
    ))}
  </nav>
);

/**
 * Shared chrome for the calculators. Holding the hero, the switcher and the
 * content widths in one place is what keeps six pages that were written weeks
 * apart from disagreeing about type sizes or where "back" goes.
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
  <div className="flex min-h-screen flex-col overflow-x-clip">
    <Header />
    <main>
      <PageHero
        back={{ to: "/tools", label: "All tools" }}
        chip={chip}
        title={title}
        footer={<ToolSwitcher route={route} />}
      >
        <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
          {intro}
        </p>
        {note ? (
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            {note}
          </p>
        ) : null}
      </PageHero>

      {/* One vertical rhythm for the working area, so a tool cannot space its
          own blocks differently from the tool next to it. */}
      <section className="py-8 sm:py-12">
        <div className={`${WIDTHS[width]} space-y-8`}>{children}</div>
      </section>
    </main>
    <Footer />
  </div>
);

export default ToolLayout;
