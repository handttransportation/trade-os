import type { SymbolAnalysis } from "./analyzeSymbol";
import { runScanner } from "./scanner";

export type MorningBriefing = {
  marketBias: "Bullish" | "Bearish" | "Mixed";
  averageScore: number;
  buySignals: number;
  holdSignals: number;
  sellSignals: number;
  bestOpportunity: string;
  strongestMomentum: string;
  highestVolatility: string;
  summary: string;
};

export function buildMorningBriefing(
  results: SymbolAnalysis[]
): MorningBriefing {
  if (results.length === 0) {
    throw new Error("Scanner returned no results.");
  }

  const buySignals = results.filter(
    (result) => result.decision.action === "BUY"
  ).length;

  const holdSignals = results.filter(
    (result) => result.decision.action === "HOLD"
  ).length;

  const sellSignals = results.filter(
    (result) => result.decision.action === "SELL"
  ).length;

  const averageScore = Math.round(
    results.reduce(
      (total, result) => total + result.decision.score,
      0
    ) / results.length
  );

  const marketBias =
    buySignals > sellSignals
      ? "Bullish"
      : sellSignals > buySignals
        ? "Bearish"
        : "Mixed";

  const bestOpportunity = [...results].sort(
    (a, b) => b.decision.score - a.decision.score
  )[0];

  const strongestMomentum = [...results].sort(
    (a, b) => b.momentumScore - a.momentumScore
  )[0];

  const highestVolatility = [...results].sort(
    (a, b) =>
      b.atr14 / b.currentPrice -
      a.atr14 / a.currentPrice
  )[0];

  const summary =
    `The market currently has a ${marketBias.toLowerCase()} bias with ` +
    `${buySignals} BUY, ${holdSignals} HOLD, and ${sellSignals} SELL signals. ` +
    `${bestOpportunity.symbol} is the highest-ranked opportunity, while ` +
    `${strongestMomentum.symbol} has the strongest momentum. ` +
    `${highestVolatility.symbol} has the highest current volatility.`;

  return {
    marketBias,
    averageScore,
    buySignals,
    holdSignals,
    sellSignals,
    bestOpportunity: bestOpportunity.symbol,
    strongestMomentum: strongestMomentum.symbol,
    highestVolatility: highestVolatility.symbol,
    summary,
  };
}

export async function generateMorningBriefing(
  baseUrl?: string
): Promise<MorningBriefing> {
  const results = await runScanner(undefined, baseUrl);

  return buildMorningBriefing(results);
}
