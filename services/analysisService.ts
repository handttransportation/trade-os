import type { TradingMode } from "@/context/TradingModeContext";

import {
  analyzeSymbol,
  type SymbolAnalysis,
} from "./analyzeSymbol";

import {
  deleteCachedAnalysis,
  getCachedAnalysis,
  setCachedAnalysis,
} from "./analysisCache";

const pendingAnalyses =
  new Map<string, Promise<SymbolAnalysis>>();

function buildRequestKey(
  symbol: string,
  tradingMode: TradingMode
) {
  return `${symbol.trim().toUpperCase()}:${tradingMode}`;
}

export async function getAnalysis(
  symbol: string,
  baseUrl?: string,
  tradingMode: TradingMode = "SWING"
): Promise<SymbolAnalysis> {
  const cleanSymbol =
    symbol.trim().toUpperCase();

  const cached = getCachedAnalysis(
    cleanSymbol,
    tradingMode
  );

  if (cached) {
    return cached;
  }

  const requestKey = buildRequestKey(
    cleanSymbol,
    tradingMode
  );

  const existingRequest =
    pendingAnalyses.get(requestKey);

  if (existingRequest) {
    return existingRequest;
  }

  const request = analyzeSymbol(
    cleanSymbol,
    baseUrl,
    tradingMode
  )
    .then((analysis) => {
      setCachedAnalysis(analysis);
      return analysis;
    })
    .finally(() => {
      pendingAnalyses.delete(requestKey);
    });

  pendingAnalyses.set(requestKey, request);

  return request;
}

export async function refreshAnalysis(
  symbol: string,
  baseUrl?: string,
  tradingMode: TradingMode = "SWING"
): Promise<SymbolAnalysis> {
  const cleanSymbol =
    symbol.trim().toUpperCase();

  deleteCachedAnalysis(
    cleanSymbol,
    tradingMode
  );

  return getAnalysis(
    cleanSymbol,
    baseUrl,
    tradingMode
  );
}
