import type { IndicatorSnapshot } from "./IndicatorEngine";

export type MarketScores = {
  trendScore: number;
  momentumScore: number;
  volatilityScore: number;
  totalScore: number;
};

export function calculateMarketScores(
  currentPrice: number,
  indicators: IndicatorSnapshot
): MarketScores {
  let trendScore = 0;
  let momentumScore = 0;

  if (indicators.fastEma > indicators.slowEma) {
    trendScore += 15;
  }

  if (currentPrice > indicators.fastEma) {
    trendScore += 10;
  }

  if (
    indicators.longTermSma === null ||
    currentPrice > indicators.longTermSma
  ) {
    trendScore += 15;
  }

  if (indicators.rsi >= 50 && indicators.rsi < 70) {
    momentumScore += 15;
  } else if (
    indicators.rsi >= 40 &&
    indicators.rsi < 50
  ) {
    momentumScore += 7;
  }

  if (indicators.macd > indicators.macdSignal) {
    momentumScore += 15;
  }

  if (indicators.macdHistogram > 0) {
    momentumScore += 10;
  }

  const atrPercent =
    (indicators.atr / currentPrice) * 100;

  const volatilityScore =
    atrPercent >= 1 && atrPercent <= 4
      ? 20
      : atrPercent > 0 && atrPercent < 6
        ? 10
        : 0;

  return {
    trendScore,
    momentumScore,
    volatilityScore,
    totalScore:
      trendScore + momentumScore + volatilityScore,
  };
}
