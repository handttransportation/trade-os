export type Candle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type HistoricalCandlesResponse = {
  candles?: Candle[];
  error?: string;
};

export async function getHistoricalCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number,
  baseUrl = ""
): Promise<Candle[]> {
  const params = new URLSearchParams({
    symbol,
    resolution,
    from: String(from),
    to: String(to),
  });

  const response = await fetch(
    `${baseUrl}/api/market/candles?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  const data =
    (await response.json()) as HistoricalCandlesResponse;

  if (!response.ok) {
    throw new Error(
      data.error ?? "Unable to load historical candles."
    );
  }

  return data.candles ?? [];
}
