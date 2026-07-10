"use client";

import { createContext, useContext, useState } from "react";

type MarketContextType = {
  activeSymbol: string;
  setActiveSymbol: (symbol: string) => void;
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [activeSymbol, setActiveSymbol] = useState("NASDAQ:QQQ");

  return (
    <MarketContext.Provider value={{ activeSymbol, setActiveSymbol }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);

  if (!context) {
    throw new Error("useMarket must be used inside MarketProvider");
  }

  return context;
}