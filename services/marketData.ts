export type MarketQuote = {
  symbol: string;
  currentPrice: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  change: number;
  changePercent: number;
};

type QuoteError = {
  error?: string;
};

export async function getQuote(
  symbol: string,
  baseUrl = ""
): Promise<MarketQuote> {
  const response = await fetch(
    `${baseUrl}/api/market/quote?symbol=${encodeURIComponent(symbol)}`,
    {
      cache: "no-store",
    }
  );

  const data = (await response.json()) as MarketQuote & QuoteError;

  if (!response.ok) {
    throw new Error(data.error ?? "Unable to load market quote.");
  }

  return data;
}
