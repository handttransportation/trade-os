type DashboardCardProps = {
  title: string;
  value: string;
  subtitle: string;
};

export default function DashboardCard({
  title,
  value,
  subtitle,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <h2 className="text-sm text-slate-400">{title}</h2>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-slate-400">{subtitle}</p>
    </div>
  );
}