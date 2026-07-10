export default function QuickActions() {
  const actions = [
    "Buy",
    "Sell",
    "Paper Trade",
    "Set Alert",
    "Add Watchlist",
    "AI Scan",
  ];

  return (
    <section className="rounded-xl bg-slate-900 p-6">
      <h2 className="mb-5 text-lg font-semibold text-white">
        Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action}
            className="rounded-lg bg-slate-800 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-sky-600"
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}
