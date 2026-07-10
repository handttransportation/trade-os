"use client";

import { usePortfolio } from "@/context/PortfolioContext";

export default function PortfolioSummary() {
  const {
    accountValue,
    totalProfitLoss,
    openPositions,
    cash,
  } = usePortfolio();

  const isPositive = totalProfitLoss >= 0;

  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <h3 className="text-lg font-semibold">Portfolio</h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm text-slate-400">Account Value</p>
          <p className="text-2xl font-bold">
            ${accountValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Unrealized P/L</p>
          <p
            className={`text-xl font-semibold ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : "-"}$
            {Math.abs(totalProfitLoss).toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Open Positions</p>
          <p className="text-xl font-semibold">{openPositions}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Cash</p>
          <p className="text-xl font-semibold">
            ${cash.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
