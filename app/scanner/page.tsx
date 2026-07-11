"use client";

import { useMemo, useState } from "react";
import ScannerTable from "@/components/scanner/ScannerTable";
import ScannerSkeleton from "@/components/scanner/ScannerSkeleton";
import { useScanner } from "@/hooks/useScanner";
import { useWatchlist } from "@/context/WatchlistContext";
import { useTradingMode } from "@/context/TradingModeContext";

type SignalFilter = "ALL" | "BUY" | "HOLD" | "SELL";
type SortOption =
  | "SCORE_DESC"
  | "SCORE_ASC"
  | "RSI_DESC"
  | "RSI_ASC"
  | "ATR_DESC"
  | "ATR_ASC"
  | "SYMBOL_ASC";

export default function ScannerPage() {
  const { activeWatchlist } = useWatchlist();
  const { tradingMode } = useTradingMode();

  const {
    results,
    generatedAt,
    isLoading,
    error,
    refresh,
  } = useScanner(
    activeWatchlist.symbols,
    tradingMode
  );

  const [signalFilter, setSignalFilter] =
    useState<SignalFilter>("ALL");

  const [sortOption, setSortOption] =
    useState<SortOption>("SCORE_DESC");

  const [search, setSearch] = useState("");

  const filteredResults = useMemo(() => {
    const cleanSearch = search.trim().toUpperCase();

    const filtered = results.filter((result) => {
      const matchesSignal =
        signalFilter === "ALL" ||
        result.decision.action === signalFilter;

      const matchesSearch =
        cleanSearch.length === 0 ||
        result.symbol.includes(cleanSearch);

      return matchesSignal && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "SCORE_ASC":
          return a.decision.score - b.decision.score;

        case "RSI_DESC":
          return b.rsi14 - a.rsi14;

        case "RSI_ASC":
          return a.rsi14 - b.rsi14;

        case "ATR_DESC":
          return b.atr14 - a.atr14;

        case "ATR_ASC":
          return a.atr14 - b.atr14;

        case "SYMBOL_ASC":
          return a.symbol.localeCompare(b.symbol);

        case "SCORE_DESC":
        default:
          return b.decision.score - a.decision.score;
      }
    });
  }, [results, search, signalFilter, sortOption]);

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Market Scanner</h1>

          <p className="mt-1 text-sm text-sky-400">
            {tradingMode === "DAY_TRADE"
              ? "Day Trade"
              : "Swing Trade"}{" "}
            • {activeWatchlist.name}
          </p>

          <p className="mt-2 text-slate-400">
            Filter and rank opportunities using technical,
            momentum, volatility, and risk analysis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refresh()}
          disabled={isLoading}
          className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Scanning..." : "Refresh Scanner"}
        </button>
      </div>

      <section className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div>
            <label
              htmlFor="scanner-search"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Search Symbol
            </label>

            <input
              id="scanner-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="AAPL, QQQ, TSLA..."
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-500"
            />
          </div>

          <div>
            <label
              htmlFor="signal-filter"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Signal
            </label>

            <select
              id="signal-filter"
              value={signalFilter}
              onChange={(event) =>
                setSignalFilter(
                  event.target.value as SignalFilter
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
            >
              <option value="ALL">All Signals</option>
              <option value="BUY">BUY Only</option>
              <option value="HOLD">HOLD Only</option>
              <option value="SELL">SELL Only</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sort-option"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Sort By
            </label>

            <select
              id="sort-option"
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value as SortOption
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-sky-500"
            >
              <option value="SCORE_DESC">
                Highest Score
              </option>
              <option value="SCORE_ASC">
                Lowest Score
              </option>
              <option value="RSI_DESC">
                Highest RSI
              </option>
              <option value="RSI_ASC">
                Lowest RSI
              </option>
              <option value="ATR_DESC">
                Highest ATR
              </option>
              <option value="ATR_ASC">
                Lowest ATR
              </option>
              <option value="SYMBOL_ASC">
                Symbol A–Z
              </option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {(["ALL", "BUY", "HOLD", "SELL"] as SignalFilter[]).map(
            (signal) => {
              const isActive = signalFilter === signal;

              return (
                <button
                  key={signal}
                  type="button"
                  onClick={() => setSignalFilter(signal)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-sky-600 text-white"
                      : "bg-slate-950 text-slate-400 hover:text-white"
                  }`}
                >
                  {signal}
                </button>
              );
            }
          )}
        </div>
      </section>

      {generatedAt && !isLoading && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            Last scan:{" "}
            {new Date(generatedAt).toLocaleString()}
          </p>

          <p>
            Showing {filteredResults.length} of {results.length} symbols
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {isLoading && results.length === 0 ? (
        <ScannerSkeleton />
      ) : filteredResults.length > 0 ? (
        <ScannerTable results={filteredResults} />
      ) : (
        <div className="rounded-xl bg-slate-900 p-10 text-center text-slate-400">
          No symbols match the current filters.
        </div>
      )}
    </div>
  );
}
