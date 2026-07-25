import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import data from "@/data/data.json";
import { socialLink } from "@/lib/social";

const Advisory = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main>
        <section className="border-border/40 border-b py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground mb-6 inline-flex min-h-11 items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to home
            </Link>
            <div className="mx-auto max-w-2xl text-center">
              <div className="highlight-chip">{data.advisoryIntro.chip}</div>
              <h1 className="section-title mt-4">{data.advisoryIntro.title}</h1>
              <p className="section-subtitle mx-auto">
                {data.advisoryIntro.subtitle}
              </p>
              <Button size="lg" className="mt-8 min-h-11 font-medium" asChild>
                <a
                  href={socialLink("calendar")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Calendar className="mr-2 h-5 w-5" aria-hidden />
                  Book a call
                </a>
              </Button>
            </div>
          </div>
        </section>

        <Services />
        <Testimonials />

        <section className="section bg-accent/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-semibold">Ready to talk?</h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
              Thirty minutes is usually enough to tell whether this is a fit.
            </p>
            <Button size="lg" className="min-h-11 font-medium" asChild>
              <a
                href={socialLink("calendar")}
                target="_blank"
                rel="noreferrer"
              >
                <Calendar className="mr-2 h-5 w-5" aria-hidden />
                Book a consultation
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Advisory;
