import React, { useState } from "react";
import { ChevronDown, Eye, EyeOff, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NumberField from "@/components/options/NumberField";
import Field, { SELECT_CLASS } from "@/components/tools/Field";
import { formatPrice } from "@/lib/options/format";
import type { Leg } from "@/lib/options/strategy";

/** The one-click adds. Everything else lives behind the per-leg editor. */
const QUICK_ADDS: { kind: Leg["kind"]; side: Leg["side"]; label: string }[] = [
  { kind: "call", side: "long", label: "Long call" },
  { kind: "call", side: "short", label: "Short call" },
  { kind: "put", side: "long", label: "Long put" },
  { kind: "put", side: "short", label: "Short put" },
  { kind: "underlying", side: "long", label: "Long underlying" },
  { kind: "underlying", side: "short", label: "Short underlying" },
];

interface Props {
  legs: Leg[];
  /** Leg ids currently drawn on the chart. */
  visibleLegs: string[];
  onChange: (id: string, patch: Partial<Leg>) => void;
  onRemove: (id: string) => void;
  onAdd: (kind: Leg["kind"], side: Leg["side"]) => void;
  onToggleVisible: (id: string) => void;
  onReprice: (id: string) => void;
}

function summary(leg: Leg): string {
  const side = leg.side === "long" ? "Long" : "Short";
  const qty = `${leg.qty} ×`;

  if (leg.kind === "underlying") {
    return `${side} ${qty} underlying @ ${formatPrice(leg.premium)}`;
  }

  return `${side} ${qty} ${formatPrice(leg.strike)} ${leg.kind} · ${leg.days}d · ${formatPrice(leg.premium)}`;
}

const LegsEditor = ({
  legs,
  visibleLegs,
  onChange,
  onRemove,
  onAdd,
  onToggleVisible,
  onReprice,
}: Props) => {
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggleExpanded = (id: string) =>
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((open) => open !== id)
        : [...current, id],
    );

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {legs.map((leg, index) => {
          const isUnderlying = leg.kind === "underlying";
          const isOpen = expanded.includes(leg.id);
          const isVisible = visibleLegs.includes(leg.id);
          const name = `${leg.side} ${leg.kind} leg ${index + 1}`;

          return (
            <li
              key={leg.id}
              className="border-border/60 bg-background overflow-hidden rounded-lg border"
            >
              <div className="flex items-center gap-1 p-2 sm:gap-2 sm:p-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-9 w-9 shrink-0"
                  onClick={() => onToggleVisible(leg.id)}
                  aria-label={`${isVisible ? "Hide" : "Show"} ${name} on the chart`}
                  aria-pressed={isVisible}
                >
                  {isVisible ? (
                    <Eye className="h-4 w-4" aria-hidden />
                  ) : (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => toggleExpanded(leg.id)}
                  aria-expanded={isOpen}
                  className="flex min-h-9 flex-1 items-center gap-2 rounded px-1 text-left text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className={isVisible ? "" : "text-muted-foreground"}>
                    {summary(leg)}
                  </span>
                  {leg.premiumMode === "manual" ? (
                    <span className="bg-accent text-accent-foreground shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                      manual
                    </span>
                  ) : null}
                </button>

                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive h-9 w-9 shrink-0"
                  onClick={() => onRemove(leg.id)}
                  aria-label={`Remove ${name}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </Button>
              </div>

              {isOpen ? (
                <div className="border-border/60 grid grid-cols-2 gap-3 border-t p-3 sm:grid-cols-4 lg:grid-cols-7">
                  <Field label="Type">
                    <select
                      aria-label={`Type of ${name}`}
                      className={SELECT_CLASS}
                      value={leg.kind}
                      onChange={(event) =>
                        onChange(leg.id, {
                          kind: event.target.value as Leg["kind"],
                          ...(event.target.value === "underlying"
                            ? { strike: 0, multiplier: 1 }
                            : {}),
                        })
                      }
                    >
                      <option value="call">Call</option>
                      <option value="put">Put</option>
                      <option value="underlying">Underlying</option>
                    </select>
                  </Field>

                  <Field label="Side">
                    <select
                      aria-label={`Side of ${name}`}
                      className={SELECT_CLASS}
                      value={leg.side}
                      onChange={(event) =>
                        onChange(leg.id, {
                          side: event.target.value as Leg["side"],
                        })
                      }
                    >
                      <option value="long">Long</option>
                      <option value="short">Short</option>
                    </select>
                  </Field>

                  <Field label="Qty">
                    <NumberField
                      label={`Quantity of ${name}`}
                      value={leg.qty}
                      onChange={(qty) => onChange(leg.id, { qty })}
                    />
                  </Field>

                  <Field label="Strike">
                    <NumberField
                      label={`Strike of ${name}`}
                      value={leg.strike}
                      disabled={isUnderlying}
                      onChange={(strike) => onChange(leg.id, { strike })}
                    />
                  </Field>

                  <Field label={isUnderlying ? "Entry price" : "Premium"}>
                    <NumberField
                      label={`${isUnderlying ? "Entry price" : "Premium"} of ${name}`}
                      value={leg.premium}
                      onChange={(premium) =>
                        onChange(leg.id, { premium, premiumMode: "manual" })
                      }
                    />
                  </Field>

                  <Field label="Days to expiry">
                    <NumberField
                      label={`Days to expiry of ${name}`}
                      value={leg.days}
                      disabled={isUnderlying}
                      onChange={(days) => onChange(leg.id, { days })}
                    />
                  </Field>

                  <Field label="Multiplier">
                    <NumberField
                      label={`Multiplier of ${name}`}
                      value={leg.multiplier}
                      onChange={(multiplier) =>
                        onChange(leg.id, { multiplier })
                      }
                    />
                  </Field>

                  {leg.premiumMode === "manual" ? (
                    <div className="col-span-2 flex items-end sm:col-span-4 lg:col-span-7">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground min-h-10"
                        onClick={() => onReprice(leg.id)}
                      >
                        <RefreshCw className="mr-2 h-3.5 w-3.5" aria-hidden />
                        Reprice from the model
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>

      {/* One swipeable row on a phone: six buttons wrapped to three rows. */}
      <div className="scroll-row pt-1">
        {QUICK_ADDS.map((quick) => (
          <Button
            key={quick.label}
            type="button"
            variant="outline"
            size="sm"
            className="min-h-10"
            onClick={() => onAdd(quick.kind, quick.side)}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            {quick.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LegsEditor;
