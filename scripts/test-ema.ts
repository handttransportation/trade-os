import {
  calculateEMA,
  getLatestEMA,
} from "../strategies/indicators/EMA";

const closingPrices = [
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
];

console.log("EMA values:", calculateEMA(closingPrices, 3));
console.log("Latest EMA:", getLatestEMA(closingPrices, 3));
