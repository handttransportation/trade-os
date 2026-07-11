import type { Candle } from "@/services/historicalData";
import type { TradingModeConfig } from "./TradingModeConfig";
import { getLatestEMA } from "@/strategies/indicators/EMA";
import { getLatestSMA } from "@/strategies/indicators/SMA";
import { getLatestRSI } from "@/strategies/indicators/RSI";
import { getLatestMACD } from "@/strategies/indicators/MACD";
import { getLatestATR } from "@/strategies/indicators/ATR";

export type IndicatorSnapshot = {
  latestClose: number;
  fastEma: number;
  slowEma: number;
  longTermSma: number | null;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  atr: number;
};

export function calculateIndicators(
  candles: Candle[],
  config: TradingModeConfig
): IndicatorSnapshot {
  if (candles.length < config.minimumCandles) {
    throw new Error(
      `${config.label} requires at least ${config.minimumCandles} candles. Received ${candles.length}.`
    );
  }

  const closingPrices = candles.map(
    (candle) => candle.close
  );

  const latestClose = closingPrices.at(-1);

  const fastEma = getLatestEMA(
    closingPrices,
    config.fastEmaPeriod
  );

  const slowEma = getLatestEMA(
    closingPrices,
    config.slowEmaPeriod
  );

  const longTermSma =
    config.longTermSmaPeriod === null
      ? null
      : getLatestSMA(
          closingPrices,
          config.longTermSmaPeriod
        );

  const rsi = getLatestRSI(
    closingPrices,
    config.rsiPeriod
  );

  const macd = getLatestMACD(closingPrices);

  const atr = getLatestATR(
    candles,
    config.atrPeriod
  );

  if (
    latestClose === undefined ||
    fastEma === null ||
    slowEma === null ||
    rsi === null ||
    macd === null ||
    atr === null
  ) {
    throw new Error(
      `Unable to calculate all ${config.label.toLowerCase()} indicators.`
    );
  }

  if (
    config.longTermSmaPeriod !== null &&
    longTermSma === null
  ) {
    throw new Error(
      `Unable to calculate SMA ${config.longTermSmaPeriod}.`
    );
  }

  return {
    latestClose,
    fastEma,
    slowEma,
    longTermSma,
    rsi,
    macd: macd.macd,
    macdSignal: macd.signal,
    macdHistogram: macd.histogram,
    atr,
  };
}
