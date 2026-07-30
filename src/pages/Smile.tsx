import React, { Suspense, lazy, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NumberField from "@/components/options/NumberField";
import Field, { SELECT_CLASS } from "@/components/tools/Field";
import ToolLayout from "@/components/tools/ToolLayout";
import ToolNotes from "@/components/tools/ToolNotes";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { ROUTE_META } from "@/lib/routeMeta";
import type { OptionType } from "@/lib/options/blackScholes";
import { fitSmile, type Quote, type SmilePoint } from "@/lib/options/smile";
import type { Market } from "@/lib/options/impliedVol";

const SmileChart = lazy(() => import("@/components/options/SmileChart"));

const ROUTE = "/tools/smile";

/**
 * A worked example, so the page means something before anybody types.
 *
 * Out-of-the-money by convention — puts below the forward, calls above —
 * because an in-the-money quote is nearly all intrinsic and implies a
 * volatility only very weakly. Spreads widen into the wings, as they do in a
 * real market, and one strike is deliberately marked away from its neighbours.
 */
const EXAMPLE: Quote[] = [
  { strike: 80, type: "put", bid: 0.04, ask: 0.07 },
  { strike: 85, type: "put", bid: 0.12, ask: 0.15 },
  { strike: 90, type: "put", bid: 0.35, ask: 0.4 },
  { strike: 95, type: "put", bid: 0.99, ask: 1.14 },
  { strike: 100, type: "put", bid: 2.52, ask: 2.89 },
  { strike: 105, type: "call", bid: 1.2, ask: 1.38 },
  { strike: 110, type: "call", bid: 0.23, ask: 0.26 },
  { strike: 115, type: "call", bid: 0.02, ask: 0.05 },
];

const INITIAL_MARKET = { spot: 100, days: 30, rate: 4, dividend: 0 };

const vol = (v: number | null) => (v === null ? "—" : `${(v * 100).toFixed(1)}%`);

const MARKET_FIELDS = [
  ["Spot", "spot", undefined],
  ["Days to expiry", "days", undefined],
  ["Rate", "rate", "%"],
  ["Dividend yield", "dividend", "%"],
] as const;

interface RowProps {
  index: number;
  quote: Quote;
  point?: SmilePoint;
  onChange: (patch: Partial<Quote>) => void;
  onRemove: () => void;
}

/*
 * One quote, twice over: a table row from sm up, a card below it.
 *
 * Four number inputs and a select cannot fit across 375px, and a table that
 * scrolls sideways hides exactly the columns the tool exists to show — the
 * implied vols it derives. The controls themselves are shared, so the two
 * layouts cannot drift apart.
 */

const StrikeInput = ({ index, quote, onChange }: RowProps) => (
  <NumberField
    value={quote.strike}
    onChange={(strike) => onChange({ strike })}
    label={`Strike ${index + 1}`}
  />
);

const TypeSelect = ({ index, quote, onChange }: RowProps) => (
  <select
    aria-label={`Option type ${index + 1}`}
    className={SELECT_CLASS}
    value={quote.type}
    onChange={(event) => onChange({ type: event.target.value as OptionType })}
  >
    <option value="put">Put</option>
    <option value="call">Call</option>
  </select>
);

const RemoveButton = ({ quote, onRemove }: RowProps) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    className="text-muted-foreground hover:text-destructive h-9 w-9 shrink-0"
    aria-label={`Remove strike ${quote.strike}`}
    onClick={onRemove}
  >
    <Trash2 className="h-4 w-4" aria-hidden />
  </Button>
);

/** Rich or cheap against the fit, or why this quote is not in it. */
const Residual = ({ point }: { point?: SmilePoint }) => {
  const residual = point?.residualPoints ?? null;

  if (point?.problem) {
    return (
      <span className="text-muted-foreground text-xs">{point.problem}</span>
    );
  }
  if (residual === null) return <>—</>;

  return (
    <span
      className={
        point?.outsideSpread
          ? residual > 0
            ? "font-medium text-orange-600"
            : "font-medium text-sky-600"
          : "text-muted-foreground"
      }
    >
      {residual > 0 ? "+" : "−"}
      {Math.abs(residual).toFixed(2)}
    </span>
  );
};

const Smile = () => {
  useDocumentMeta(ROUTE_META[ROUTE]);
  const [quotes, setQuotes] = useState<Quote[]>(EXAMPLE);
  const [m, setM] = useState(INITIAL_MARKET);

  const market: Market = useMemo(
    () => ({
      price: m.spot,
      years: m.days / 365,
      rate: m.rate / 100,
      carry: m.dividend / 100,
    }),
    [m],
  );

  const fit = useMemo(() => fitSmile(quotes, market), [quotes, market]);

  const update = (index: number, patch: Partial<Quote>) =>
    setQuotes((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...patch } : q)),
    );

  const flagged = fit?.points.filter((p) => p.outsideSpread) ?? [];

  return (
    <ToolLayout
      route={ROUTE}
      chip="Free tool"
      title="Volatility smile from a quote board"
      width="wide"
      intro={
        <>
          Put in the bid and ask for a strip of strikes and the tool backs out an
          implied volatility for each side, fits a smile through them, and shows
          where the market disagrees with its own curve. Loaded with a worked
          example — overwrite it with your own board.
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {MARKET_FIELDS.map(([label, key, suffix]) => (
          <Field key={key} label={label}>
            <NumberField
              value={m[key]}
              onChange={(value) => setM((prev) => ({ ...prev, [key]: value }))}
              label={label}
              suffix={suffix}
            />
          </Field>
        ))}
      </div>

      {fit ? (
        <div>
          <Suspense
            fallback={
              <div className="text-muted-foreground py-16 text-center text-sm">
                Loading chart…
              </div>
            }
          >
            <SmileChart fit={fit} />
          </Suspense>

          <dl className="border-border/60 mt-2 grid grid-cols-2 gap-3 border-t pt-4 text-sm sm:grid-cols-5">
            {[
              ["Forward", fit.forward.toFixed(2)],
              ["Level at forward", `${(fit.atmVol * 100).toFixed(1)}%`],
              ["Skew", fit.skew.toFixed(3)],
              ["Curvature", fit.curvature.toFixed(3)],
              ["Fit error", `${fit.rmsePoints.toFixed(2)} pts`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted-foreground text-xs uppercase tracking-wider">
                  {label}
                </dt>
                <dd className="mt-0.5 font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
        <p className="border-border/60 text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
          Three usable quotes are needed before a smile can be fitted. A curve
          through two points is a straight line pretending otherwise.
        </p>
      )}

      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          The board
        </h2>

        {/* Cards on a phone, table from sm up. */}
        <ul className="divide-border/40 mt-3 divide-y sm:hidden">
          {quotes.map((quote, index) => {
            const cells: RowProps = {
              index,
              quote,
              point: fit?.points[index],
              onChange: (patch) => update(index, patch),
              onRemove: () =>
                setQuotes((prev) => prev.filter((_, i) => i !== index)),
            };

            return (
              <li key={index} className="space-y-2 py-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Field label="Strike">
                      <StrikeInput {...cells} />
                    </Field>
                  </div>
                  <div className="flex-1">
                    <Field label="Type">
                      <TypeSelect {...cells} />
                    </Field>
                  </div>
                  <RemoveButton {...cells} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Field label="Bid">
                    <NumberField
                      value={quote.bid}
                      onChange={(bid) => update(index, { bid })}
                      label={`Bid ${index + 1}`}
                    />
                  </Field>
                  <Field label="Ask">
                    <NumberField
                      value={quote.ask}
                      onChange={(ask) => update(index, { ask })}
                      label={`Ask ${index + 1}`}
                    />
                  </Field>
                </div>
                <p className="text-muted-foreground flex flex-wrap gap-x-3 text-xs tabular-nums">
                  <span>IV {vol(cells.point?.band.bid ?? null)}</span>
                  <span>/ {vol(cells.point?.band.ask ?? null)}</span>
                  <span>fitted {vol(cells.point?.fitted ?? null)}</span>
                  <span>
                    rich / cheap <Residual point={cells.point} />
                  </span>
                </p>
              </li>
            );
          })}
        </ul>

        <div className="mt-3 hidden sm:block">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground text-xs uppercase tracking-wider">
              <tr className="border-border/60 border-b">
                <th className="py-2 text-left font-medium">Strike</th>
                <th className="py-2 text-left font-medium">Type</th>
                <th className="py-2 text-left font-medium">Bid</th>
                <th className="py-2 text-left font-medium">Ask</th>
                <th className="py-2 text-right font-medium">Bid IV</th>
                <th className="py-2 text-right font-medium">Ask IV</th>
                <th className="py-2 text-right font-medium">Fitted</th>
                <th className="py-2 text-right font-medium">Rich / cheap</th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote, index) => {
                const cells: RowProps = {
                  index,
                  quote,
                  point: fit?.points[index],
                  onChange: (patch) => update(index, patch),
                  onRemove: () =>
                    setQuotes((prev) => prev.filter((_, i) => i !== index)),
                };

                return (
                  <tr key={index} className="border-border/40 border-b">
                    <td className="w-24 py-2 pr-2">
                      <StrikeInput {...cells} />
                    </td>
                    <td className="w-24 py-2 pr-2">
                      <TypeSelect {...cells} />
                    </td>
                    <td className="w-24 py-2 pr-2">
                      <NumberField
                        value={quote.bid}
                        onChange={(bid) => update(index, { bid })}
                        label={`Bid ${index + 1}`}
                      />
                    </td>
                    <td className="w-24 py-2 pr-2">
                      <NumberField
                        value={quote.ask}
                        onChange={(ask) => update(index, { ask })}
                        label={`Ask ${index + 1}`}
                      />
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {vol(cells.point?.band.bid ?? null)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {vol(cells.point?.band.ask ?? null)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      {vol(cells.point?.fitted ?? null)}
                    </td>
                    <td className="py-2 text-right tabular-nums">
                      <Residual point={cells.point} />
                    </td>
                    <td className="py-2 text-right">
                      <RemoveButton {...cells} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="scroll-row mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-10"
            onClick={() =>
              setQuotes((prev) => {
                const last = prev[prev.length - 1];
                const strike = last ? last.strike + 5 : m.spot;
                return [...prev, { strike, type: "call", bid: 0.05, ask: 0.1 }];
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            Add strike
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-10"
            onClick={() => {
              setQuotes(EXAMPLE);
              setM(INITIAL_MARKET);
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
            Reset to the example
          </Button>
        </div>

        {flagged.length > 0 ? (
          <p className="border-border/60 bg-accent/30 mt-6 rounded-lg border p-4 text-sm leading-relaxed">
            <strong className="text-foreground">
              {flagged.length} strike{flagged.length > 1 ? "s" : ""} priced clear
              of the curve.
            </strong>{" "}
            {flagged
              .map(
                (p) =>
                  `${p.strike} ${p.type} is ${(p.residualPoints ?? 0) > 0 ? "rich" : "cheap"} by ${Math.abs(p.residualPoints ?? 0).toFixed(2)} vol points`,
              )
              .join(", ")}
            . The whole bid-ask band sits on one side of the fit, so this is not
            a rounding artefact — which is the beginning of a question, not the
            answer to one.
          </p>
        ) : null}
      </div>

      <ToolNotes>
        <p>
          <strong className="text-foreground">Method.</strong> Each side of each
          quote is inverted through the same Black-Scholes as the{" "}
          <Link
            to="/tools/options-pnl"
            className="text-primary hover:underline"
          >
            options P&amp;L calculator
          </Link>
          , by Newton&apos;s method kept inside a bisection bracket. The curve is
          a quadratic in log-moneyness against the forward,{" "}
          <code>σ(k) = a + b·k + c·k²</code>, fitted by least squares with each
          quote weighted by the inverse square of its own bid-ask width in
          volatility points. The three coefficients are reported above as level,
          skew and curvature.
        </p>
        <p>
          A quadratic rather than SVI on purpose: five parameters fitted to eight
          strikes is unstable, and a curve that jumps around when you change one
          quote teaches nothing. Quotes that cannot imply a volatility — no bid, a
          crossed market, or an option so deep in the money that its price
          carries no vega — are named against the strike and left out of the fit
          rather than silently dropped.
        </p>
        <p>
          Rich and cheap are measured against this curve, not against value. A
          strike flagged here is one the fit disagrees with; the fit is a
          three-parameter guess drawn through a handful of points, and it is
          wrong more often than the market is. Read it as a place to look, and
          note that one badly marked quote drags the curve for every other
          strike.
        </p>
        <p className="text-xs">
          For education and analysis. Not investment advice, not a recommendation
          to trade, and not a substitute for your own pricing.
        </p>
      </ToolNotes>
    </ToolLayout>
  );
};

export default Smile;
