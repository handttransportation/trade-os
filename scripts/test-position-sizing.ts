import { calculatePositionSize } from "../strategies/core/PositionSizing";

const result = calculatePositionSize({
  accountSize: 5000,
  riskPercent: 1,
  entry: 200,
  stopLoss: 196,
});

console.log(result);
