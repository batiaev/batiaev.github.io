import React from "react";
import LearnLayout from "@/components/learn/LearnLayout";
import StrategyFigure from "@/components/learn/StrategyFigure";

import Basics from "@/learn/content/options-basics.mdx";
import Greeks from "@/learn/content/options-greeks.mdx";
import Volatility from "@/learn/content/options-volatility.mdx";
import Span from "@/learn/content/risk-span.mdx";
import VarAndEs from "@/learn/content/risk-var-and-es.mdx";
import Dv01 from "@/learn/content/risk-dv01.mdx";
import Library from "@/learn/content/library.mdx";

/** Components an .mdx file may use without importing them. */
const components = { StrategyFigure };

const BODIES: Record<string, React.ComponentType<{ components?: unknown }>> = {
  "options/basics": Basics,
  "options/greeks": Greeks,
  "options/volatility": Volatility,
  "risk/span": Span,
  "risk/var-and-es": VarAndEs,
  "risk/dv01": Dv01,
  library: Library,
};

/** Renders one prose page; the chrome and metadata come from the registry. */
const ContentPage = ({ slug }: { slug: string }) => {
  const Body = BODIES[slug];
  if (!Body) return null;

  return (
    <LearnLayout slug={slug}>
      <Body components={components} />
    </LearnLayout>
  );
};

export default ContentPage;
