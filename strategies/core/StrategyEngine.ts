import type {
  MarketSnapshot,
  Signal,
  StrategyResult,
} from "./StrategyTypes";
import { buildRiskPlan } from "./RiskEngine";

export type TradingStrategy = {
  name: string;
  analyze: (market: MarketSnapshot) => StrategyResult;
};

export type CombinedStrategyResult = {
  symbol: string;
  signal: Signal;
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  rewardRiskRatio: number;
  results: StrategyResult[];
};

function calculateCombinedSignal(
  results: StrategyResult[]
): Signal {
  const buyScore = results
    .filter((result) => result.signal === "BUY")
    .reduce((total, result) => total + result.confidence, 0);

  const sellScore = results
    .filter((result) => result.signal === "SELL")
    .reduce((total, result) => total + result.confidence, 0);

  if (buyScore > sellScore && buyScore > 0) {
    return "BUY";
  }

  if (sellScore > buyScore && sellScore > 0) {
    return "SELL";
  }

  return "HOLD";
}

function calculateAverageConfidence(
  results: StrategyResult[],
  signal: Signal
) {
  const matchingResults = results.filter(
    (result) => result.signal === signal
  );

  if (matchingResults.length === 0) {
    return 0;
  }

  const totalConfidence = matchingResults.reduce(
    (total, result) => total + result.confidence,
    0
  );

  return Math.round(totalConfidence / matchingResults.length);
}

export function runStrategyEngine(
  market: MarketSnapshot,
  strategies: TradingStrategy[]
): CombinedStrategyResult {
  const results = strategies.map((strategy) =>
    strategy.analyze(market)
  );

  const signal = calculateCombinedSignal(results);
  const confidence = calculateAverageConfidence(results, signal);

  const fallbackATR = Math.max(
    market.currentPrice * 0.01,
    market.high - market.low
  );

  const atr = market.atr ?? fallbackATR;

  const riskPlan =
    signal === "SELL"
      ? buildRiskPlan(market.currentPrice, atr, "SHORT")
      : buildRiskPlan(market.currentPrice, atr, "LONG");

  return {
    symbol: market.symbol,
    signal,
    confidence,
    entry: riskPlan.entry,
    stopLoss: riskPlan.stopLoss,
    takeProfit: riskPlan.takeProfit,
    rewardRiskRatio: riskPlan.rewardRiskRatio,
    results,
  };
}
