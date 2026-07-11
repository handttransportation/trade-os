"use client";

import { useState } from "react";
import { useWatchlist } from "@/context/WatchlistContext";

export default function WatchlistEditor() {
  const {
    activeWatchlist,
    addSymbol,
    removeSymbol,
  } = useWatchlist();

  const [symbol, setSymbol] = useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    addSymbol(symbol);
    setSymbol("");
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h2 className="text-xl font-semibold">
          Edit Watchlist
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Managing: {activeWatchlist.name}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={symbol}
          onChange={(event) =>
            setSymbol(event.target.value.toUpperCase())
          }
          placeholder="Enter symbol, e.g. AMZN"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-sky-500"
        />

        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-500"
        >
          Add Symbol
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-3">
        {activeWatchlist.symbols.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-lg bg-slate-950 px-4 py-3"
          >
            <span className="font-semibold">
              {item}
            </span>

            <button
              type="button"
              onClick={() => removeSymbol(item)}
              className="text-sm text-red-400 transition hover:text-red-300"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {activeWatchlist.symbols.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          This watchlist is empty.
        </p>
      )}
    </section>
  );
}
