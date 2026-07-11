"use client";

import {
  useTradingMode,
  type TradingMode,
} from "@/context/TradingModeContext";

const modes: {
  value: TradingMode;
  label: string;
}[] = [
  {
    value: "DAY_TRADE",
    label: "Day Trade",
  },
  {
    value: "SWING",
    label: "Swing Trade",
  },
];

export default function TradingModeSelector() {
  const {
    tradingMode,
    setTradingMode,
  } = useTradingMode();

  return (
    <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900 p-1">
      {modes.map((mode) => {
        const isActive =
          tradingMode === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() =>
              setTradingMode(mode.value)
            }
            className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-sky-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
