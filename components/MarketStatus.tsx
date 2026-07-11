"use client";

import { useEffect, useState } from "react";

type MarketState = {
  isOpen: boolean;
  label: string;
  countdown: string;
};

function formatCountdown(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function getMarketState(): MarketState {
  const now = new Date();

  const newYorkTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: "America/New_York",
    })
  );

  const day = newYorkTime.getDay();
  const hours = newYorkTime.getHours();
  const minutes = newYorkTime.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const marketOpen = 9 * 60 + 30;
  const marketClose = 16 * 60;
  const isWeekday = day >= 1 && day <= 5;

  if (
    isWeekday &&
    currentMinutes >= marketOpen &&
    currentMinutes < marketClose
  ) {
    return {
      isOpen: true,
      label: "Market Open",
      countdown: `Closes in ${formatCountdown(
        marketClose - currentMinutes
      )}`,
    };
  }

  if (isWeekday && currentMinutes < marketOpen) {
    return {
      isOpen: false,
      label: "Market Closed",
      countdown: `Opens in ${formatCountdown(
        marketOpen - currentMinutes
      )}`,
    };
  }

  let daysUntilMonday = 1;

  if (day === 5) {
    daysUntilMonday = 3;
  } else if (day === 6) {
    daysUntilMonday = 2;
  }

  const minutesUntilOpen =
    daysUntilMonday * 24 * 60 - currentMinutes + marketOpen;

  return {
    isOpen: false,
    label: "Market Closed",
    countdown: `Opens in ${formatCountdown(minutesUntilOpen)}`,
  };
}

export default function MarketStatus() {
  const [mounted, setMounted] = useState(false);
  const [marketState, setMarketState] = useState<MarketState | null>(
    null
  );

  useEffect(() => {
    const initialUpdate = window.setTimeout(() => {
      setMounted(true);
      setMarketState(getMarketState());
    }, 0);

    const interval = window.setInterval(() => {
      setMarketState(getMarketState());
    }, 60000);

    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, []);

  if (!mounted || !marketState) {
    return (
      <div className="h-[58px] w-[150px] rounded-lg bg-slate-900" />
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          marketState.isOpen ? "bg-green-400" : "bg-red-400"
        }`}
      />

      <div>
        <p className="text-sm font-medium text-slate-200">
          {marketState.label}
        </p>

        <p className="text-xs text-slate-500">
          {marketState.countdown}
        </p>
      </div>
    </div>
  );
}
