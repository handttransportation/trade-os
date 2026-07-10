"use client";

import { useEffect, useState } from "react";
import { useMarket } from "@/context/MarketContext";
import { getQuote } from "../services/marketData";

type WatchlistItem = {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
};

const watchlistSymbols = ["QQQ", "SPY", "AAPL", "NVDA", "TSLA"];

export default function WatchlistPanel() {
  const { setActiveSymbol } = useMarket();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWatchlist() {
      setIsLoading(true);

      const results = await Promise.all(
        watchlistSymbols.map(async (symbol) => {
          const quote = await getQuote(symbol);

          return {
            symbol,
            price: `$${quote.currentPrice.toFixed(2)}`,
            change: `${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%`,
            isPositive: quote.changePercent >= 0,
          };
        })
      );

      setItems(results);
      setIsLoading(false);
    }

    loadWatchlist();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Watchlist</p>
        <p className="mt-3 text-slate-500">Loading watchlist...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <h3 className="text-lg font-semibold">Watchlist</h3>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <button
            key={item.symbol}
            onClick={() => setActiveSymbol(`NASDAQ:${item.symbol}`)}
            className="flex w-full items-center justify-between rounded-lg bg-slate-950 px-4 py-3 text-left hover:bg-slate-800"
          >
            <div>
              <p className="font-semibold">{item.symbol}</p>
              <p className="text-xs text-slate-400">{item.price}</p>
            </div>

            <p
              className={
                item.isPositive ? "text-sm text-green-400" : "text-sm text-red-400"
              }
            >
              {item.change}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}