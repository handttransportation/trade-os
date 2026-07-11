import type { SymbolAnalysis } from "./analyzeSymbol";

export type TradePlan = {
  symbol: string;
  direction: "BUY" | "SELL" | "HOLD";
  confidence: number;

  entry: number;
  stopLoss: number;

  takeProfit1: number;
  takeProfit2: number;

  riskReward: number;

  explanation: string[];

  riskLevel: "Low" | "Medium" | "High";
};

export function buildTradePlan(
  analysis: SymbolAnalysis
): TradePlan {
  const {
    symbol,
    currentPrice,
    atr14,
    decision,
    explanation,
  } = analysis;

  const entry = currentPrice;

  let stopLoss = currentPrice;
  let tp1 = currentPrice;
  let tp2 = currentPrice;

  if (decision.action === "BUY") {
    stopLoss = currentPrice - atr14;
    tp1 = currentPrice + atr14 * 2;
    tp2 = currentPrice + atr14 * 3;
  }

  if (decision.action === "SELL") {
    stopLoss = currentPrice + atr14;
    tp1 = currentPrice - atr14 * 2;
    tp2 = currentPrice - atr14 * 3;
  }

  const risk = Math.abs(entry - stopLoss);

  const reward = Math.abs(tp1 - entry);

  const riskReward =
    risk === 0
      ? 0
      : Number((reward / risk).toFixed(2));

  let riskLevel: "Low" | "Medium" | "High" =
    "Medium";

  if (atr14 / currentPrice < 0.01) {
    riskLevel = "Low";
  } else if (atr14 / currentPrice > 0.03) {
    riskLevel = "High";
  }

  return {
    symbol,

    direction: decision.action,

    confidence: decision.score,

    entry,

    stopLoss,

    takeProfit1: tp1,

    takeProfit2: tp2,

    riskReward,

    explanation,

    riskLevel,
  };
}
