import WatchlistEditor from "@/components/WatchlistEditor";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>

        <p className="mt-2 text-slate-400">
          Configure watchlists, data connections, alerts,
          and platform preferences.
        </p>
      </div>

      <WatchlistEditor />
    </div>
  );
}
