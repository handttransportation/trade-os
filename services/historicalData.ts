export type Candle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export async function getHistoricalCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<Candle[]> {
  console.log(
    "Historical candles will be loaded for:",
    symbol,
    resolution
  );

  return [];
}
