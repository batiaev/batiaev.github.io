import React from "react";

/**
 * A native select styled to match the Input component. shadcn's Select is a
 * listbox in a popover, which is the wrong trade on a phone for a two-option
 * choice: the platform picker is better than anything reimplemented here.
 */
export const SELECT_CLASS =
  "h-10 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Micro-label above a control, with an optional line of explanation under it.
 * Four of the calculators had grown their own copy of this, with three
 * different label sizes between them.
 */
const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-muted-foreground mb-1 block text-xs font-medium uppercase tracking-wider">
      {label}
    </span>
    {children}
    {hint ? (
      <span className="text-muted-foreground mt-1 block text-xs leading-snug">
        {hint}
      </span>
    ) : null}
  </label>
);

export default Field;
