const movers = [
  { symbol: "PLTR", price: "$147.20", change: "+6.52%" },
  { symbol: "AMD", price: "$182.91", change: "+4.10%" },
  { symbol: "NVDA", price: "$203.55", change: "+3.88%" },
  { symbol: "META", price: "$742.84", change: "+2.91%" },
  { symbol: "TSLA", price: "$405.04", change: "+2.45%" },
];

export default function TopMovers() {
  return (
    <section className="rounded-xl bg-slate-900 p-6">
      <h2 className="mb-5 text-lg font-semibold text-white">
        Top Gainers
      </h2>

      <div className="space-y-3">
        {movers.map((stock) => (
          <div
            key={stock.symbol}
            className="flex items-center justify-between rounded-lg bg-slate-800 px-4 py-3"
          >
            <div>
              <p className="font-semibold text-white">
                {stock.symbol}
              </p>
              <p className="text-xs text-slate-400">
                {stock.price}
              </p>
            </div>

            <span className="font-semibold text-green-400">
              {stock.change}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
