"use client";

import type { ReactNode } from "react";
import { MarketProvider } from "@/context/MarketContext";
import { MarketDataProvider } from "@/context/MarketDataContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { TradingModeProvider } from "@/context/TradingModeContext";

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MarketProvider>
      <MarketDataProvider>
        <PortfolioProvider>
          <WatchlistProvider>
            <TradingModeProvider>
              {children}
            </TradingModeProvider>
          </WatchlistProvider>
        </PortfolioProvider>
      </MarketDataProvider>
    </MarketProvider>
  );
}
