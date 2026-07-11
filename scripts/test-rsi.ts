import {
  calculateRSI,
  getLatestRSI,
} from "../strategies/indicators/RSI";

const closingPrices = [
  44.34,
  44.09,
  44.15,
  43.61,
  44.33,
  44.83,
  45.1,
  45.42,
  45.84,
  46.08,
  45.89,
  46.03,
  45.61,
  46.28,
  46.28,
  46,
  46.03,
  46.41,
  46.22,
  45.64,
];

console.log("RSI values:", calculateRSI(closingPrices, 14));
console.log("Latest RSI:", getLatestRSI(closingPrices, 14));
