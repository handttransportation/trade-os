"use client";

import type { SymbolAnalysis } from "@/services/analyzeSymbol";
import { useMarket } from "@/context/MarketContext";

type ScannerTableProps = {
  results: SymbolAnalysis[];
};

export default function ScannerTable({
  results,
}: ScannerTableProps) {
  const { setActiveSymbol } = useMarket();

  function handleRowClick(symbol: string) {
    setActiveSymbol(`NASDAQ:${symbol}`);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-slate-800 bg-slate-950">
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4">Rank</th>
              <th className="px-5 py-4">Symbol</th>
              <th className="px-5 py-4">Signal</th>
              <th className="px-5 py-4">Score</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">RSI</th>
              <th className="px-5 py-4">ATR</th>
              <th className="px-5 py-4">Entry</th>
              <th className="px-5 py-4">Stop</th>
              <th className="px-5 py-4">Target</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {results.map((result, index) => {
              const action = result.decision.action;

              const signalClass =
                action === "BUY"
                  ? "bg-green-500/10 text-green-400"
                  : action === "SELL"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-yellow-500/10 text-yellow-400";

              return (
                <tr
                  key={result.symbol}
                  onClick={() => handleRowClick(result.symbol)}
                  className="cursor-pointer transition hover:bg-slate-800/70"
                >
                  <td className="px-5 py-4 text-slate-400">
                    #{index + 1}
                  </td>

                  <td className="px-5 py-4 font-semibold text-white">
                    {result.symbol}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${signalClass}`}
                    >
                      {action}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="min-w-28">
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-semibold">
                          {result.decision.score}
                        </span>
                        <span className="text-slate-500">/100</span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-800">
                        <div
                          className="h-2 rounded-full bg-sky-500"
                          style={{
                            width: `${Math.min(
                              100,
                              result.decision.score
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    ${result.currentPrice.toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {result.rsi14.toFixed(1)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    ${result.atr14.toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {result.riskPlan
                      ? `$${result.riskPlan.entry.toFixed(2)}`
                      : "—"}
                  </td>

                  <td className="px-5 py-4 text-red-300">
                    {result.riskPlan
                      ? `$${result.riskPlan.stopLoss.toFixed(2)}`
                      : "—"}
                  </td>

                  <td className="px-5 py-4 text-green-300">
                    {result.riskPlan
                      ? `$${result.riskPlan.takeProfit.toFixed(2)}`
                      : "—"}
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
