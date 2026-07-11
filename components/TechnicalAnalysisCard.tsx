"use client";

import { useEffect, useState } from "react";
import { useMarket } from "@/context/MarketContext";
import { getHistoricalCandles } from "@/services/historicalData";
import { getLatestEMA } from "@/strategies/indicators/EMA";
import { getLatestRSI } from "@/strategies/indicators/RSI";
import { getLatestMACD } from "@/strategies/indicators/MACD";
import { getLatestSMA } from "@/strategies/indicators/SMA";

type TechnicalData = {
  latestClose: number;
  ema20: number;
  ema50: number;
  rsi14: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  sma200: number;
  score: number;
};

function calculateScore(
  latestClose: number,
  ema20: number,
  ema50: number,
  rsi14: number,
  macd: number,
  macdSignal: number,
  macdHistogram: number,
  sma200: number
) {
  let score = 50;

  if (ema20 > ema50) {
    score += 15;
  } else {
    score -= 15;
  }

  if (latestClose > ema20) {
    score += 10;
  } else {
    score -= 10;
  }

  if (rsi14 >= 55 && rsi14 < 70) {
    score += 10;
  } else if (rsi14 <= 45) {
    score -= 10;
  }

  if (macd > macdSignal) {
    score += 10;
  } else {
    score -= 10;
  }

  if (macdHistogram > 0) {
    score += 5;
  } else if (macdHistogram < 0) {
    score -= 5;
  }

  if (latestClose > sma200) {
    score += 10;
  } else {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

export default function TechnicalAnalysisCard() {
  const { activeSymbol } = useMarket();
  const symbol = activeSymbol.replace("NASDAQ:", "");

  const [data, setData] = useState<TechnicalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      try {
        setIsLoading(true);
        setError("");

        const to = Math.floor(Date.now() / 1000);
        const from = to - 60 * 60 * 24 * 400;

        const candles = await getHistoricalCandles(
          symbol,
          "D",
          from,
          to
        );

        const closingPrices = candles.map((candle) => candle.close);

        const latestClose = closingPrices.at(-1);
        const ema20 = getLatestEMA(closingPrices, 20);
        const ema50 = getLatestEMA(closingPrices, 50);
        const rsi14 = getLatestRSI(closingPrices, 14);
        const macdData = getLatestMACD(closingPrices);
        const sma200 = getLatestSMA(closingPrices, 200);

        if (
          latestClose === undefined ||
          ema20 === null ||
          ema50 === null ||
          rsi14 === null ||
          macdData === null ||
          sma200 === null
        ) {
          throw new Error(
            "Not enough historical candle data for technical analysis."
          );
        }

        const score = calculateScore(
          latestClose,
          ema20,
          ema50,
          rsi14,
          macdData.macd,
          macdData.signal,
          macdData.histogram,
          sma200
        );

        if (!cancelled) {
          setData({
            latestClose,
            ema20,
            ema50,
            rsi14,
            macd: macdData.macd,
            macdSignal: macdData.signal,
            macdHistogram: macdData.histogram,
            sma200,
            score,
          });
        }
      } catch (caughtError) {
        if (!cancelled) {
          setData(null);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to calculate technical analysis."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, [symbol]);

  if (isLoading) {
    return (
      <section className="rounded-xl bg-slate-900 p-6">
        <p className="text-slate-400">
          Loading technical analysis for {symbol}...
        </p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Technical Analysis</h2>

        <p className="mt-3 text-sm text-red-400">
          {error || "Technical analysis is unavailable."}
        </p>
      </section>
    );
  }

  const bullishTrend = data.ema20 > data.ema50;
  const priceAboveEMA20 = data.latestClose > data.ema20;
  const bullishMACD = data.macd > data.macdSignal;
  const priceAboveSMA200 = data.latestClose > data.sma200;

  const rsiLabel =
    data.rsi14 >= 70
      ? "Overbought"
      : data.rsi14 <= 30
        ? "Oversold"
        : data.rsi14 >= 55
          ? "Bullish Momentum"
          : data.rsi14 <= 45
            ? "Bearish Momentum"
            : "Neutral";

  const scoreColor =
    data.score >= 70
      ? "text-green-400"
      : data.score <= 40
        ? "text-red-400"
        : "text-yellow-400";

  return (
    <section className="rounded-xl bg-slate-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Technical Analysis</h2>

          <p className="mt-1 text-sm text-slate-400">
            Daily EMA, RSI, and MACD analysis for {symbol}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-400">Technical Score</p>

          <p className={`text-3xl font-bold ${scoreColor}`}>
            {data.score}/100
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-8">
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

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">SMA 200</p>
          <p className="mt-1 text-xl font-semibold">
            ${data.sma200.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">RSI 14</p>
          <p className="mt-1 text-xl font-semibold">
            {data.rsi14.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-slate-500">{rsiLabel}</p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">MACD</p>
          <p className="mt-1 text-xl font-semibold">
            {data.macd.toFixed(4)}
          </p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Signal</p>
          <p className="mt-1 text-xl font-semibold">
            {data.macdSignal.toFixed(4)}
          </p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm text-slate-400">Histogram</p>
          <p
            className={`mt-1 text-xl font-semibold ${
              data.macdHistogram >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {data.macdHistogram.toFixed(4)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-lg bg-slate-950 p-4 text-sm">
        <p className={bullishTrend ? "text-green-400" : "text-red-400"}>
          {bullishTrend ? "✓" : "✕"} EMA 20 is{" "}
          {bullishTrend ? "above" : "below"} EMA 50
        </p>

        <p
          className={
            priceAboveEMA20
              ? "text-green-400"
              : "text-yellow-400"
          }
        >
          {priceAboveEMA20 ? "✓" : "•"} Price is{" "}
          {priceAboveEMA20 ? "above" : "below"} EMA 20
        </p>

        <p
          className={
            data.rsi14 >= 55 && data.rsi14 < 70
              ? "text-green-400"
              : data.rsi14 <= 45
                ? "text-red-400"
                : "text-yellow-400"
          }
        >
          • RSI condition: {rsiLabel}
        </p>

        <p
          className={
            priceAboveSMA200 ? "text-green-400" : "text-red-400"
          }
        >
          {priceAboveSMA200 ? "✓" : "✕"} Price is{" "}
          {priceAboveSMA200 ? "above" : "below"} SMA 200
        </p>

        <p className={bullishMACD ? "text-green-400" : "text-red-400"}>
          {bullishMACD ? "✓" : "✕"} MACD is{" "}
          {bullishMACD ? "above" : "below"} the signal line
        </p>

        <p
          className={
            data.macdHistogram >= 0
              ? "text-green-400"
              : "text-red-400"
          }
        >
          {data.macdHistogram >= 0 ? "✓" : "✕"} MACD histogram is{" "}
          {data.macdHistogram >= 0 ? "positive" : "negative"}
        </p>
      </div>
    </section>
  );
}
