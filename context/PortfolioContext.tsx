"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  calculatePortfolio,
  type Position,
} from "@/services/portfolio";

import {
  executePaperOrder,
  type PaperOrder,
} from "@/services/paperTrading";

export type PaperTradeResult = {
  success: boolean;
  message: string;
};

type PortfolioContextValue = {
  positions: Position[];
  orders: PaperOrder[];
  cash: number;
  totalCost: number;
  positionsValue: number;
  accountValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  openPositions: number;
  placePaperOrder: (
    order: PaperOrder
  ) => PaperTradeResult;
  removePosition: (symbol: string) => void;
};

const startingPositions: Position[] = [
  {
    symbol: "TSLA",
    quantity: 10,
    averagePrice: 398.2,
    currentPrice: 405.1,
  },
  {
    symbol: "NVDA",
    quantity: 5,
    averagePrice: 200.15,
    currentPrice: 202.8,
  },
  {
    symbol: "AAPL",
    quantity: 20,
    averagePrice: 312,
    currentPrice: 314.8,
  },
];

const PortfolioContext =
  createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [positions, setPositions] =
    useState<Position[]>(startingPositions);

  const [orders, setOrders] =
    useState<PaperOrder[]>([]);

  const [cash, setCash] = useState(10000);

  const summary = useMemo(
    () => calculatePortfolio(positions),
    [positions]
  );

  function placePaperOrder(
    order: PaperOrder
  ): PaperTradeResult {
    if (
      !Number.isFinite(order.quantity) ||
      order.quantity <= 0
    ) {
      return {
        success: false,
        message: "Quantity must be greater than zero.",
      };
    }

    if (
      !Number.isFinite(order.price) ||
      order.price <= 0
    ) {
      return {
        success: false,
        message: "Order price must be greater than zero.",
      };
    }

    const cleanOrder: PaperOrder = {
      ...order,
      symbol: order.symbol.trim().toUpperCase(),
    };

    const orderValue =
      cleanOrder.quantity * cleanOrder.price;

    if (
      cleanOrder.side === "BUY" &&
      orderValue > cash
    ) {
      return {
        success: false,
        message: "Not enough paper-trading cash.",
      };
    }

    const existingPosition = positions.find(
      (position) =>
        position.symbol === cleanOrder.symbol
    );

    if (cleanOrder.side === "SELL") {
      if (!existingPosition) {
        return {
          success: false,
          message: `You do not own ${cleanOrder.symbol}.`,
        };
      }

      if (
        cleanOrder.quantity >
        existingPosition.quantity
      ) {
        return {
          success: false,
          message:
            "Sell quantity exceeds the current position.",
        };
      }
    }

    setPositions((currentPositions) =>
      executePaperOrder(
        currentPositions,
        cleanOrder
      )
    );

    setCash((currentCash) =>
      cleanOrder.side === "BUY"
        ? currentCash - orderValue
        : currentCash + orderValue
    );

    setOrders((currentOrders) => [
      cleanOrder,
      ...currentOrders,
    ]);

    return {
      success: true,
      message: `${cleanOrder.side} order filled: ${cleanOrder.quantity} ${cleanOrder.symbol} at $${cleanOrder.price.toFixed(
        2
      )}.`,
    };
  }

  function removePosition(symbol: string) {
    setPositions((currentPositions) =>
      currentPositions.filter(
        (position) =>
          position.symbol !== symbol
      )
    );
  }

  return (
    <PortfolioContext.Provider
      value={{
        positions,
        orders,
        cash,
        totalCost: summary.totalCost,
        positionsValue: summary.totalMarketValue,
        accountValue:
          cash + summary.totalMarketValue,
        unrealizedPnL: summary.unrealizedPnL,
        unrealizedPnLPercent:
          summary.unrealizedPnLPercent,
        openPositions: positions.length,
        placePaperOrder,
        removePosition,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error(
      "usePortfolio must be used inside PortfolioProvider."
    );
  }

  return context;
}
