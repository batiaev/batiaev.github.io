import React from "react";
import PageHero, { Lede } from "@/components/PageHero";
import ToolList from "@/components/tools/ToolList";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import data from "@/data/data.json";

const Tools = () => {
  const { chip, title, subtitle } = data.toolsPage;

  useDocumentMeta(ROUTE_META["/tools"]);

  return (
    <>
      <PageHero chip={chip} title={title}>
        <Lede>{subtitle}</Lede>
      </PageHero>

      <section className="py-8 sm:py-10">
        <div className="container mx-auto">
          <ToolList tools={data.teaching.tools} heading="h2" />
        </div>
      </section>
    </>
  );
};

export default Tools;
