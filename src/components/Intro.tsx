import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Linkedin, Layers, ArrowRight } from "lucide-react";
import data from "@/data/data.json";
import { socialLink } from "@/lib/social";
import { shouldEnableDotField, isNarrowViewport } from "@/lib/dotFieldGuards";

const Intro = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || !shouldEnableDotField()) return;

    let destroyed = false;
    let instance: { destroy: () => void } | null = null;

    const narrow = isNarrowViewport();

    import("@batiaev/dot-field").then(({ DotField }) => {
      if (destroyed || !heroRef.current) return;
      instance = DotField.init(heroRef.current, {
        background: "#f8fafc",
        dotColor: "#64748b",
        hotAlpha: narrow ? 0.18 : 0.28,
        fps: narrow ? 24 : 30,
        areaCount: narrow ? 2 : 3,
        hotCount: narrow ? 2 : 3,
        pulseAmount: 0.12,
      });
    });

    return () => {
      destroyed = true;
      instance?.destroy();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative isolate min-h-[70vh] overflow-hidden py-16 sm:py-20 md:py-28"
    >
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] bg-background/75 px-4 py-10 text-center shadow-subtle backdrop-blur-md sm:px-12 sm:py-14">
          <div className="highlight-chip">{data.chip}</div>

          <h1 className="font-display mb-4 mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {data.name}
          </h1>

          <p className="text-primary mb-6 text-lg font-medium sm:text-xl md:text-2xl">
            {data.headline}
          </p>

          <p className="text-muted-foreground mb-4 max-w-2xl text-base leading-relaxed sm:text-lg">
            {data.description}
          </p>

          <p className="text-muted-foreground mb-8 max-w-2xl text-sm leading-relaxed sm:text-base">
            {data.currentRole}
          </p>

          <div className="flex w-full max-w-lg flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Button size="lg" className="min-h-11 px-6 font-medium" asChild>
              <a href="#building">
                <Layers className="mr-2 h-5 w-5" aria-hidden />
                See what I&apos;m building
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-11 bg-background/80 px-6 font-medium backdrop-blur-sm"
              asChild
            >
              <a
                href={socialLink("linkedin")}
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="mr-2 h-5 w-5" aria-hidden />
                LinkedIn
              </a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="min-h-11 px-6 font-medium"
              asChild
            >
              <a href="#engage">
                Ways to engage
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
