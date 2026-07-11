type StatCardProps = {
  label: string;
  value: string;
  color?: string;
};

export default function StatCard({
  label,
  value,
  color = "text-white",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-sky-600">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <h3 className={`mt-2 text-2xl font-bold ${color}`}>
        {value}
      </h3>
    </div>
  );
}
