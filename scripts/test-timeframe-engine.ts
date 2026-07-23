import { evaluateTimeframeAlignment } from "../strategies/core/TimeframeEngine";

const confirmation = evaluateTimeframeAlignment([
  {
    timeframe: "5",
    trend: "BULLISH",
    score: 78,
  },
  {
    timeframe: "15",
    trend: "BULLISH",
    score: 82,
  },
  {
    timeframe: "60",
    trend: "BULLISH",
    score: 75,
  },
  {
    timeframe: "D",
    trend: "NEUTRAL",
    score: 55,
  },
]);

console.log(confirmation);
