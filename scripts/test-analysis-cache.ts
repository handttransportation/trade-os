import type { SymbolAnalysis } from "../services/analyzeSymbol";

import {
  clearAnalysisCache,
  getAnalysisCacheSize,
  getCachedAnalysis,
  setCachedAnalysis,
} from "../services/analysisCache";

const mockAnalysis = {
  symbol: "QQQ",
  tradingMode: "SWING",
} as unknown as SymbolAnalysis;

clearAnalysisCache();
setCachedAnalysis(mockAnalysis);

console.log(
  "Swing:",
  getCachedAnalysis("QQQ", "SWING")
);

console.log(
  "Day Trade:",
  getCachedAnalysis("QQQ", "DAY_TRADE")
);

console.log(
  "Cache size:",
  getAnalysisCacheSize()
);
