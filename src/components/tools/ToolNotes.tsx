import React from "react";

/**
 * The method-and-caveats block every calculator ends with. Same rule as the
 * hero: one definition, so the small print cannot end up looking like body copy
 * on one tool and a footnote on the next.
 */
const ToolNotes = ({ children }: { children: React.ReactNode }) => (
  <div className="border-border/40 text-muted-foreground space-y-3 border-t pt-8 text-sm leading-relaxed">
    {children}
  </div>
);

export default ToolNotes;
