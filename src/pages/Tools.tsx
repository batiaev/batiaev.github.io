import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import ToolList from "@/components/tools/ToolList";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import data from "@/data/data.json";

const Tools = () => {
  const { chip, title, subtitle } = data.toolsPage;

  useDocumentMeta(ROUTE_META["/tools"]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header />
      <main>
        <PageHero
          back={{ to: "/", label: "Back to home" }}
          chip={chip}
          title={title}
        >
          <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
            {subtitle}
          </p>
        </PageHero>

        <section className="py-8 sm:py-14">
          <div className="container mx-auto px-4">
            <ToolList tools={data.teaching.tools} heading="h2" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
