export default function JournalPage() {
  const stats = [
    {
      title: "Win Rate",
      value: "74%",
      subtitle: "+3% this month",
    },
    {
      title: "Total P/L",
      value: "+$4,285",
      subtitle: "Last 30 trades",
    },
    {
      title: "Profit Factor",
      value: "2.31",
      subtitle: "Excellent",
    },
    {
      title: "Discipline",
      value: "92",
      subtitle: "AI Score",
    },
  ];

  const trades = [
    {
      symbol: "QQQ",
      strategy: "Breakout",
      grade: "A",
      pnl: "+2.4R",
      status: "Win",
      date: "Jul 22",
    },
    {
      symbol: "NVDA",
      strategy: "Pullback",
      grade: "B+",
      pnl: "+1.8R",
      status: "Win",
      date: "Jul 21",
    },
    {
      symbol: "SPY",
      strategy: "Reversal",
      grade: "C",
      pnl: "-1R",
      status: "Loss",
      date: "Jul 20",
    },
  ];

  return (
    <main className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden space-y-8 p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 z-0 select-none -translate-y-1/2 text-[clamp(4rem,10vw,9rem)] font-black uppercase leading-none tracking-[0.18em] text-sky-400/12 [writing-mode:vertical-rl]"
      >
        TTINDAHOOD
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Trade Journal</h1>
          <p className="mt-2 text-slate-400">
            Review your trades. Learn from every decision. Improve every day.
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700">
          + New Trade
        </button>
      </div>

      <section className="relative z-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <p className="text-sm text-slate-400">{stat.title}</p>

            <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>

            <p className="mt-2 text-sm text-emerald-400">
              {stat.subtitle}
            </p>
          </div>
        ))}
      </section>

      <section className="relative z-10 rounded-2xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 p-5">
          <h2 className="text-xl font-semibold">Recent Trades</h2>
        </div>

        <table className="w-full">
          <thead className="text-left text-sm text-slate-400">
            <tr>
              <th className="p-4">Symbol</th>
              <th>Strategy</th>
              <th>Grade</th>
              <th>P/L</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr
                key={`${trade.symbol}-${trade.date}`}
                className="border-t border-slate-800"
              >
                <td className="p-4 font-semibold">{trade.symbol}</td>
                <td>{trade.strategy}</td>
                <td>{trade.grade}</td>
                <td className="text-emerald-400">{trade.pnl}</td>
                <td>{trade.status}</td>
                <td>{trade.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="relative z-10 rounded-2xl border border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 p-6">
        <h2 className="text-2xl font-bold">AI Trading Coach</h2>

        <p className="mt-4 text-slate-300">
          Complete your first trades to unlock personalized coaching,
          execution scoring, psychology analysis, risk management insights,
          and strategy recommendations powered by AI.
        </p>

        <div className="mt-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
          <p className="font-semibold text-blue-300">
            Coming Soon
          </p>

          <p className="mt-2 text-slate-300">
            Your AI coach will analyze every trade, identify recurring
            mistakes, recommend better entries and exits, measure discipline,
            and build a personalized trading playbook based on your real
            performance—not generic trading advice.
          </p>
        </div>
      </section>
    </main>
  );
}