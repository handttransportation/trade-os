"use client";

import MarketTicker from "./MarketTicker";
import { useMarketData } from "@/context/MarketDataContext";

const symbols = ["QQQ", "SPY", "AAPL", "NVDA", "TSLA"];

export default function MarketRibbon() {
  const { quotes, isLoading, error } = useMarketData();

  if (isLoading) {
    return (
      <div className="mb-8 text-sm text-slate-500">
        Loading market data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 text-sm text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex gap-4">
        {symbols.map((symbol) => {
          const quote = quotes[symbol];

          if (!quote) {
            return null;
          }

          const isPositive = quote.changePercent >= 0;

          return (
            <MarketTicker
              key={symbol}
              symbol={symbol}
              price={`$${quote.currentPrice.toFixed(2)}`}
              change={`${isPositive ? "+" : ""}${quote.changePercent.toFixed(
                2
              )}%`}
              isPositive={isPositive}
            />
          );
        })}
      </div>
    </div>
  );
}
