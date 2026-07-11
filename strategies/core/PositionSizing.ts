export type PositionSizeInput = {
  accountSize: number;
  riskPercent: number;
  entry: number;
  stopLoss: number;
};

export type PositionSizeResult = {
  accountSize: number;
  riskPercent: number;
  maxRiskAmount: number;
  riskPerShare: number;
  quantity: number;
  positionValue: number;
  actualRisk: number;
};

export function calculatePositionSize(
  input: PositionSizeInput
): PositionSizeResult {
  const {
    accountSize,
    riskPercent,
    entry,
    stopLoss,
  } = input;

  if (accountSize <= 0) {
    throw new Error("Account size must be greater than zero.");
  }

  if (riskPercent <= 0 || riskPercent > 100) {
    throw new Error(
      "Risk percentage must be between 0 and 100."
    );
  }

  if (entry <= 0 || stopLoss <= 0) {
    throw new Error(
      "Entry and stop-loss prices must be greater than zero."
    );
  }

  const riskPerShare = Math.abs(entry - stopLoss);

  if (riskPerShare === 0) {
    return {
      accountSize,
      riskPercent,
      maxRiskAmount: 0,
      riskPerShare: 0,
      quantity: 0,
      positionValue: 0,
      actualRisk: 0,
    };
  }

  const maxRiskAmount =
    accountSize * (riskPercent / 100);

  const riskBasedQuantity = Math.floor(
    maxRiskAmount / riskPerShare
  );

  const affordableQuantity = Math.floor(
    accountSize / entry
  );

  const quantity = Math.max(
    0,
    Math.min(riskBasedQuantity, affordableQuantity)
  );

  return {
    accountSize,
    riskPercent,
    maxRiskAmount,
    riskPerShare,
    quantity,
    positionValue: quantity * entry,
    actualRisk: quantity * riskPerShare,
  };
}
