import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { TOOL_ICONS } from "@/lib/nav";
import data from "@/data/data.json";

type Tool = (typeof data.teaching.tools)[number];

/**
 * The calculators, as tiles from sm up and as a plain list of rows below it.
 *
 * Six cards on a phone is 3,000px of scrolling to read six titles, and the
 * descriptions are what makes each card tall. On a small screen the name and
 * the topic are enough to choose with — the page you are choosing between is
 * one tap away — so the description only appears where it costs nothing.
 */
const ToolList = ({
  tools,
  heading: Heading = "h3",
}: {
  tools: Tool[];
  heading?: "h2" | "h3" | "h4";
}) => (
  <ul className="border-border grid border-y sm:grid-cols-2 sm:gap-3 sm:border-0 lg:grid-cols-3">
    {tools.map((tool) => {
      const Icon = TOOL_ICONS[tool.href];
      return (
        <li key={tool.href} className="border-border border-b last:border-b-0 sm:border-0">
          <Link
            to={tool.href}
            className="group flex items-center gap-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-full sm:flex-col sm:items-stretch sm:gap-0 sm:rounded-lg sm:border sm:border-border sm:bg-background sm:p-5 sm:transition-colors sm:hover:border-foreground/20 sm:hover:bg-accent/40"
          >
            <span className="flex items-center justify-between sm:mb-4">
              <span className="border-border bg-muted/60 text-foreground/80 grid size-8 place-items-center rounded-md border">
                {Icon ? <Icon className="size-4" aria-hidden /> : null}
              </span>
              <ArrowUpRight
                className="text-muted-foreground/60 group-hover:text-foreground hidden size-4 transition-colors sm:block"
                aria-hidden
              />
            </span>
            <span className="min-w-0 flex-1">
              <Heading className="text-[15px] font-semibold tracking-tight">{tool.name}</Heading>
              <span className="text-muted-foreground mt-0.5 block font-mono text-[11px] uppercase tracking-[0.08em] sm:mt-1">
                {tool.topic}
              </span>
              <span className="text-muted-foreground mt-3 hidden text-[13px] leading-relaxed sm:block">
                {tool.description}
              </span>
            </span>
            <ArrowUpRight className="text-muted-foreground size-4 shrink-0 sm:hidden" aria-hidden />
          </Link>
        </li>
      );
    })}
  </ul>
);

export default ToolList;
