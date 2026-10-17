import React from "react";
import LearnLayout from "@/components/learn/LearnLayout";
import StrategyFigure from "@/components/learn/StrategyFigure";
import HedgeFigure from "@/components/learn/HedgeFigure";

import Basics from "@/learn/content/options-basics.mdx";
import Greeks from "@/learn/content/options-greeks.mdx";
import Volatility from "@/learn/content/options-volatility.mdx";
import Span from "@/learn/content/risk-span.mdx";
import VarAndEs from "@/learn/content/risk-var-and-es.mdx";
import Dv01 from "@/learn/content/risk-dv01.mdx";
import DynamicHedging from "@/learn/content/risk-dynamic-hedging.mdx";
import MarketData from "@/learn/content/markets-market-data.mdx";
import MarketMaking from "@/learn/content/markets-market-making.mdx";
import Execution from "@/learn/content/markets-execution.mdx";
import Harness from "@/learn/content/ai-harness.mdx";
import AgenticWorkflows from "@/learn/content/ai-agentic-workflows.mdx";
import KnowledgeBases from "@/learn/content/ai-knowledge-bases.mdx";
import ProductEngineering from "@/learn/content/ai-product-engineering.mdx";
import LibraryBooks from "@/learn/content/library-books.mdx";
import LibrarySeries from "@/learn/content/library-series.mdx";
import LibraryFilms from "@/learn/content/library-films.mdx";

/** Components an .mdx file may use without importing them. */
const components = { StrategyFigure, HedgeFigure };

const BODIES: Record<string, React.ComponentType<{ components?: unknown }>> = {
  "options/basics": Basics,
  "options/greeks": Greeks,
  "options/volatility": Volatility,
  "risk/span": Span,
  "risk/var-and-es": VarAndEs,
  "risk/dv01": Dv01,
  "risk/dynamic-hedging": DynamicHedging,
  "markets/market-data": MarketData,
  "markets/market-making": MarketMaking,
  "markets/execution": Execution,
  "ai/harness": Harness,
  "ai/agentic-workflows": AgenticWorkflows,
  "ai/knowledge-bases": KnowledgeBases,
  "ai/product-engineering": ProductEngineering,
  "library/books": LibraryBooks,
  "library/series": LibrarySeries,
  "library/films": LibraryFilms,
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
