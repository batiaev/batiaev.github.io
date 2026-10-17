import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFound = () => {
  const { pathname } = useLocation();

  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="highlight-chip">404</p>
      <h1 className="text-[1.75rem] font-semibold tracking-tight sm:text-[2.125rem]">
        Page not found
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md text-[15px] leading-relaxed">
        Nothing lives at{" "}
        <code className="border-border bg-muted rounded border px-1 py-px font-mono text-[13px]">
          {pathname}
        </code>
        . The link may be old, or the page may have moved — search with{" "}
        <kbd className="kbd">⌘K</kbd>, or start from the overview.
      </p>
      <Link
        to="/"
        className="text-primary mt-6 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
      >
        Go to the overview
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
};

export default NotFound;
