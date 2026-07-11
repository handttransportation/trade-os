"use client";

import { usePortfolio } from "@/context/PortfolioContext";

type PositionsTableProps = {
  embedded?: boolean;
};

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export default function PositionsTable({
  embedded = false,
}: PositionsTableProps) {
  const { positions } = usePortfolio();

  const content = (
    <>
      {positions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/50 px-6 py-12 text-center">
          <p className="font-semibold text-slate-300">
            No open positions
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Paper trades will appear here after an order is filled.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3 font-medium">Symbol</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Average</th>
                <th className="px-4 py-3 font-medium">Current</th>
                <th className="px-4 py-3 font-medium">
                  Market Value
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  P/L
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {positions.map((position) => {
                const costBasis =
                  position.averagePrice * position.quantity;

                const marketValue =
                  position.currentPrice * position.quantity;

                const pnl = marketValue - costBasis;

                const pnlPercent =
                  costBasis === 0
                    ? 0
                    : (pnl / costBasis) * 100;

                const positive = pnl >= 0;

                return (
                  <tr
                    key={position.symbol}
                    className="transition hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">
                        {position.symbol}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Paper position
                      </p>
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      {position.quantity}
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      {formatMoney(position.averagePrice)}
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      {formatMoney(position.currentPrice)}
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-200">
                      {formatMoney(marketValue)}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <p
                        className={`font-semibold ${
                          positive
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {formatMoney(pnl)}
                      </p>

                      <p
                        className={`mt-1 text-xs ${
                          positive
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {positive ? "+" : ""}
                        {pnlPercent.toFixed(2)}%
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg backdrop-blur-sm">
      <div className="border-b border-slate-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">
          Open Positions
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Current paper-trading holdings and unrealized performance.
        </p>
      </div>

      <div className="p-6">
        {content}
      </div>
    </section>
  );
}
