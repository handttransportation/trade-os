export type DecisionInput = {
  trendScore: number;
  momentumScore: number;
  volatilityScore: number;
  confidence: number;
};

export type TradeDecision = {
  action: "BUY" | "SELL" | "HOLD";
  score: number;
  explanation: string[];
};

export function makeDecision(
  input: DecisionInput
): TradeDecision {
  const score =
    input.trendScore +
    input.momentumScore +
    input.volatilityScore;

  const explanation: string[] = [];

  if (input.trendScore > 25) {
    explanation.push("Trend is bullish.");
  } else {
    explanation.push("Trend is weak.");
  }

  if (input.momentumScore > 25) {
    explanation.push("Momentum supports the trend.");
  } else {
    explanation.push("Momentum is neutral.");
  }

  if (input.volatilityScore > 15) {
    explanation.push("Volatility is favorable.");
  } else {
    explanation.push("Volatility is elevated.");
  }

  let action: TradeDecision["action"] = "HOLD";

  if (score >= 75) {
    action = "BUY";
  } else if (score <= 35) {
    action = "SELL";
  }

  return {
    action,
    score,
    explanation,
  };
}
