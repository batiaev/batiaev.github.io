import React from "react";
import { Calendar, Mail } from "lucide-react";
import PageHero, { Lede } from "@/components/PageHero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import data from "@/data/data.json";
import { socialLink } from "@/lib/social";

const BookCall = ({ label }: { label: string }) => (
  <Button className="min-h-10" asChild>
    <a href={socialLink("calendar")} target="_blank" rel="noreferrer">
      <Calendar aria-hidden />
      {label}
    </a>
  </Button>
);

const Advisory = () => {
  useDocumentMeta(ROUTE_META["/advisory"]);

  return (
    <>
      <PageHero
        chip={data.advisoryIntro.chip}
        title={data.advisoryIntro.title}
        actions={
          <>
            <Button variant="outline" className="min-h-10" asChild>
              <a href={socialLink("email")}>
                <Mail aria-hidden />
                Email
              </a>
            </Button>
            <BookCall label="Book a call" />
          </>
        }
      >
        <Lede>{data.advisoryIntro.subtitle}</Lede>
      </PageHero>

      <Services />
      <Testimonials />

      <section className="border-border border-t">
        <div className="container mx-auto flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Ready to talk?</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Thirty minutes is usually enough to tell whether this is a fit.
            </p>
          </div>
          <BookCall label="Book a consultation" />
        </div>
      </section>
    </>
  );
};

export default Advisory;
