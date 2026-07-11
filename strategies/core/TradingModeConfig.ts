import type { TradingMode } from "@/context/TradingModeContext";

export type TradingModeConfig = {
  mode: TradingMode;
  label: string;
  resolution: "5" | "15" | "60" | "D";
  historyDays: number;
  minimumCandles: number;
  fastEmaPeriod: number;
  slowEmaPeriod: number;
  longTermSmaPeriod: number | null;
  rsiPeriod: number;
  atrPeriod: number;
  stopAtrMultiplier: number;
  firstTargetAtrMultiplier: number;
  secondTargetAtrMultiplier: number;
  defaultRiskPercent: number;
};

const DAY_TRADE_CONFIG: TradingModeConfig = {
  mode: "DAY_TRADE",
  label: "Day Trade",
  resolution: "15",
  historyDays: 30,
  minimumCandles: 200,
  fastEmaPeriod: 9,
  slowEmaPeriod: 20,
  longTermSmaPeriod: null,
  rsiPeriod: 14,
  atrPeriod: 14,
  stopAtrMultiplier: 1,
  firstTargetAtrMultiplier: 1.5,
  secondTargetAtrMultiplier: 2.5,
  defaultRiskPercent: 0.5,
};

const SWING_CONFIG: TradingModeConfig = {
  mode: "SWING",
  label: "Swing Trade",
  resolution: "D",
  historyDays: 400,
  minimumCandles: 200,
  fastEmaPeriod: 20,
  slowEmaPeriod: 50,
  longTermSmaPeriod: 200,
  rsiPeriod: 14,
  atrPeriod: 14,
  stopAtrMultiplier: 1.5,
  firstTargetAtrMultiplier: 2,
  secondTargetAtrMultiplier: 3,
  defaultRiskPercent: 1,
};

export function getTradingModeConfig(
  mode: TradingMode
): TradingModeConfig {
  return mode === "DAY_TRADE"
    ? DAY_TRADE_CONFIG
    : SWING_CONFIG;
}
