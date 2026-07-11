export type ATRCandle = {
  high: number;
  low: number;
  close: number;
};

export function calculateTrueRanges(
  candles: ATRCandle[]
): number[] {
  if (candles.length < 2) {
    return [];
  }

  const trueRanges: number[] = [];

  for (let index = 1; index < candles.length; index += 1) {
    const current = candles[index];
    const previous = candles[index - 1];

    const highLow = current.high - current.low;
    const highPreviousClose = Math.abs(
      current.high - previous.close
    );
    const lowPreviousClose = Math.abs(
      current.low - previous.close
    );

    trueRanges.push(
      Math.max(
        highLow,
        highPreviousClose,
        lowPreviousClose
      )
    );
  }

  return trueRanges;
}

export function calculateATR(
  candles: ATRCandle[],
  period = 14
): number[] {
  if (period <= 0) {
    throw new Error("ATR period must be greater than zero.");
  }

  const trueRanges = calculateTrueRanges(candles);

  if (trueRanges.length < period) {
    return [];
  }

  const firstATR =
    trueRanges
      .slice(0, period)
      .reduce((total, value) => total + value, 0) / period;

  const atrValues: number[] = [firstATR];

  for (
    let index = period;
    index < trueRanges.length;
    index += 1
  ) {
    const previousATR = atrValues[atrValues.length - 1];

    const currentATR =
      (previousATR * (period - 1) + trueRanges[index]) /
      period;

    atrValues.push(currentATR);
  }

  return atrValues;
}

export function getLatestATR(
  candles: ATRCandle[],
  period = 14
): number | null {
  const atrValues = calculateATR(candles, period);

  return atrValues.at(-1) ?? null;
}
