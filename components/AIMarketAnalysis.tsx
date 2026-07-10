"use client";

import { useMarket } from "@/context/MarketContext";

export default function AIMarketAnalysis() {
  const { activeSymbol } = useMarket();

  const symbol = activeSymbol.replace("NASDAQ:", "");

  const analysis: Record<
    string,
    {
      bias: string;
      color: string;
      text: string;
    }
  > = {
    QQQ: {
      bias: "Bullish",
      color: "text-green-400",
      text: "QQQ is leading the technology sector. Watch key support and momentum before entering trades.",
    },
    SPY: {
      bias: "Neutral",
      color: "text-yellow-400",
      text: "SPY reflects the overall market. Look for confirmation before taking directional positions.",
    },
    AAPL: {
      bias: "Bullish",
      color: "text-green-400",
      text: "Apple remains strong. Look for continuation above recent highs with increasing volume.",
    },
    NVDA: {
      bias: "Very Bullish",
      color: "text-green-400",
      text: "NVIDIA continues to lead the AI sector. Expect high volatility around earnings and news.",
    },
    TSLA: {
      bias: "Bearish",
      color: "text-red-400",
      text: "Tesla remains volatile. Wait for confirmation before buying breakouts.",
    },
  };

  const current =
    analysis[symbol] || {
      bias: "Neutral",
      color: "text-slate-300",
      text: "No AI analysis available for this symbol yet.",
    };

  return (
    <div className="rounded-xl bg-slate-900 p-6 h-full">
      <h3 className="text-xl font-semibold mb-6">AI Market Analysis</h3>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-400">Current Symbol</p>
          <p className="text-2xl font-bold">{symbol}</p>
        </div>

        <div>
          <p className="text-sm text-slate-400">AI Bias</p>
          <p className={`text-xl font-semibold ${current.color}`}>
            {current.bias}
          </p>
        </div>

        <div className="rounded-lg bg-slate-950 p-4">
          <p className="text-sm leading-7 text-slate-300">
            {current.text}
          </p>
        </div>
      </div>
    </div>
  );
}