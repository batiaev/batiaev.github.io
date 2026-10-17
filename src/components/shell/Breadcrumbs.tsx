import React from "react";
import { Link, useLocation } from "react-router-dom";
import { crumbsFor } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * Where you are, in the header. This replaces the "Back to home" links every
 * page used to carry: each step up is a link, and the last one is the page.
 * On a phone only the last step shows — the sheet carries the rest.
 */
const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const crumbs = crumbsFor(pathname);

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-0.5 text-[13px]">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li
              key={`${crumb.label}-${index}`}
              className={cn("flex min-w-0 items-center gap-0.5", !last && "hidden md:flex")}
            >
              {crumb.href && !last ? (
                <Link
                  to={crumb.href}
                  className="text-muted-foreground hover:text-foreground hover:bg-foreground/[0.045] truncate rounded-md px-1.5 py-1 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "truncate px-1.5 py-1",
                    last ? "text-foreground font-medium" : "text-muted-foreground",
                  )}
                >
                  {crumb.label}
                </span>
              )}
              {!last ? (
                <span aria-hidden className="text-muted-foreground/40 select-none">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
