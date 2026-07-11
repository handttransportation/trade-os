import type { TradePlan } from "./tradePlanner";

export type TradingCoachResponse = {
  title: string;
  summary: string;
  strengths: string[];
  cautions: string[];
};

export function buildTradingCoach(
  plan: TradePlan
): TradingCoachResponse {
  const strengths = [...plan.explanation];
  const cautions: string[] = [];

  if (plan.riskLevel === "High") {
    cautions.push(
      "Volatility is elevated. Consider reducing position size."
    );
  }

  if (plan.direction === "HOLD") {
    cautions.push(
      "Current setup does not meet the quality threshold."
    );
  }

  if (plan.confidence < 70) {
    cautions.push(
      "Confidence is below the preferred trading threshold."
    );
  }

  const summary =
    plan.direction === "BUY"
      ? `The current technical picture favors a long position with ${plan.confidence}% confidence.`
      : plan.direction === "SELL"
        ? `The current technical picture favors a short position with ${plan.confidence}% confidence.`
        : "The market currently lacks a high-quality setup. Waiting is the preferred action.";

  return {
    title: `${plan.symbol} AI Trading Coach`,
    summary,
    strengths,
    cautions,
  };
}
