import React from "react";
import {
  BrainIcon,
  CalendarFoldIcon,
  CheckCircle2,
  CodeIcon,
  FileIcon,
  LinkIcon,
  LockIcon,
  MilestoneIcon,
  PuzzleIcon,
  Rocket,
  ShieldCheck,
  SirenIcon,
  TrendingUpIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";
import data from "@/data/data.json";

const ICONS: Record<string, LucideIcon> = {
  code: CodeIcon,
  trendingUp: TrendingUpIcon,
  "trending-up": TrendingUpIcon,
  shield: ShieldCheck,
  rocket: Rocket,
  puzzle: PuzzleIcon,
  file: FileIcon,
  siren: SirenIcon,
  zap: ZapIcon,
  wrench: WrenchIcon,
  brain: BrainIcon,
  milestone: MilestoneIcon,
  lock: LockIcon,
  link: LinkIcon,
  "calendar-fold": CalendarFoldIcon,
  checkCircle: CheckCircle2,
};

const iconFor = (name: string) => ICONS[name] ?? CheckCircle2;

const Services = () => (
  <section id="services" className="container mx-auto py-10 sm:py-12">
    <div className="highlight-chip">Engagement types</div>
    <h2 className="section-title">Three ways this usually starts</h2>
    <p className="section-subtitle">
      Scoped work with founders and investors. Fixed scope, written output, no
      retainer required.
    </p>

    <ul className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {data.services.map((service) => {
        const Icon = iconFor(service.logo);
        return (
          <li key={service.title} className="surface flex flex-col p-5">
            <span className="border-border bg-muted/60 text-foreground/80 mb-4 grid size-8 place-items-center rounded-md border">
              <Icon className="size-4" aria-hidden />
            </span>
            <h3 className="text-[15px] font-semibold tracking-tight">{service.title}</h3>
            <p className="text-muted-foreground mt-2 text-[13px] leading-relaxed">
              {service.description}
            </p>
            <ul className="border-border mt-4 space-y-2.5 border-t pt-4">
              {service.outcomes.map((outcome) => {
                const OutcomeIcon = iconFor(outcome.logo);
                return (
                  <li key={outcome.title} className="flex items-start gap-2.5 text-[13px] leading-snug">
                    <OutcomeIcon className="text-primary mt-0.5 size-3.5 shrink-0" aria-hidden />
                    <span>{outcome.title}</span>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  </section>
);

export default Services;
