import type { TradingStrategy } from "../core/StrategyEngine";

export const breakoutStrategy: TradingStrategy = {
  name: "Breakout",

  analyze(market) {
    const range = market.high - market.low;
    const safeRange = range === 0 ? 1 : range;

    const positionInRange =
      (market.currentPrice - market.low) / safeRange;

    if (positionInRange >= 0.85 && market.currentPrice > market.open) {
      return {
        strategy: "Breakout",
        signal: "BUY",
        confidence: Math.min(
          90,
          Math.round(65 + positionInRange * 20)
        ),
        entry: market.currentPrice,
        stopLoss: market.currentPrice - safeRange * 0.35,
        takeProfit: market.currentPrice + safeRange * 0.7,
        reason: [
          "Price is trading near the session high.",
          "Current price is above the session open.",
          "The market may be attempting an upside breakout.",
        ],
      };
    }

    if (positionInRange <= 0.15 && market.currentPrice < market.open) {
      return {
        strategy: "Breakout",
        signal: "SELL",
        confidence: Math.min(
          90,
          Math.round(65 + (1 - positionInRange) * 20)
        ),
        entry: market.currentPrice,
        stopLoss: market.currentPrice + safeRange * 0.35,
        takeProfit: market.currentPrice - safeRange * 0.7,
        reason: [
          "Price is trading near the session low.",
          "Current price is below the session open.",
          "The market may be attempting a downside breakdown.",
        ],
      };
    }

    return {
      strategy: "Breakout",
      signal: "HOLD",
      confidence: 45,
      entry: market.currentPrice,
      stopLoss: market.currentPrice,
      takeProfit: market.currentPrice,
      reason: [
        "Price is not close enough to the session high or low.",
        "No confirmed breakout or breakdown is present.",
        "Wait for price to approach a key range boundary.",
      ],
    };
  },
};
