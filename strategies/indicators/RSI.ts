export function calculateRSI(
  values: number[],
  period = 14
): number[] {
  if (period <= 0) {
    throw new Error("RSI period must be greater than zero.");
  }

  if (values.length <= period) {
    return [];
  }

  let totalGain = 0;
  let totalLoss = 0;

  for (let index = 1; index <= period; index += 1) {
    const change = values[index] - values[index - 1];

    if (change > 0) {
      totalGain += change;
    } else {
      totalLoss += Math.abs(change);
    }
  }

  let averageGain = totalGain / period;
  let averageLoss = totalLoss / period;

  const rsiValues: number[] = [];

  function calculateValue() {
    if (averageLoss === 0) {
      return 100;
    }

    const relativeStrength = averageGain / averageLoss;

    return 100 - 100 / (1 + relativeStrength);
  }

  rsiValues.push(calculateValue());

  for (let index = period + 1; index < values.length; index += 1) {
    const change = values[index] - values[index - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;

    averageGain =
      (averageGain * (period - 1) + gain) / period;

    averageLoss =
      (averageLoss * (period - 1) + loss) / period;

    rsiValues.push(calculateValue());
  }

  return rsiValues;
}

export function getLatestRSI(
  values: number[],
  period = 14
): number | null {
  const rsiValues = calculateRSI(values, period);

  if (rsiValues.length === 0) {
    return null;
  }

  return rsiValues[rsiValues.length - 1];
}
