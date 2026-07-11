"use client";

import { usePortfolio } from "@/context/PortfolioContext";

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function PortfolioSummary() {
  const {
    accountValue,
    cash,
    positionsValue,
    unrealizedPnL,
    unrealizedPnLPercent,
    openPositions,
  } = usePortfolio();

  const isPositive = unrealizedPnL >= 0;

  return (
    <section className="rounded-xl bg-slate-900 p-6">
      <h3 className="text-lg font-semibold">
        Portfolio
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm text-slate-400">
            Account Value
          </p>
          <p className="text-2xl font-bold">
            {formatMoney(accountValue)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Positions Value
          </p>
          <p className="text-xl font-semibold">
            {formatMoney(positionsValue)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Unrealized P/L
          </p>

          <p
            className={`text-xl font-semibold ${
              isPositive
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {formatMoney(unrealizedPnL)}
          </p>

          <p
            className={`text-sm ${
              isPositive
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {unrealizedPnLPercent.toFixed(2)}%
          </p>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">
            Cash
          </span>
          <span>{formatMoney(cash)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-slate-400">
            Open Positions
          </span>
          <span>{openPositions}</span>
        </div>
      </div>
    </section>
  );
}
