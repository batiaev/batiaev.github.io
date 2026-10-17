import React from "react";

interface Props {
  /** Eyebrow above the title — what kind of page this is. */
  chip: string;
  title: string;
  /** Intro copy, and anything else that belongs in the measure of the text. */
  children?: React.ReactNode;
  /** Right-aligned actions on wide screens, under the copy on narrow ones. */
  actions?: React.ReactNode;
  /** Full-width row under the copy — a switcher, a set of tabs. */
  footer?: React.ReactNode;
}

/** Lede paragraph under a page title, so every page sets it the same way. */
export const Lede = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed sm:text-base">
    {children}
  </p>
);

/**
 * The masthead every section landing page and calculator shares: an eyebrow,
 * the title, one column of intro copy. The way back lives in the breadcrumb
 * now, so it is no longer repeated here.
 */
const PageHero = ({ chip, title, children, actions, footer }: Props) => (
  <header className="border-border border-b">
    <div className="container mx-auto pb-6 pt-8 sm:pb-8 sm:pt-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="highlight-chip">{chip}</div>
          <h1 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.125rem]">
            {title}
          </h1>
          {children}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
      {footer}
    </div>
  </header>
);

export default PageHero;
