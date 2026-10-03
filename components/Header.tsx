"use client";

import { useState } from "react";
import { useMarket } from "@/context/MarketContext";
import LiveClock from "./LiveClock";
import MarketStatus from "./MarketStatus";
import WatchlistSelector from "./WatchlistSelector";
import TradingModeSelector from "./TradingModeSelector";

export default function Header() {
  const { activeSymbol, setActiveSymbol } = useMarket();
  const [search, setSearch] = useState("");

  const displaySymbol = activeSymbol.replace("NASDAQ:", "");

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanSymbol = search
      .trim()
      .toUpperCase()
      .replace("NASDAQ:", "");

    if (!cleanSymbol) {
      return;
    }

    setActiveSymbol(`NASDAQ:${cleanSymbol}`);
    setSearch("");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 px-4 py-4 backdrop-blur md:px-6">
      <p className="text-center text-sm font-black uppercase tracking-[0.35em] text-sky-400">
        TTINDAHOOD
      </p>

      <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-white md:text-2xl">
              {displaySymbol}
            </h2>

            <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
              Active Symbol
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
          <div className="flex flex-wrap gap-3">
            <TradingModeSelector />
            <WatchlistSelector />
          </div>

          <form
            onSubmit={handleSearch}
            className="flex min-w-0 flex-1 gap-2 lg:min-w-65"
          >
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search symbol..."
              className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500"
            />

            <button
              type="submit"
              className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <MarketStatus />
            <LiveClock />
          </div>
        </div>
      </div>
    </header>
  );
}
