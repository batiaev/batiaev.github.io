import React from "react";
import { useParams } from "react-router-dom";
import ContentPage from "@/pages/learn/ContentPage";
import StrategyPage from "@/pages/learn/StrategyPage";
import NotFound from "@/pages/NotFound";
import { pageBySlug } from "@/learn/registry";

/**
 * Resolves `/learn/*`. The registry decides what exists and which section a
 * page belongs to; strategy pages are generated from a template, everything
 * else is prose. Anything the registry does not know is a genuine 404 rather
 * than an empty shell.
 */
const LearnRoute = () => {
  const params = useParams();
  const slug = params["*"] ?? "";
  const page = pageBySlug(slug);

  if (!page) return <NotFound />;
  if (page.section === "strategies") return <StrategyPage slug={slug} />;
  return <ContentPage slug={slug} />;
};

export default LearnRoute;
