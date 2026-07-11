import {
  analyzeSymbol,
  type SymbolAnalysis,
} from "./analyzeSymbol";
import {
  DEFAULT_WATCHLIST,
  normalizeWatchlist,
} from "./watchlist";
import type { TradingMode } from "@/context/TradingModeContext";

export async function runScanner(
  symbols: string[] = [...DEFAULT_WATCHLIST],
  baseUrl?: string,
  tradingMode: TradingMode = "SWING"
): Promise<SymbolAnalysis[]> {
  const cleanSymbols = normalizeWatchlist(symbols);

  const analyses = await Promise.all(
    cleanSymbols.map(async (symbol) => {
      try {
        return await analyzeSymbol(
          symbol,
          baseUrl,
          tradingMode
        );
      } catch (error) {
        console.error(
          `Scanner skipped ${symbol} in ${tradingMode}:`,
          error
        );

        return null;
      }
    })
  );

  return analyses
    .filter(
      (analysis): analysis is SymbolAnalysis =>
        analysis !== null
    )
    .sort(
      (a, b) =>
        b.decision.score - a.decision.score
    );
}
