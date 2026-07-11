export const DEFAULT_WATCHLIST = [
  "AAPL",
  "QQQ",
  "SPY",
  "MSFT",
  "NVDA",
  "META",
  "AMD",
  "TSLA",
] as const;

export type WatchlistSymbol =
  (typeof DEFAULT_WATCHLIST)[number];

export function normalizeWatchlist(
  symbols: string[]
): string[] {
  return [
    ...new Set(
      symbols
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean)
    ),
  ];
}
