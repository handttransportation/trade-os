"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type TradingMode = "DAY_TRADE" | "SWING";

type TradingModeContextValue = {
  tradingMode: TradingMode;
  setTradingMode: (mode: TradingMode) => void;
};

const TradingModeContext =
  createContext<TradingModeContextValue | null>(null);

export function TradingModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tradingMode, setTradingMode] =
    useState<TradingMode>("SWING");

  return (
    <TradingModeContext.Provider
      value={{
        tradingMode,
        setTradingMode,
      }}
    >
      {children}
    </TradingModeContext.Provider>
  );
}

export function useTradingMode() {
  const context = useContext(TradingModeContext);

  if (!context) {
    throw new Error(
      "useTradingMode must be used inside TradingModeProvider."
    );
  }

  return context;
}
