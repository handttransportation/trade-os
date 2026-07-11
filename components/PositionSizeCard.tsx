"use client";

import { useMemo } from "react";

import { useRiskSettings } from "@/hooks/useRiskSettings";
import { calculatePositionSize } from "@/strategies/core/PositionSizing";

type Props = {
  entry: number;
  stopLoss: number;
};

export default function PositionSizeCard({
  entry,
  stopLoss,
}: Props) {
  const {
    accountSize,
    riskPercent,
    setAccountSize,
    setRiskPercent,
  } = useRiskSettings();

  const sizing = useMemo(
    () =>
      calculatePositionSize({
        accountSize,
        riskPercent,
        entry,
        stopLoss,
      }),
    [
      accountSize,
      riskPercent,
      entry,
      stopLoss,
    ]
  );

  return (
    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-6">
      <h3 className="text-xl font-semibold">
        Position Sizing
      </h3>

      <div className="mt-6 grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Account Size
          </label>

          <input
            type="number"
            value={accountSize}
            onChange={(e)=>
              setAccountSize(Number(e.target.value))
            }
            className="w-full rounded-lg bg-slate-900 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Risk %
          </label>

          <input
            type="number"
            value={riskPercent}
            step="0.5"
            onChange={(e)=>
              setRiskPercent(Number(e.target.value))
            }
            className="w-full rounded-lg bg-slate-900 p-3"
          />
        </div>

      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">

        <div>
          <p className="text-sm text-slate-500">
            Shares
          </p>

          <p className="text-2xl font-bold">
            {sizing.quantity}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Capital Used
          </p>

          <p className="text-2xl font-bold">
            ${sizing.positionValue.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Max Loss
          </p>

          <p className="text-2xl font-bold text-red-400">
            ${sizing.actualRisk.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Risk / Share
          </p>

          <p className="text-2xl font-bold">
            ${sizing.riskPerShare.toFixed(2)}
          </p>
        </div>

      </div>

    </div>
  );
}
