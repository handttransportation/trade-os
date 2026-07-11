"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { SymbolAnalysis } from "@/services/analyzeSymbol";
import { buildTradePlan } from "@/services/tradePlanner";
import PositionSizeCard from "./PositionSizeCard";
import { usePortfolio } from "@/context/PortfolioContext";

type TradePlanCardProps = {
  analysis: SymbolAnalysis;
};

type OrderMessage = {
  type: "success" | "error";
  text: string;
};

export default function TradePlanCard({
  analysis,
}: TradePlanCardProps) {
  const plan = useMemo(
    () => buildTradePlan(analysis),
    [analysis]
  );

  const { placePaperOrder } = usePortfolio();

  const [quantity, setQuantity] = useState(1);
  const [orderMessage, setOrderMessage] =
    useState<OrderMessage | null>(null);

  useEffect(() => {
    if (!orderMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setOrderMessage(null);
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [orderMessage]);

  const directionClass =
    plan.direction === "BUY"
      ? "text-green-400"
      : plan.direction === "SELL"
        ? "text-red-400"
        : "text-yellow-400";

  const riskClass =
    plan.riskLevel === "Low"
      ? "text-green-400"
      : plan.riskLevel === "High"
        ? "text-red-400"
        : "text-yellow-400";

  const hasTradeSetup = plan.direction !== "HOLD";
  const validQuantity =
    Number.isInteger(quantity) && quantity > 0;

  function submitPaperOrder(
    side: "BUY" | "SELL"
  ) {
    if (!hasTradeSetup) {
      setOrderMessage({
        type: "error",
        text: "No active trade setup is available.",
      });
      return;
    }

    if (!validQuantity) {
      setOrderMessage({
        type: "error",
        text: "Quantity must be a whole number greater than zero.",
      });
      return;
    }

    const result = placePaperOrder({
      symbol: plan.symbol,
      quantity,
      price: plan.entry,
      side,
      placedAt: new Date().toISOString(),
    });

    setOrderMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-sky-400">
            AI Trade Plan
          </p>

          <div className="mt-2 flex items-center gap-3">
            <h3 className="text-2xl font-bold">
              {plan.symbol}
            </h3>

            <span
              className={`rounded-full bg-slate-900 px-3 py-1 text-sm font-semibold ${directionClass}`}
            >
              {plan.direction}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-slate-500">
            Confidence
          </p>

          <p className="text-3xl font-bold text-sky-400">
            {plan.confidence}%
          </p>
        </div>
      </div>

      {hasTradeSetup ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-6">
            <div className="rounded-lg bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Entry
              </p>
              <p className="mt-1 text-lg font-semibold">
                ${plan.entry.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Stop Loss
              </p>
              <p className="mt-1 text-lg font-semibold text-red-300">
                ${plan.stopLoss.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Target 1
              </p>
              <p className="mt-1 text-lg font-semibold text-green-300">
                ${plan.takeProfit1.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Target 2
              </p>
              <p className="mt-1 text-lg font-semibold text-green-300">
                ${plan.takeProfit2.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Reward / Risk
              </p>
              <p className="mt-1 text-lg font-semibold">
                1 : {plan.riskReward.toFixed(2)}
              </p>
            </div>

            <div className="rounded-lg bg-slate-900 p-4">
              <p className="text-xs text-slate-500">
                Risk Level
              </p>
              <p
                className={`mt-1 text-lg font-semibold ${riskClass}`}
              >
                {plan.riskLevel}
              </p>
            </div>
          </div>

          <PositionSizeCard
            entry={plan.entry}
            stopLoss={plan.stopLoss}
          />

          <div className="mt-5 rounded-lg bg-slate-900 p-5">
            <p className="text-sm font-semibold">
              Why this setup?
            </p>

            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {plan.explanation.map((reason, index) => (
                <li key={`${reason}-${index}`}>
                  • {reason}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-5">
          <p className="font-semibold text-yellow-400">
            No active trade setup
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Current conditions do not meet the required quality
            threshold. Trade OS recommends waiting for stronger
            confirmation.
          </p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-xs">
            <label
              htmlFor="paper-order-quantity"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Paper order quantity
            </label>

            <input
              id="paper-order-quantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(Number(event.target.value))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
            />

            <p className="mt-2 text-xs text-slate-500">
              Estimated value: $
              {(plan.entry * Math.max(quantity, 0)).toFixed(2)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submitPaperOrder("BUY")}
              disabled={!hasTradeSetup || !validQuantity}
              className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Paper Buy
            </button>

            <button
              type="button"
              onClick={() => submitPaperOrder("SELL")}
              disabled={!hasTradeSetup || !validQuantity}
              className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Paper Sell
            </button>
          </div>
        </div>

        {orderMessage && (
          <div
            role="status"
            className={`mt-4 rounded-lg border p-4 text-sm ${
              orderMessage.type === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-300"
                : "border-red-500/20 bg-red-500/10 text-red-300"
            }`}
          >
            {orderMessage.text}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-slate-600">
        Technical research only. This is not financial advice or
        a guarantee of market performance.
      </p>
    </div>
  );
}
