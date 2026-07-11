"use client";

import { useEffect, useState } from "react";
import { useMarket } from "@/context/MarketContext";
import { getHistoricalCandles } from "@/services/historicalData";
import { getLatestEMA } from "@/strategies/indicators/EMA";

type EMAState = {
  ema20: number;
  ema50: number;
  latestClose: number;
};

export default function EMATrendCard() {
  const { activeSymbol } = useMarket();
  const symbol = activeSymbol.replace("NASDAQ:", "");

  const [data, setData] = useState<EMAState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEMAData() {
      try {
        setIsLoading(true);
        setError("");

        const to = Math.floor(Date.now() / 1000);
        const from = to - 60 * 60 * 24 * 180;

        const candles = await getHistoricalCandles(
          symbol,
          "D",
          from,
          to
        );

        const closingPrices = candles.map((candle) => candle.close);

        const ema20 = getLatestEMA(closingPrices, 20);
        const ema50 = getLatestEMA(closingPrices, 50);
        const latestClose = closingPrices.at(-1);

        if (
          ema20 === null ||
          ema50 === null ||
          latestClose === undefined
        ) {
          throw new Error("Not enough candle data for EMA analysis.");
        }

        setData({
          ema20,
          ema50,
          latestClose,
        });
      } catch (caughtError) {
        setData(null);

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to calculate EMA trend."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadEMAData();
  }, [symbol]);

  if (isLoading) {
    return (
      <section className="rounded-xl bg-slate-900 p-6">
        <p className="text-slate-400">
          Loading real EMA analysis for {symbol}...
        </p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">EMA Trend</h2>

        <p className="mt-3 text-sm text-red-400">
          {error || "EMA analysis is unavailable."}
        </p>
      </section>
    );
  }

  const bullish = data.ema20 > data.ema50;
  const priceAboveEMA20 = data.latestClose > data.ema20;

  return (
    <section className="rounded-xl bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">EMA Trend</h2>
          <p className="mt-1 text-sm text-slate-400">
            Real daily candle analysis for {symbol}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            bullish
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {bullish ? "Bullish" : "Bearish"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Latest Close</p>
          <p className="mt-1 text-xl font-semibold">
            ${data.latestClose.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">EMA 20</p>
          <p className="mt-1 text-xl font-semibold">
            ${data.ema20.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">EMA 50</p>
          <p className="mt-1 text-xl font-semibold">
            ${data.ema50.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 rounded-lg bg-slate-950 p-4 text-sm">
        <p className={bullish ? "text-green-400" : "text-red-400"}>
          {bullish ? "✓" : "✕"} EMA 20 is{" "}
          {bullish ? "above" : "below"} EMA 50
        </p>

        <p
          className={
            priceAboveEMA20 ? "text-green-400" : "text-yellow-400"
          }
        >
          {priceAboveEMA20 ? "✓" : "•"} Price is{" "}
          {priceAboveEMA20 ? "above" : "below"} EMA 20
        </p>
      </div>
    </section>
  );
}
