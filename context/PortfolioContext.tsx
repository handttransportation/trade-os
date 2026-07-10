"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Position = {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
};

type PortfolioContextType = {
  positions: Position[];
  cash: number;
  positionsValue: number;
  accountValue: number;
  totalProfitLoss: number;
  openPositions: number;
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

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [positions] = useState<Position[]>(startingPositions);
  const [cash] = useState(10000);

  const portfolio = useMemo(() => {
    const positionsValue = positions.reduce(
      (total, position) =>
        total + position.currentPrice * position.quantity,
      0
    );

    const totalProfitLoss = positions.reduce(
      (total, position) =>
        total +
        (position.currentPrice - position.averagePrice) *
          position.quantity,
      0
    );

    return {
      positionsValue,
      totalProfitLoss,
      accountValue: cash + positionsValue,
      openPositions: positions.length,
    };
  }, [cash, positions]);

  return (
    <PortfolioContext.Provider
      value={{
        positions,
        cash,
        positionsValue: portfolio.positionsValue,
        accountValue: portfolio.accountValue,
        totalProfitLoss: portfolio.totalProfitLoss,
        openPositions: portfolio.openPositions,
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
      "usePortfolio must be used inside PortfolioProvider"
    );
  }

  return context;
}
