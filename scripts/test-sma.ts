import {
  calculateSMA,
  getLatestSMA,
} from "../strategies/indicators/SMA";

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

console.log("SMA values:", calculateSMA(closingPrices, 3));
console.log("Latest SMA:", getLatestSMA(closingPrices, 3));
