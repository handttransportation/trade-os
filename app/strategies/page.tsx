"use client";

import { useMemo } from "react";
import { useMarket } from "@/context/MarketContext";
import { useMarketData } from "@/context/MarketDataContext";
import { runStrategyEngine } from "@/strategies/core/StrategyEngine";
import { trendFollowingStrategy } from "@/strategies/setups/TrendFollowing";
import { breakoutStrategy } from "@/strategies/setups/Breakout";

export default function StrategiesPage() {
  const { activeSymbol } = useMarket();
  const { quotes, isLoading, error } = useMarketData();

  const symbol = activeSymbol.replace("NASDAQ:", "");
  const quote = quotes[symbol];

  const result = useMemo(() => {
    if (!quote) {
      return null;
    }

    return runStrategyEngine(
      {
        symbol,
        currentPrice: quote.currentPrice,
        open: quote.open,
        high: quote.high,
        low: quote.low,
        previousClose: quote.previousClose,
        volume: 0,
      },
      [trendFollowingStrategy, breakoutStrategy]
    );
  }, [quote, symbol]);

  if (isLoading) {
    return (
      <div className="p-8 text-slate-400">
        Loading strategy analysis...
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="p-8 text-red-400">
        Strategy analysis is unavailable.
      </div>
    );
  }

  const signalColor =
    result.signal === "BUY"
      ? "text-green-400"
      : result.signal === "SELL"
        ? "text-red-400"
        : "text-yellow-400";

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Strategies</h1>
        <p className="mt-2 text-slate-400">
          Compare strategy signals for {symbol}.
        </p>
      </div>

      <section className="rounded-xl bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Combined Signal</p>

        <p className={`mt-2 text-4xl font-bold ${signalColor}`}>
          {result.signal}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Confidence</p>
            <p className="mt-1 text-xl font-semibold">
              {result.confidence}%
            </p>
          </div>

          <div className="rounded-lg bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Entry</p>
            <p className="mt-1 text-xl font-semibold">
              ${result.entry.toFixed(2)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Stop Loss</p>
            <p className="mt-1 text-xl font-semibold">
              ${result.stopLoss.toFixed(2)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-950 p-4">
            <p className="text-sm text-slate-400">Take Profit</p>
            <p className="mt-1 text-xl font-semibold">
              ${result.takeProfit.toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {result.results.map((strategyResult) => {
          const strategyColor =
            strategyResult.signal === "BUY"
              ? "text-green-400"
              : strategyResult.signal === "SELL"
                ? "text-red-400"
                : "text-yellow-400";

          return (
            <section
              key={strategyResult.strategy}
              className="rounded-xl bg-slate-900 p-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {strategyResult.strategy}
                </h2>

                <span className={`font-semibold ${strategyColor}`}>
                  {strategyResult.signal}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-400">
                Confidence: {strategyResult.confidence}%
              </p>

              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {strategyResult.reason.map((reason) => (
                  <li key={reason}>• {reason}</li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
