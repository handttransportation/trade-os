import type { TradingMode } from "@/context/TradingModeContext";
import { getTimeframeSet } from "@/strategies/core/TimeframeConfig";

export type PlannedTimeframeRequest = {
  resolution: string;
};

export function buildTimeframePlan(
  mode: TradingMode
): PlannedTimeframeRequest[] {
  const config = getTimeframeSet(mode);

  return [
    { resolution: config.primary },
    ...config.confirmation.map((resolution) => ({
      resolution,
    })),
  ];
}
