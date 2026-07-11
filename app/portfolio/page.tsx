"use client";

import { usePortfolio } from "@/context/PortfolioContext";
import PositionsTable from "@/components/PositionsTable";

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function PortfolioPage() {
  const {
    cash,
    totalCost,
    positionsValue,
    accountValue,
    unrealizedPnL,
    unrealizedPnLPercent,
    openPositions,
  } = usePortfolio();

  const isPositive = unrealizedPnL >= 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Portfolio
        </h1>

        <p className="mt-2 text-slate-400">
          Track holdings, exposure, and unrealized
          performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Account Value
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatMoney(accountValue)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Cash
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatMoney(cash)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Cost Basis
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatMoney(totalCost)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Market Value
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatMoney(positionsValue)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-5">
          <p className="text-sm text-slate-400">
            Unrealized P/L
          </p>

          <p
            className={`mt-2 text-2xl font-bold ${
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
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Holdings
            </h2>
            <p className="text-sm text-slate-400">
              {openPositions} open positions
            </p>
          </div>
        </div>

        <PositionsTable />
      </div>
    </div>
  );
}
