"use client";

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getQuote } from "../services/marketData";

export type MarketQuote = {
  symbol: string;
  currentPrice: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  change: number;
  changePercent: number;
};

type MarketDataContextType = {
  quotes: Record<string, MarketQuote>;
  isLoading: boolean;
  error: string;
  refreshQuotes: () => Promise<void>;
};

const trackedSymbols = ["QQQ", "SPY", "AAPL", "NVDA", "TSLA"];

const MarketDataContext = createContext<MarketDataContextType | undefined>(
  undefined
);

export function MarketDataProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function refreshQuotes() {
    try {
      setIsLoading(true);

      const results = await Promise.all(
        trackedSymbols.map((symbol) => getQuote(symbol))
      );

      const quoteMap = results.reduce<Record<string, MarketQuote>>(
        (accumulator, quote) => {
          accumulator[quote.symbol] = quote;
          return accumulator;
        },
        {}
      );

      setQuotes(quoteMap);
      setError("");
    } catch {
      setError("Unable to load market data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    refreshQuotes();

    const interval = window.setInterval(refreshQuotes, 60000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <MarketDataContext.Provider
      value={{
        quotes,
        isLoading,
        error,
        refreshQuotes,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);

  if (!context) {
    throw new Error(
      "useMarketData must be used inside MarketDataProvider"
    );
  }

  return context;
}