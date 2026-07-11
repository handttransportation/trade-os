import {
  calculateATR,
  getLatestATR,
} from "../strategies/indicators/ATR";

const candles = [
  { high: 48.7, low: 47.79, close: 48.16 },
  { high: 48.72, low: 48.14, close: 48.61 },
  { high: 48.9, low: 48.39, close: 48.75 },
  { high: 48.87, low: 48.37, close: 48.63 },
  { high: 48.82, low: 48.24, close: 48.74 },
  { high: 49.05, low: 48.64, close: 49.03 },
  { high: 49.2, low: 48.94, close: 49.07 },
  { high: 49.35, low: 48.86, close: 49.32 },
  { high: 49.92, low: 49.5, close: 49.91 },
  { high: 50.19, low: 49.87, close: 50.13 },
  { high: 50.12, low: 49.2, close: 49.53 },
  { high: 49.66, low: 48.9, close: 49.5 },
  { high: 49.88, low: 49.43, close: 49.75 },
  { high: 50.19, low: 49.73, close: 50.03 },
  { high: 50.36, low: 49.26, close: 50.31 },
  { high: 50.57, low: 50.09, close: 50.52 },
];

console.log("ATR values:", calculateATR(candles, 14));
console.log("Latest ATR:", getLatestATR(candles, 14));
