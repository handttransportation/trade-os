import Skeleton from "@/components/ui/Skeleton";

const rows = Array.from({ length: 6 });

export default function ScannerSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-left">
          <thead className="border-b border-slate-800 bg-slate-950/70">
            <tr className="text-xs uppercase tracking-wider text-slate-500">
              <th className="px-5 py-4">Rank</th>
              <th className="px-5 py-4">Symbol</th>
              <th className="px-5 py-4">Signal</th>
              <th className="px-5 py-4">Score</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">RSI</th>
              <th className="px-5 py-4">ATR</th>
              <th className="px-5 py-4">Entry</th>
              <th className="px-5 py-4">Stop</th>
              <th className="px-5 py-4">Target</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {rows.map((_, index) => (
              <tr key={index}>
                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-8" />
                </td>

                <td className="px-5 py-5">
                  <Skeleton className="h-5 w-14" />
                </td>

                <td className="px-5 py-5">
                  <Skeleton className="h-7 w-16 rounded-full" />
                </td>

                <td className="px-5 py-5">
                  <div className="w-28">
                    <Skeleton className="mb-2 h-4 w-12" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                </td>

                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-20" />
                </td>

                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-10" />
                </td>

                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-16" />
                </td>

                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-20" />
                </td>

                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-20" />
                </td>

                <td className="px-5 py-5">
                  <Skeleton className="h-4 w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
