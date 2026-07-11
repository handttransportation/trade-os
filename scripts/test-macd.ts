import {
  calculateMACD,
  getLatestMACD,
} from "../strategies/indicators/MACD";

const closingPrices = [
  100, 101, 102, 101, 103, 104, 105, 106, 105, 107,
  108, 109, 110, 111, 110, 112, 113, 114, 115, 116,
  117, 116, 118, 119, 120, 121, 122, 121, 123, 124,
  125, 126, 127, 128, 129, 130, 131, 132, 133, 134,
  135, 136, 137, 138, 139, 140, 141, 142, 143, 144,
];

console.log("MACD values:", calculateMACD(closingPrices));
console.log("Latest MACD:", getLatestMACD(closingPrices));
