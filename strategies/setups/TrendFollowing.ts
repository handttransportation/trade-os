import type { TradingStrategy } from "../core/StrategyEngine";

export const trendFollowingStrategy: TradingStrategy = {
  name: "Trend Following",

  analyze(market) {
    const priceChange =
      market.currentPrice - market.previousClose;

    const changePercent =
      (priceChange / market.previousClose) * 100;

    if (changePercent >= 1) {
      return {
        strategy: "Trend Following",
        signal: "BUY",
        confidence: Math.min(
          90,
          Math.round(65 + changePercent * 8)
        ),
        entry: market.currentPrice,
        stopLoss: market.currentPrice * 0.985,
        takeProfit: market.currentPrice * 1.03,
        reason: [
          "Price is trading strongly above the previous close.",
          `Current change is ${changePercent.toFixed(2)}%.`,
          "Momentum currently favors buyers.",
        ],
      };
    }

    if (changePercent <= -1) {
      return {
        strategy: "Trend Following",
        signal: "SELL",
        confidence: Math.min(
          90,
          Math.round(65 + Math.abs(changePercent) * 8)
        ),
        entry: market.currentPrice,
        stopLoss: market.currentPrice * 1.015,
        takeProfit: market.currentPrice * 0.97,
        reason: [
          "Price is trading strongly below the previous close.",
          `Current change is ${changePercent.toFixed(2)}%.`,
          "Momentum currently favors sellers.",
        ],
      };
    }

    return {
      strategy: "Trend Following",
      signal: "HOLD",
      confidence: 50,
      entry: market.currentPrice,
      stopLoss: market.currentPrice,
      takeProfit: market.currentPrice,
      reason: [
        "Price movement is not strong enough for a trend signal.",
        `Current change is ${changePercent.toFixed(2)}%.`,
        "Wait for clearer directional confirmation.",
      ],
    };
  },
};
