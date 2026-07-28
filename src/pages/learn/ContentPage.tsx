import React from "react";
import LearnLayout from "@/components/learn/LearnLayout";
import StrategyFigure from "@/components/learn/StrategyFigure";

import Basics from "@/learn/content/options-basics.mdx";
import Greeks from "@/learn/content/options-greeks.mdx";
import Volatility from "@/learn/content/options-volatility.mdx";
import Span from "@/learn/content/risk-span.mdx";
import VarAndEs from "@/learn/content/risk-var-and-es.mdx";
import Dv01 from "@/learn/content/risk-dv01.mdx";
import LibraryBooks from "@/learn/content/library-books.mdx";
import LibrarySeries from "@/learn/content/library-series.mdx";
import LibraryFilms from "@/learn/content/library-films.mdx";

/** Components an .mdx file may use without importing them. */
const components = { StrategyFigure };

const BODIES: Record<string, React.ComponentType<{ components?: unknown }>> = {
  "options/basics": Basics,
  "options/greeks": Greeks,
  "options/volatility": Volatility,
  "risk/span": Span,
  "risk/var-and-es": VarAndEs,
  "risk/dv01": Dv01,
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
