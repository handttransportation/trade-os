import { getTradingModeConfig } from "../strategies/core/TradingModeConfig";

console.log("Day Trade:", getTradingModeConfig("DAY_TRADE"));
console.log("Swing Trade:", getTradingModeConfig("SWING"));
