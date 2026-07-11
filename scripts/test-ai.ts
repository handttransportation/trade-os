import { makeDecision } from "../strategies/core/DecisionEngine";
import { buildAnalysis } from "../strategies/core/AIAnalyst";

const decision = makeDecision({
  trendScore: 35,
  momentumScore: 30,
  volatilityScore: 18,
  confidence: 88,
});

console.log(
  buildAnalysis({
    symbol: "AAPL",
    price: 212.34,
    confidence: 88,
    decision,
  })
);
