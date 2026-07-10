"use client";

import { useState } from "react";
import LiveClock from "./LiveClock";
import MarketStatus from "./MarketStatus";
import { useMarket } from "@/context/MarketContext";

export default function Header() {
  const { activeSymbol, setActiveSymbol } = useMarket();
  const [search, setSearch] = useState("");

  const displaySymbol = activeSymbol.replace("NASDAQ:", "");

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanSymbol = search.trim().toUpperCase();

    if (!cleanSymbol) {
      return;
    }

    setActiveSymbol(`NASDAQ:${cleanSymbol}`);
    setSearch("");
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 px-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Trade OS</h1>
        <p className="text-sm text-slate-400">
          Active symbol: {displaySymbol}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search symbol..."
            className="w-44 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-slate-600"
          />
        </form>

        <MarketStatus />
        <LiveClock />
      </div>
    </header>
  );
}
