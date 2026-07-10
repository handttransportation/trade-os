import { getHistoricalCandles } from "@/services/historicalData";
import { getLatestEMA } from "./EMA";

export async function getEMA(
  symbol: string,
  period: number,
  resolution = "15"
): Promise<number | null> {
  const now = Math.floor(Date.now() / 1000);

  const from = now - 60 * 60 * 24 * 30;

  const candles = await getHistoricalCandles(
    symbol,
    resolution,
    from,
    now
  );

  const closes = candles.map((candle) => candle.close);

  return getLatestEMA(closes, period);
}
