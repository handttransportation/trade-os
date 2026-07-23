import type { TradingMode } from "@/context/TradingModeContext";
import type { Timeframe } from "./TimeframeEngine";

export type TimeframeSet = {
  primary: Timeframe;
  confirmation: Timeframe[];
};

export function getTimeframeSet(
  mode: TradingMode
): TimeframeSet {
  switch (mode) {
    case "DAY_TRADE":
      return {
        primary: "5",
        confirmation: ["15", "60"],
      };

    case "SWING":
      return {
        primary: "60",
        confirmation: ["240", "D"],
      };

    default:
      return {
        primary: "5",
        confirmation: ["15", "60"],
      };
  }
}
