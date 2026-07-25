import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ArrowUpRight } from "lucide-react";
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

        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
              <div className="highlight-chip">Three separate lines</div>
              <h2 className="section-title">Not one service — three</h2>
              <p className="section-subtitle mx-auto">
                Advisory, public talks, and angel investing are distinct
                engagements with different scopes and different asks.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
              {data.serviceLines.map((line) => (
                <a
                  key={line.title}
                  href={line.href}
                  className="group flex min-h-[10rem] flex-col rounded-lg border border-transparent bg-background p-6 shadow-subtle transition-colors hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <h3 className="mb-2 text-lg font-semibold">{line.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-1 text-sm leading-relaxed">
                    {line.description}
                  </p>
                  <span className="text-primary inline-flex min-h-11 items-center gap-1 text-sm font-medium">
                    {line.cta}
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <Services />
        <Testimonials />

        <section className="section bg-accent/30 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4 text-2xl font-semibold">Ready to talk?</h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-xl">
              Primary focus remains building and operating. If advisory,
              diligence, angel-aligned work, or talent conversations are a fit —
              book a short call.
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
