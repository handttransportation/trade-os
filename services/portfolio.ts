export type Position = {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

export type PortfolioSummary = {
  totalMarketValue: number;
  totalCost: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
};

export function calculatePortfolio(
  positions: Position[]
): PortfolioSummary {
  const totalCost = positions.reduce(
    (sum, position) =>
      sum +
      position.quantity *
        position.averagePrice,
    0
  );

  const totalMarketValue = positions.reduce(
    (sum, position) =>
      sum +
      position.quantity *
        position.currentPrice,
    0
  );

  const unrealizedPnL =
    totalMarketValue - totalCost;

  return {
    totalCost,
    totalMarketValue,
    unrealizedPnL,
    unrealizedPnLPercent:
      totalCost === 0
        ? 0
        : (unrealizedPnL / totalCost) * 100,
  };
}
