import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NumberField from "@/components/options/NumberField";
import type { Leg } from "@/lib/options/strategy";

const COLUMNS =
  "sm:grid-cols-[1.1fr_1fr_0.7fr_0.9fr_0.9fr_0.7fr_0.7fr_auto]";

const SELECT_CLASS =
  "h-10 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

interface Props {
  legs: Leg[];
  visibleLegs: string[];
  onChange: (id: string, patch: Partial<Leg>) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
  onToggleVisible: (id: string) => void;
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-muted-foreground mb-1 block text-xs font-medium sm:hidden">
      {label}
    </span>
    {children}
  </label>
);

const LegsEditor = ({
  legs,
  visibleLegs,
  onChange,
  onRemove,
  onAdd,
  onToggleVisible,
}: Props) => (
  <div className="space-y-3">
    <div
      className={`text-muted-foreground hidden gap-3 px-1 text-xs font-medium uppercase tracking-wider sm:grid ${COLUMNS}`}
    >
      <span>Type</span>
      <span>Side</span>
      <span>Qty</span>
      <span>Strike</span>
      <span>Premium</span>
      <span>Days</span>
      <span>Mult.</span>
      <span className="sr-only">Actions</span>
    </div>

    <ul className="space-y-3">
      {legs.map((leg, index) => {
        const isUnderlying = leg.kind === "underlying";
        const name = isUnderlying
          ? `underlying leg ${index + 1}`
          : `${leg.kind} leg ${index + 1}`;

        return (
          <li
            key={leg.id}
            className={`border-border/60 bg-background grid grid-cols-2 items-center gap-3 rounded-lg border p-3 sm:border-0 sm:bg-transparent sm:p-1 ${COLUMNS}`}
          >
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
                onChange={(premium) => onChange(leg.id, { premium })}
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
                onChange={(multiplier) => onChange(leg.id, { multiplier })}
              />
            </Field>

            <div className="col-span-2 flex items-center justify-between gap-2 sm:col-span-1 sm:justify-end">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  className="accent-primary h-4 w-4"
                  checked={visibleLegs.includes(leg.id)}
                  onChange={() => onToggleVisible(leg.id)}
                  aria-label={`Show ${name} on the chart`}
                />
                <span className="text-muted-foreground sm:hidden">
                  Plot this leg
                </span>
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive h-9 w-9"
                onClick={() => onRemove(leg.id)}
                aria-label={`Remove ${name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>

    <Button type="button" variant="outline" onClick={onAdd} className="min-h-11">
      <Plus className="mr-2 h-4 w-4" aria-hidden />
      Add leg
    </Button>
  </div>
);

export default LegsEditor;
