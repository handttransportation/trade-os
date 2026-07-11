import type { Position } from "./portfolio";

export type PaperOrderSide = "BUY" | "SELL";

export type PaperOrder = {
  symbol: string;
  quantity: number;
  price: number;
  side: PaperOrderSide;
  placedAt: string;
};

export function executePaperOrder(
  positions: Position[],
  order: PaperOrder
): Position[] {
  const existing = positions.find(
    (position) => position.symbol === order.symbol
  );

  if (order.side === "BUY") {
    if (!existing) {
      return [
        ...positions,
        {
          symbol: order.symbol,
          quantity: order.quantity,
          averagePrice: order.price,
          currentPrice: order.price,
        },
      ];
    }

    const totalQuantity =
      existing.quantity + order.quantity;

    const totalCost =
      existing.quantity * existing.averagePrice +
      order.quantity * order.price;

    return positions.map((position) =>
      position.symbol === order.symbol
        ? {
            ...position,
            quantity: totalQuantity,
            averagePrice:
              totalCost / totalQuantity,
            currentPrice: order.price,
          }
        : position
    );
  }

  if (!existing) {
    return positions;
  }

  const remaining =
    existing.quantity - order.quantity;

  if (remaining <= 0) {
    return positions.filter(
      (position) =>
        position.symbol !== order.symbol
    );
  }

  return positions.map((position) =>
    position.symbol === order.symbol
      ? {
          ...position,
          quantity: remaining,
          currentPrice: order.price,
        }
      : position
  );
}
