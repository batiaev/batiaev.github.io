import React from "react";
import { ArrowRight, Handshake } from "lucide-react";
import { Link } from "react-router-dom";
import data from "@/data/data.json";

/** The advisory card at the foot of the home page, beside the contact options. */
const Engagement = () => {
  const card = data.advisoryCard;

  return (
    <Link
      id="engage"
      to={card.href}
      className="surface-link group flex h-full flex-col p-5 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <span className="border-border bg-muted/60 text-foreground/80 grid size-8 place-items-center rounded-md border">
          <Handshake className="size-4" aria-hidden />
        </span>
        <span className="tag">{card.chip}</span>
      </div>
      <h3 className="mt-4 text-[15px] font-semibold tracking-tight">{card.title}</h3>
      <p className="text-muted-foreground mt-1.5 flex-1 text-[13px] leading-relaxed">
        {card.description}
      </p>
      <span className="text-primary mt-4 inline-flex items-center gap-1 text-[13px] font-medium">
        {card.cta}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
};

export default Engagement;
