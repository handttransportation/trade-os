export function calculateSMA(
  values: number[],
  period: number
): number[] {
  if (period <= 0) {
    throw new Error("SMA period must be greater than zero.");
  }

  if (values.length < period) {
    return [];
  }

  const results: number[] = [];
  let runningTotal = 0;

  for (let index = 0; index < values.length; index += 1) {
    runningTotal += values[index];

    if (index >= period) {
      runningTotal -= values[index - period];
    }

    if (index >= period - 1) {
      results.push(runningTotal / period);
    }
  }

  return results;
}

export function getLatestSMA(
  values: number[],
  period: number
): number | null {
  const smaValues = calculateSMA(values, period);

  return smaValues.at(-1) ?? null;
}
