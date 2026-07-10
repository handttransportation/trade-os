type MarketTickerProps = {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
};

export default function MarketTicker({
  symbol,
  price,
  change,
  isPositive,
}: MarketTickerProps) {
  return (
    <div className="flex min-w-36 items-center justify-between gap-4 rounded-lg bg-slate-900 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-white">{symbol}</p>
        <p className="text-xs text-slate-400">{price}</p>
      </div>

      <p className={isPositive ? "text-sm text-green-400" : "text-sm text-red-400"}>
        {change}
      </p>
    </div>
  );
}