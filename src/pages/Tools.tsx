import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import data from "@/data/data.json";

const Tools = () => {
  const { chip, title, subtitle } = data.toolsPage;

  useDocumentMeta(ROUTE_META["/tools"]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main>
        <section className="border-border/40 border-b py-10 sm:py-14">
          <div className="container mx-auto px-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground mb-6 inline-flex min-h-11 items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
            <div className="max-w-2xl">
              <div className="highlight-chip">{chip}</div>
              <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
                {subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.teaching.tools.map((tool) => (
                <Link
                  key={tool.href}
                  to={tool.href}
                  className="group flex flex-col rounded-lg border border-transparent bg-background p-6 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
                    {tool.topic}
                  </p>
                  <h2 className="mb-2 text-lg font-semibold">{tool.name}</h2>
                  <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                  <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
                    Open
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
