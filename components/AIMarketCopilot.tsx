"use client";

import { useMemo } from "react";
import type { SymbolAnalysis } from "@/services/analyzeSymbol";
import { useTradingMode } from "@/context/TradingModeContext";

type AIMarketCopilotProps = {
  analysis: SymbolAnalysis;
};

export default function AIMarketCopilot({
  analysis,
}: AIMarketCopilotProps) {
  const { tradingMode } = useTradingMode();

  const insight = useMemo(() => {
    const score = analysis.decision.score;
    const action = analysis.decision.action;

    const grade =
      score >= 90
        ? "A+"
        : score >= 80
          ? "A"
          : score >= 70
            ? "B+"
            : score >= 60
              ? "B"
              : score >= 45
                ? "C"
                : "D";

    const recommendation =
      action === "BUY"
        ? "Conditions favor a long setup. Wait for confirmation near the planned entry."
        : action === "SELL"
          ? "Conditions favor downside pressure. Avoid entering without confirmation."
          : "No high-quality setup is active. Patience is the preferred action.";

    const riskNote =
      analysis.volatilityScore >= 20
        ? "Volatility is within the preferred range."
        : "Volatility conditions require additional caution.";

    return {
      action,
      score,
      grade,
      recommendation,
      riskNote,
    };
  }, [analysis]);

  const actionClass =
    insight.action === "BUY"
      ? "text-green-400"
      : insight.action === "SELL"
        ? "text-red-400"
        : "text-yellow-400";

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
            AI Market Copilot
          </p>

          <h3 className="mt-2 text-2xl font-bold">
            {analysis.symbol} Decision Brief
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {tradingMode === "DAY_TRADE"
              ? "Day-trading analysis"
              : "Swing-trading analysis"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500">
            Setup Grade
          </p>

          <p className="mt-1 text-4xl font-bold text-sky-400">
            {insight.grade}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            Recommendation
          </p>

          <p className={`mt-2 text-2xl font-bold ${actionClass}`}>
            {insight.action}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            Confidence
          </p>

          <p className="mt-2 text-2xl font-bold">
            {insight.score}/100
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            Volatility
          </p>

          <p className="mt-2 text-2xl font-bold">
            {analysis.volatilityScore}/20
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-slate-900 p-5">
        <p className="text-sm font-semibold">
          Copilot Guidance
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {insight.recommendation}
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {insight.riskNote}
        </p>
      </div>
    </section>
  );
}
