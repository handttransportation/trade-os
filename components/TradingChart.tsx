"use client";

import { useEffect, useRef } from "react";
import { useMarket } from "@/context/MarketContext";

export default function TradingChart() {
  const { activeSymbol } = useMarket();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: activeSymbol,
      interval: "15",
      timezone: "America/New_York",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);
  }, [activeSymbol]);

  return (
    <div className="h-80 w-full overflow-hidden rounded-lg border border-slate-800">
      <div key={activeSymbol} ref={containerRef} className="h-full w-full" />
    </div>
  );
}