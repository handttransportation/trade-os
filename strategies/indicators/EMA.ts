export function calculateEMA(
  values: number[],
  period: number
): number[] {
  if (period <= 0) {
    throw new Error("EMA period must be greater than zero.");
  }

  if (values.length < period) {
    return [];
  }

  const multiplier = 2 / (period + 1);

  const initialAverage =
    values
      .slice(0, period)
      .reduce((total, value) => total + value, 0) / period;

  const emaValues: number[] = [initialAverage];

  for (let index = period; index < values.length; index += 1) {
    const previousEMA = emaValues[emaValues.length - 1];

    const currentEMA =
      (values[index] - previousEMA) * multiplier + previousEMA;

    emaValues.push(currentEMA);
  }

  return emaValues;
}

export function getLatestEMA(
  values: number[],
  period: number
): number | null {
  const emaValues = calculateEMA(values, period);

  if (emaValues.length === 0) {
    return null;
  }

  return emaValues[emaValues.length - 1];
}
