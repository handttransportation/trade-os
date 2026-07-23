import type { TradingMode } from "@/context/TradingModeContext";
import type { SymbolAnalysis } from "./analyzeSymbol";

type AnalysisCacheEntry = {
  analysis: SymbolAnalysis;
  expiresAt: number;
};

const analysisCache =
  new Map<string, AnalysisCacheEntry>();

function buildCacheKey(
  symbol: string,
  tradingMode: TradingMode
) {
  return `${symbol.trim().toUpperCase()}:${tradingMode}`;
}

function getCacheDuration(
  tradingMode: TradingMode
) {
  const fiveMinutes = 5 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;

  return tradingMode === "DAY_TRADE"
    ? fiveMinutes
    : oneHour;
}

export function getCachedAnalysis(
  symbol: string,
  tradingMode: TradingMode
): SymbolAnalysis | undefined {
  const key = buildCacheKey(symbol, tradingMode);
  const entry = analysisCache.get(key);

  if (!entry) {
    return undefined;
  }

  if (Date.now() >= entry.expiresAt) {
    analysisCache.delete(key);
    return undefined;
  }

  return entry.analysis;
}

export function setCachedAnalysis(
  analysis: SymbolAnalysis
) {
  const key = buildCacheKey(
    analysis.symbol,
    analysis.tradingMode
  );

  analysisCache.set(key, {
    analysis,
    expiresAt:
      Date.now() +
      getCacheDuration(analysis.tradingMode),
  });
}

export function deleteCachedAnalysis(
  symbol: string,
  tradingMode: TradingMode
) {
  analysisCache.delete(
    buildCacheKey(symbol, tradingMode)
  );
}

export function clearAnalysisCache() {
  analysisCache.clear();
}

export function getAnalysisCacheSize() {
  return analysisCache.size;
}
