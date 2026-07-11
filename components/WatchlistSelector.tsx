"use client";

import { useWatchlist } from "@/context/WatchlistContext";

export default function WatchlistSelector() {
  const {
    watchlists,
    activeWatchlist,
    setActiveWatchlist,
  } = useWatchlist();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="watchlist-selector"
        className="text-xs text-slate-500"
      >
        Watchlist
      </label>

      <select
        id="watchlist-selector"
        value={activeWatchlist.id}
        onChange={(event) =>
          setActiveWatchlist(event.target.value)
        }
        className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
      >
        {watchlists.map((watchlist) => (
          <option
            key={watchlist.id}
            value={watchlist.id}
          >
            {watchlist.name}
          </option>
        ))}
      </select>
    </div>
  );
}
