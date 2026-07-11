export type Watchlist = {
  id: string;
  name: string;
  symbols: string[];
};

export const DEFAULT_WATCHLISTS: Watchlist[] = [
  {
    id: "default",
    name: "Core Watchlist",
    symbols: [
      "QQQ",
      "SPY",
      "AAPL",
      "MSFT",
      "NVDA",
      "META",
      "AMD",
      "TSLA",
    ],
  },
  {
    id: "ai",
    name: "AI Leaders",
    symbols: [
      "NVDA",
      "AMD",
      "MSFT",
      "META",
    ],
  },
  {
    id: "indexes",
    name: "Indexes",
    symbols: [
      "QQQ",
      "SPY",
    ],
  },
];

export function getWatchlist(
  id = "default"
): Watchlist {
  return (
    DEFAULT_WATCHLISTS.find(
      (watchlist) => watchlist.id === id
    ) ?? DEFAULT_WATCHLISTS[0]
  );
}
