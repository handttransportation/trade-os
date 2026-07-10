"use client";

import type { ReactNode } from "react";
import { MarketProvider } from "@/context/MarketContext";
import { MarketDataProvider } from "@/context/MarketDataContext";
import { PortfolioProvider } from "@/context/PortfolioContext";

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MarketProvider>
      <MarketDataProvider>
        <PortfolioProvider>{children}</PortfolioProvider>
      </MarketDataProvider>
    </MarketProvider>
  );
}
