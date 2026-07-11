"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import type { SymbolAnalysis } from "@/services/analyzeSymbol";
import { DEFAULT_WATCHLIST } from "@/services/watchlist";
import type { TradingMode } from "@/context/TradingModeContext";

type ScannerResponse = {
  generatedAt: string;
  tradingMode: TradingMode;
  count: number;
  results: SymbolAnalysis[];
  error?: string;
};

const DEFAULT_SCANNER_SYMBOLS: string[] = [
  ...DEFAULT_WATCHLIST,
];

export function useScanner(
  symbols: string[] = DEFAULT_SCANNER_SYMBOLS,
  tradingMode: TradingMode = "SWING"
) {
  const [results, setResults] =
    useState<SymbolAnalysis[]>([]);

  const [generatedAt, setGeneratedAt] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = new URLSearchParams({
        symbols: symbols.join(","),
        mode: tradingMode,
      });

      const response = await fetch(
        `/api/scanner?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data =
        (await response.json()) as ScannerResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to run market scanner."
        );
      }

      setResults(data.results);
      setGeneratedAt(data.generatedAt);
    } catch (caughtError) {
      setResults([]);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to run market scanner."
      );
    } finally {
      setIsLoading(false);
    }
  }, [symbols, tradingMode]);

  useEffect(() => {
    const initialLoad =
      window.setTimeout(() => {
        void refresh();
      }, 0);

    return () =>
      window.clearTimeout(initialLoad);
  }, [refresh]);

  return {
    results,
    generatedAt,
    isLoading,
    error,
    refresh,
  };
}
