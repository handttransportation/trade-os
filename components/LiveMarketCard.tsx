"use client";

import { useEffect, useState } from "react";
import { useMarket } from "@/context/MarketContext";
import { getQuote } from "../services/marketData";

type Quote = {
  symbol: string;
  currentPrice: number;
  changePercent: number;
};

export default function LiveMarketCard() {
  const { activeSymbol } = useMarket();
  const symbol = activeSymbol.replace("NASDAQ:", "");

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadQuote() {
      setIsLoading(true);

      const data = await getQuote(symbol);
      setQuote(data);

      setIsLoading(false);
    }

    loadQuote();
  }, [symbol]);

  if (isLoading) {
    return (
      <div className="rounded-xl bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Market Overview</p>
        <p className="mt-3 text-xl font-semibold text-slate-500">Loading...</p>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="rounded-xl bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Market Overview</p>
        <p className="mt-3 text-xl font-semibold text-red-400">Unavailable</p>
      </div>
    );
  }

  const isPositive = quote.changePercent >= 0;

  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <p className="text-sm text-slate-400">Market Overview</p>
      <p className="mt-3 text-2xl font-bold">{quote.symbol}</p>
      <p className="text-lg font-semibold">${quote.currentPrice.toFixed(2)}</p>
      <p className={isPositive ? "text-green-400" : "text-red-400"}>
        {isPositive ? "+" : ""}
        {quote.changePercent.toFixed(2)}%
      </p>
    </div>
  );
}