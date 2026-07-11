"use client";

import { useMemo } from "react";
import { useScanner } from "@/hooks/useScanner";
import { useMarket } from "@/context/MarketContext";
import { useWatchlist } from "@/context/WatchlistContext";
import { useTradingMode } from "@/context/TradingModeContext";
import { buildMorningBriefing } from "@/services/morningBriefing";
import TradePlanCard from "./TradePlanCard";
import TradingChatPanel from "./TradingChatPanel";

export default function OpportunityOverview() {
  const { activeWatchlist } = useWatchlist();
  const { tradingMode } = useTradingMode();
  const { setActiveSymbol } = useMarket();

  const {
    results,
    generatedAt,
    isLoading,
    error,
    refresh,
  } = useScanner(
    activeWatchlist.symbols,
    tradingMode
  );

  const briefing = useMemo(() => {
    if (results.length === 0) {
      return null;
    }

    return buildMorningBriefing(results);
  }, [results]);

  const bestOpportunity = useMemo(() => {
    if (!briefing) {
      return null;
    }

    return (
      results.find(
        (result) =>
          result.symbol === briefing.bestOpportunity
      ) ?? null
    );
  }, [briefing, results]);

  if (isLoading && results.length === 0) {
    return (
      <section className="mb-8 rounded-xl bg-slate-900 p-6">
        <p className="text-slate-400">
          Preparing the market briefing for{" "}
          {activeWatchlist.name}...
        </p>
      </section>
    );
  }

  if (error || !briefing || !bestOpportunity) {
    return (
      <section className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-6">
        <p className="text-red-400">
          {error || "Morning briefing is unavailable."}
        </p>
      </section>
    );
  }

  const signalClass =
    bestOpportunity.decision.action === "BUY"
      ? "text-green-400"
      : bestOpportunity.decision.action === "SELL"
        ? "text-red-400"
        : "text-yellow-400";

  const biasClass =
    briefing.marketBias === "Bullish"
      ? "text-green-400"
      : briefing.marketBias === "Bearish"
        ? "text-red-400"
        : "text-yellow-400";

  return (
    <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-400">
            AI Morning Briefing
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Today&apos;s Market Intelligence
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {tradingMode === "DAY_TRADE"
              ? "Day Trade"
              : "Swing Trade"}{" "}
            • {activeWatchlist.name}
          </p>

          {generatedAt && (
            <p className="mt-1 text-xs text-slate-500">
              Updated{" "}
              {new Date(generatedAt).toLocaleString()}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold transition hover:bg-sky-500 disabled:opacity-50"
        >
          {isLoading ? "Scanning..." : "Refresh Briefing"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() =>
            setActiveSymbol(
              `NASDAQ:${bestOpportunity.symbol}`
            )
          }
          className="rounded-xl bg-slate-950 p-5 text-left transition hover:bg-slate-800"
        >
          <p className="text-sm text-slate-400">
            Best Opportunity
          </p>

          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold">
                {bestOpportunity.symbol}
              </p>

              <p className={`mt-1 font-semibold ${signalClass}`}>
                {bestOpportunity.decision.action}
              </p>
            </div>

            <p className="text-3xl font-bold text-sky-400">
              {bestOpportunity.decision.score}
            </p>
          </div>
        </button>

        <div className="rounded-xl bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Market Health
          </p>

          <p className="mt-3 text-3xl font-bold">
            {briefing.averageScore}/100
          </p>

          <p className={`mt-1 font-semibold ${biasClass}`}>
            {briefing.marketBias}
          </p>

          <div className="mt-4 h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-sky-500"
              style={{
                width: `${briefing.averageScore}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Market Breadth
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">
                {briefing.buySignals}
              </p>
              <p className="text-xs text-slate-500">BUY</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {briefing.holdSignals}
              </p>
              <p className="text-xs text-slate-500">HOLD</p>
            </div>

            <div>
              <p className="text-2xl font-bold text-red-400">
                {briefing.sellSignals}
              </p>
              <p className="text-xs text-slate-500">SELL</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 p-5">
          <p className="text-sm text-slate-400">
            Scanner Highlights
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-slate-500">
                Strongest Momentum
              </p>
              <p className="font-semibold">
                {briefing.strongestMomentum}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Highest Volatility
              </p>
              <p className="font-semibold">
                {briefing.highestVolatility}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-slate-950 p-5">
        <p className="text-sm font-semibold">
          Automated Market Summary
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {briefing.summary}
        </p>
      </div>

      <TradePlanCard analysis={bestOpportunity} />
      <TradingChatPanel analysis={bestOpportunity} />
    </section>
  );
}
