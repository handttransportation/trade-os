export type RiskPlan = {
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskPerShare: number;
  rewardPerShare: number;
  rewardRiskRatio: number;
};

export function buildRiskPlan(
  entry: number,
  atr: number,
  direction: "LONG" | "SHORT"
): RiskPlan {
  const stopMultiplier = 1.5;
  const targetMultiplier = 3;

  if (direction === "LONG") {
    const stopLoss = entry - atr * stopMultiplier;
    const takeProfit = entry + atr * targetMultiplier;

    return {
      entry,
      stopLoss,
      takeProfit,
      riskPerShare: entry - stopLoss,
      rewardPerShare: takeProfit - entry,
      rewardRiskRatio:
        (takeProfit - entry) /
        (entry - stopLoss),
    };
  }

  const stopLoss = entry + atr * stopMultiplier;
  const takeProfit = entry - atr * targetMultiplier;

  return {
    entry,
    stopLoss,
    takeProfit,
    riskPerShare: stopLoss - entry,
    rewardPerShare: entry - takeProfit,
    rewardRiskRatio:
      (entry - takeProfit) /
      (stopLoss - entry),
  };
}
