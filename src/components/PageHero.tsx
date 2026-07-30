import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/** The way out of a leaf page, in the one place every leaf page takes it from. */
export const BackLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="text-muted-foreground hover:text-foreground mb-4 inline-flex min-h-11 items-center gap-2 text-sm sm:mb-6"
  >
    <ArrowLeft className="h-4 w-4" aria-hidden />
    {label}
  </Link>
);

interface Props {
  /** Where "up" is from here, and what to call it. */
  back: { to: string; label: string };
  chip: string;
  title: string;
  /** Intro copy, and anything else that belongs in the measure of the text. */
  children?: React.ReactNode;
  /** Full-width row under the copy — a switcher, a set of tabs. */
  footer?: React.ReactNode;
}

/**
 * The masthead every section landing page and calculator shares: the way back,
 * a chip, the title, and one column of intro copy. Three pages had grown their
 * own copy of it and had already drifted on the type scale and the spacing.
 */
const PageHero = ({ back, chip, title, children, footer }: Props) => (
  <section className="border-border/40 border-b py-8 sm:py-14">
    <div className="container mx-auto px-4">
      <BackLink to={back.to} label={back.label} />
      <div className="max-w-2xl">
        <div className="highlight-chip">{chip}</div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {children}
      </div>
      {footer}
    </div>
  </section>
);

export default PageHero;
