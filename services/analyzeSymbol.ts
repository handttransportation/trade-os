import { getQuote } from "./marketData";
import { getHistoricalCandles } from "./historicalData";
import {
  calculateIndicators,
  type IndicatorSnapshot,
} from "@/strategies/core/IndicatorEngine";
import {
  calculateMarketScores,
  type MarketScores,
} from "@/strategies/core/ScoringEngine";
import {
  makeDecision,
  type TradeDecision,
} from "@/strategies/core/DecisionEngine";
import type { RiskPlan } from "@/strategies/core/RiskEngine";
import { buildAnalysis } from "@/strategies/core/AIAnalyst";
import {
  getTradingModeConfig,
  type TradingModeConfig,
} from "@/strategies/core/TradingModeConfig";
import type { TradingMode } from "@/context/TradingModeContext";

export type SymbolAnalysis = {
  symbol: string;
  tradingMode: TradingMode;
  modeLabel: string;
  resolution: string;

  currentPrice: number;

  fastEma: number;
  slowEma: number;
  longTermSma: number | null;
  fastEmaPeriod: number;
  slowEmaPeriod: number;
  longTermSmaPeriod: number | null;

  rsi: number;
  atr: number;

  macd: number;
  macdSignal: number;
  macdHistogram: number;

  trendScore: number;
  momentumScore: number;
  volatilityScore: number;

  decision: TradeDecision;
  riskPlan: RiskPlan | null;
  explanation: string[];

  /*
   * Temporary compatibility fields.
   * Existing UI components still use these names.
   */
  ema20: number;
  ema50: number;
  sma200: number;
  rsi14: number;
  atr14: number;
};

function buildConfiguredRiskPlan(
  currentPrice: number,
  indicators: IndicatorSnapshot,
  decision: TradeDecision,
  config: TradingModeConfig
): RiskPlan | null {
  if (decision.action === "HOLD") {
    return null;
  }

  const direction =
    decision.action === "BUY" ? "LONG" : "SHORT";

  const isLong = direction === "LONG";

  const stopDistance =
    indicators.atr * config.stopAtrMultiplier;

  const targetDistance =
    indicators.atr * config.secondTargetAtrMultiplier;

  const stopLoss = isLong
    ? currentPrice - stopDistance
    : currentPrice + stopDistance;

  const takeProfit = isLong
    ? currentPrice + targetDistance
    : currentPrice - targetDistance;

  const riskPerShare = Math.abs(
    currentPrice - stopLoss
  );

  const rewardPerShare = Math.abs(
    takeProfit - currentPrice
  );

  return {
    entry: currentPrice,
    stopLoss,
    takeProfit,
    riskPerShare,
    rewardPerShare,
    rewardRiskRatio:
      riskPerShare === 0
        ? 0
        : rewardPerShare / riskPerShare,
  };
}

function createDecision(
  scores: MarketScores
): TradeDecision {
  return makeDecision({
    trendScore: scores.trendScore,
    momentumScore: scores.momentumScore,
    volatilityScore: scores.volatilityScore,
    confidence: scores.totalScore,
  });
}

export async function analyzeSymbol(
  symbol: string,
  baseUrl?: string,
  tradingMode: TradingMode = "SWING"
): Promise<SymbolAnalysis> {
  const cleanSymbol = symbol.trim().toUpperCase();
  const config = getTradingModeConfig(tradingMode);

  const to = Math.floor(Date.now() / 1000);
  const from =
    to - 60 * 60 * 24 * config.historyDays;

  const [quote, candles] = await Promise.all([
    getQuote(cleanSymbol, baseUrl),
    getHistoricalCandles(
      cleanSymbol,
      config.resolution,
      from,
      to,
      baseUrl
    ),
  ]);

  const indicators = calculateIndicators(
    candles,
    config
  );

  const scores = calculateMarketScores(
    quote.currentPrice,
    indicators
  );

  const decision = createDecision(scores);

  const riskPlan = buildConfiguredRiskPlan(
    quote.currentPrice,
    indicators,
    decision,
    config
  );

  const explanation = buildAnalysis({
    symbol: cleanSymbol,
    price: quote.currentPrice,
    confidence: scores.totalScore,
    decision,
  });

  return {
    symbol: cleanSymbol,
    tradingMode,
    modeLabel: config.label,
    resolution: config.resolution,

    currentPrice: quote.currentPrice,

    fastEma: indicators.fastEma,
    slowEma: indicators.slowEma,
    longTermSma: indicators.longTermSma,
    fastEmaPeriod: config.fastEmaPeriod,
    slowEmaPeriod: config.slowEmaPeriod,
    longTermSmaPeriod: config.longTermSmaPeriod,

    rsi: indicators.rsi,
    atr: indicators.atr,

    macd: indicators.macd,
    macdSignal: indicators.macdSignal,
    macdHistogram: indicators.macdHistogram,

    trendScore: scores.trendScore,
    momentumScore: scores.momentumScore,
    volatilityScore: scores.volatilityScore,

    decision,
    riskPlan,
    explanation,

    ema20: indicators.fastEma,
    ema50: indicators.slowEma,
    sma200:
      indicators.longTermSma ??
      indicators.slowEma,
    rsi14: indicators.rsi,
    atr14: indicators.atr,
  };
}
