import React from "react";
import { Link } from "react-router-dom";
import LearnLayout from "@/components/learn/LearnLayout";
import StrategyFigure from "@/components/learn/StrategyFigure";
import NotFound from "@/pages/NotFound";
import { noteBySlug } from "@/learn/registry";
import { presets, roundStrike } from "@/lib/options/presets";

const side = (value: string) => (value === "long" ? "Long" : "Short");

/**
 * The figure below prices every preset at 100 spot, and presets snap strikes to
 * the exchange-like grid in `roundStrike`. Showing the raw ratio here would
 * print 93% while the chart traded 95 — so the table quotes the same strike the
 * chart actually uses.
 */
const REFERENCE_SPOT = 100;

/**
 * Every strategy page is this one template. The prose is editorial, but the
 * leg table, the chart and every number come from the same preset and pricing
 * engine the calculator uses — so the documentation cannot drift from the tool.
 */
const StrategyPage = ({ slug }: { slug: string }) => {
  const note = noteBySlug(slug);
  const preset = presets.find((p) => p.id === note?.id);

  if (!note || !preset) return <NotFound />;

  return (
    <LearnLayout slug={`strategies/${note.slug}`}>
      <p className="border-border/60 bg-accent/30 text-foreground -mt-2 mb-6 rounded-lg border px-4 py-3 text-sm">
        <strong>The view:</strong> {note.view}
      </p>

      <h2>Construction</h2>
      <table>
        <thead>
          <tr>
            <th>Leg</th>
            <th>Qty</th>
            <th>Strike at {REFERENCE_SPOT} spot</th>
          </tr>
        </thead>
        <tbody>
          {preset.legs.map((leg, index) => (
            <tr key={index}>
              <td>
                {side(leg.side)}{" "}
                {leg.kind === "underlying" ? "underlying" : leg.kind}
              </td>
              <td>{leg.qty}</td>
              <td>
                {leg.kind === "underlying"
                  ? "—"
                  : roundStrike(REFERENCE_SPOT, leg.strikeRatio ?? 1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <StrategyFigure presetId={preset.id} />

      <h2>When it fits</h2>
      <p>{note.whenToUse}</p>

      <h2>What goes wrong</h2>
      <ul>
        {note.risks.map((risk) => (
          <li key={risk}>{risk}</li>
        ))}
      </ul>

      <h2>Try it properly</h2>
      <p>
        The chart above is the real pricing model, limited to three sliders. To
        change strikes, add legs, switch to futures, or price it against your own
        volatility assumption, open it in the{" "}
        <Link to="/tools/options-pnl">options P&amp;L calculator</Link> — the
        link under the chart carries this exact position across.
      </p>

      <p className="text-xs">
        Education, not advice. Payoffs ignore commission, bid-ask spread,
        assignment risk and financing.
      </p>
    </LearnLayout>
  );
};

export default StrategyPage;
