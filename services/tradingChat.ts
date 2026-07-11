import type { SymbolAnalysis } from "./analyzeSymbol";
import { buildTradePlan } from "./tradePlanner";
import { buildTradingCoach } from "./tradingCoach";

export type TradingChatResponse = {
  question: string;
  answer: string;
};

export function answerTradingQuestion(
  question: string,
  analysis: SymbolAnalysis
): TradingChatResponse {
  const plan = buildTradePlan(analysis);
  const coach = buildTradingCoach(plan);

  const lower = question.toLowerCase();

  let answer = coach.summary;

  if (lower.includes("why")) {
    answer = coach.strengths.join(" ");
  } else if (lower.includes("risk")) {
    answer =
      `Risk level: ${plan.riskLevel}. ` +
      `Reward/Risk ratio: 1:${plan.riskReward.toFixed(2)}.`;
  } else if (lower.includes("target")) {
    answer =
      `Target 1: $${plan.takeProfit1.toFixed(2)}. ` +
      `Target 2: $${plan.takeProfit2.toFixed(2)}.`;
  } else if (lower.includes("stop")) {
    answer =
      `Suggested stop loss: $${plan.stopLoss.toFixed(2)}.`;
  }

  return {
    question,
    answer,
  };
}
