"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_WATCHLISTS,
  type Watchlist,
} from "@/services/watchlistManager";

type WatchlistContextValue = {
  watchlists: Watchlist[];
  activeWatchlist: Watchlist;
  setActiveWatchlist: (id: string) => void;
  addSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
};

const STORAGE_KEY = "trade-os-watchlists";

const WatchlistContext =
  createContext<WatchlistContextValue | null>(null);

export function WatchlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [watchlists, setWatchlists] =
    useState<Watchlist[]>(DEFAULT_WATCHLISTS);

  const [activeId, setActiveId] =
    useState("default");

  useEffect(() => {
    const loadSavedWatchlists = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        return;
      }

      try {
        const parsed = JSON.parse(saved) as Watchlist[];

        if (Array.isArray(parsed) && parsed.length > 0) {
          setWatchlists(parsed);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }, 0);

    return () => window.clearTimeout(loadSavedWatchlists);
  }, []);

  const activeWatchlist = useMemo(() => {
    return (
      watchlists.find(
        (watchlist) => watchlist.id === activeId
      ) ?? watchlists[0]
    );
  }, [activeId, watchlists]);

  function saveWatchlists(nextWatchlists: Watchlist[]) {
    setWatchlists(nextWatchlists);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextWatchlists)
    );
  }

  function setActiveWatchlist(id: string) {
    setActiveId(id);
  }

  function addSymbol(symbol: string) {
    const cleanSymbol = symbol.trim().toUpperCase();

    if (!cleanSymbol) {
      return;
    }

    const nextWatchlists = watchlists.map((watchlist) => {
      if (watchlist.id !== activeWatchlist.id) {
        return watchlist;
      }

      if (watchlist.symbols.includes(cleanSymbol)) {
        return watchlist;
      }

      return {
        ...watchlist,
        symbols: [...watchlist.symbols, cleanSymbol],
      };
    });

    saveWatchlists(nextWatchlists);
  }

  function removeSymbol(symbol: string) {
    const nextWatchlists = watchlists.map((watchlist) => {
      if (watchlist.id !== activeWatchlist.id) {
        return watchlist;
      }

      return {
        ...watchlist,
        symbols: watchlist.symbols.filter(
          (item) => item !== symbol
        ),
      };
    });

    saveWatchlists(nextWatchlists);
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlists,
        activeWatchlist,
        setActiveWatchlist,
        addSymbol,
        removeSymbol,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error(
      "useWatchlist must be used inside WatchlistProvider."
    );
  }

  return context;
}
