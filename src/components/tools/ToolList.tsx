import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import data from "@/data/data.json";

type Tool = (typeof data.teaching.tools)[number];

/**
 * The calculators, as cards from sm up and as a plain list of links below it.
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
  <ul className="border-border/60 grid border-t sm:grid-cols-2 sm:gap-6 sm:border-0 lg:grid-cols-3">
    {tools.map((tool) => (
      <li key={tool.href} className="border-border/60 border-b sm:border-0">
        <Link
          to={tool.href}
          className="group flex items-center justify-between gap-3 py-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-full sm:flex-col sm:items-start sm:rounded-lg sm:border sm:border-transparent sm:bg-background sm:p-6 sm:shadow-subtle sm:transition-colors sm:hover:border-border"
        >
          <span className="min-w-0 sm:flex-1">
            <span className="text-muted-foreground block text-xs font-medium uppercase tracking-wider sm:mb-2">
              {tool.topic}
            </span>
            <Heading className="mt-0.5 text-base font-semibold sm:mt-0 sm:text-lg">
              {tool.name}
            </Heading>
            <span className="text-muted-foreground mt-2 hidden text-sm leading-relaxed sm:block">
              {tool.description}
            </span>
          </span>
          <span className="text-primary flex shrink-0 items-center gap-1 text-sm font-medium sm:mt-4">
            <span className="sr-only sm:not-sr-only">Open</span>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </Link>
      </li>
    ))}
  </ul>
);

export default ToolList;
