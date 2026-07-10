"use client";

import { usePortfolio } from "@/context/PortfolioContext";

export default function PositionsTable() {
  const { positions } = usePortfolio();

  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">
          Open Positions
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Current holdings and unrealized profit/loss.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3">Symbol</th>
              <th className="pb-3">Qty</th>
              <th className="pb-3">Avg</th>
              <th className="pb-3">Current</th>
              <th className="pb-3 text-right">P/L</th>
            </tr>
          </thead>

          <tbody>
            {positions.map((position) => {
              const pnl =
                (position.currentPrice -
                  position.averagePrice) *
                position.quantity;

              const positive = pnl >= 0;

              return (
                <tr
                  key={position.symbol}
                  className="border-b border-slate-800"
                >
                  <td className="py-4 font-semibold">
                    {position.symbol}
                  </td>

                  <td>{position.quantity}</td>

                  <td>
                    ${position.averagePrice.toFixed(2)}
                  </td>

                  <td>
                    ${position.currentPrice.toFixed(2)}
                  </td>

                  <td
                    className={`text-right font-semibold ${
                      positive
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {positive ? "+" : "-"}$
                    {Math.abs(pnl).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
