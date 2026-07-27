import React from "react";
import NumberField from "@/components/options/NumberField";
import type { EquityKind, Offer } from "@/lib/offer/archetypes";
import { dilutedPct } from "@/lib/offer/archetypes";

const SELECT_CLASS =
  "h-10 w-full rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-muted-foreground mb-1 block text-xs font-medium">
      {label}
    </span>
    {children}
    {hint ? (
      <span className="text-muted-foreground mt-1 block text-xs">{hint}</span>
    ) : null}
  </label>
);

const Group = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h4 className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wider">
      {title}
    </h4>
    <div className="grid grid-cols-2 gap-3">{children}</div>
  </div>
);

/** The granular editor behind each offer's cog. */
const OfferDetail = ({
  offer,
  onChange,
}: {
  offer: Offer;
  onChange: (patch: Partial<Offer>) => void;
}) => {
  const hasEquity = offer.equityKind !== "none";

  return (
    <div className="space-y-5">
      <Group title="Cash">
        <Field label="Base salary">
          <NumberField
            label={`Base salary for ${offer.label}`}
            value={offer.base}
            onChange={(base) => onChange({ base })}
          />
        </Field>
        <Field label="Target bonus">
          <NumberField
            label={`Target bonus for ${offer.label}`}
            suffix="%"
            value={offer.bonusPct}
            onChange={(bonusPct) => onChange({ bonusPct })}
          />
        </Field>
        <Field label="Sign-on">
          <NumberField
            label={`Sign-on for ${offer.label}`}
            value={offer.signOn}
            onChange={(signOn) => onChange({ signOn })}
          />
        </Field>
      </Group>

      <Group title="Equity">
        <Field label="Type">
          <select
            aria-label={`Equity type for ${offer.label}`}
            className={SELECT_CLASS}
            value={offer.equityKind}
            onChange={(event) =>
              onChange({ equityKind: event.target.value as EquityKind })
            }
          >
            <option value="none">None</option>
            <option value="rsu">Shares / RSUs</option>
            <option value="options">Options</option>
          </select>
        </Field>
        {hasEquity ? (
          <>
            <Field label="Grant" hint="Share of the company today">
              <NumberField
                label={`Grant percent for ${offer.label}`}
                suffix="%"
                value={offer.grantPct}
                onChange={(grantPct) => onChange({ grantPct })}
              />
            </Field>
            <Field label="Valuation now">
              <NumberField
                label={`Current valuation for ${offer.label}`}
                value={offer.valuationNow}
                onChange={(valuationNow) => onChange({ valuationNow })}
              />
            </Field>
            {offer.equityKind === "options" ? (
              <Field label="Strike" hint="Share of today's valuation">
                <NumberField
                  label={`Strike discount for ${offer.label}`}
                  value={offer.strikeDiscount}
                  onChange={(strikeDiscount) => onChange({ strikeDiscount })}
                />
              </Field>
            ) : null}
            <Field label="Vests over">
              <NumberField
                label={`Vesting years for ${offer.label}`}
                suffix="yr"
                value={offer.vestYears}
                onChange={(vestYears) => onChange({ vestYears })}
              />
            </Field>
            <Field label="Cliff">
              <NumberField
                label={`Cliff months for ${offer.label}`}
                suffix="mo"
                value={offer.cliffMonths}
                onChange={(cliffMonths) => onChange({ cliffMonths })}
              />
            </Field>
          </>
        ) : null}
      </Group>

      {hasEquity ? (
        <>
          <Group title="Dilution">
            <Field label="Rounds to exit">
              <NumberField
                label={`Funding rounds before exit for ${offer.label}`}
                value={offer.rounds}
                onChange={(rounds) => onChange({ rounds })}
              />
            </Field>
            <Field label="Dilution per round">
              <NumberField
                label={`Dilution per round for ${offer.label}`}
                suffix="%"
                value={offer.dilutionPerRound}
                onChange={(dilutionPerRound) => onChange({ dilutionPerRound })}
              />
            </Field>
          </Group>

          <Group title="Exit">
            <Field label="Exit valuation">
              <NumberField
                label={`Exit valuation for ${offer.label}`}
                value={offer.exitValuation}
                onChange={(exitValuation) => onChange({ exitValuation })}
              />
            </Field>
            <Field label="Years to exit">
              <NumberField
                label={`Years to exit for ${offer.label}`}
                suffix="yr"
                value={offer.yearsToExit}
                onChange={(yearsToExit) => onChange({ yearsToExit })}
              />
            </Field>
            <Field label="Chance of exit" hint="Everything else is the downside">
              <NumberField
                label={`Probability of exit for ${offer.label}`}
                suffix="%"
                value={offer.exitProbability}
                onChange={(exitProbability) => onChange({ exitProbability })}
              />
            </Field>
          </Group>

          <p className="border-border/60 text-muted-foreground rounded-md border border-dashed p-3 text-xs leading-relaxed">
            After {offer.rounds} round{offer.rounds === 1 ? "" : "s"} at{" "}
            {offer.dilutionPerRound}%, your {offer.grantPct}% becomes{" "}
            <strong className="text-foreground">
              {dilutedPct(offer).toFixed(3)}%
            </strong>
            . Dilution is the part of an offer nobody puts in the email.
          </p>
        </>
      ) : null}
    </div>
  );
};

export default OfferDetail;
