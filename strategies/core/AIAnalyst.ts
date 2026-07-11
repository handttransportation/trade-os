import type { TradeDecision } from "./DecisionEngine";

export type AnalysisInput = {
  symbol: string;
  price: number;
  confidence: number;
  decision: TradeDecision;
};

export function buildAnalysis(
  input: AnalysisInput
): string[] {
  const analysis: string[] = [];

  analysis.push(
    `${input.symbol} is trading at $${input.price.toFixed(2)}.`
  );

  analysis.push(
    `Trade confidence is ${input.confidence}%.`
  );

  switch (input.decision.action) {
    case "BUY":
      analysis.push(
        "Current technical conditions favor a long position."
      );
      break;

    case "SELL":
      analysis.push(
        "Current technical conditions favor a short position."
      );
      break;

    default:
      analysis.push(
        "Current technical conditions do not provide a high-quality setup."
      );
      break;
  }

  analysis.push(...input.decision.explanation);

  return analysis;
}
