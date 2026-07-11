import { calculateEMA } from "./EMA";

export type MACDPoint = {
  macd: number;
  signal: number;
  histogram: number;
};

export function calculateMACD(
  values: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MACDPoint[] {
  if (
    fastPeriod <= 0 ||
    slowPeriod <= 0 ||
    signalPeriod <= 0
  ) {
    throw new Error("MACD periods must be greater than zero.");
  }

  if (fastPeriod >= slowPeriod) {
    throw new Error(
      "MACD fast period must be smaller than the slow period."
    );
  }

  if (values.length < slowPeriod + signalPeriod - 1) {
    return [];
  }

  const fastEMA = calculateEMA(values, fastPeriod);
  const slowEMA = calculateEMA(values, slowPeriod);

  const offset = slowPeriod - fastPeriod;

  const macdLine = slowEMA.map((slowValue, index) => {
    const fastValue = fastEMA[index + offset];

    return fastValue - slowValue;
  });

  const signalLine = calculateEMA(macdLine, signalPeriod);

  const signalOffset = signalPeriod - 1;

  return signalLine.map((signalValue, index) => {
    const macdValue = macdLine[index + signalOffset];

    return {
      macd: macdValue,
      signal: signalValue,
      histogram: macdValue - signalValue,
    };
  });
}

export function getLatestMACD(
  values: number[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): MACDPoint | null {
  const macdValues = calculateMACD(
    values,
    fastPeriod,
    slowPeriod,
    signalPeriod
  );

  return macdValues.at(-1) ?? null;
}
