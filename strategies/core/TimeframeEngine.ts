export type Timeframe =
  | "1"
  | "5"
  | "15"
  | "60"
  | "240"
  | "D";

export type TimeframeTrend =
  | "BULLISH"
  | "BEARISH"
  | "NEUTRAL";

export type TimeframeSignal = {
  timeframe: Timeframe;
  trend: TimeframeTrend;
  score: number;
};

export type TimeframeConfirmation = {
  signals: TimeframeSignal[];
  bullishCount: number;
  bearishCount: number;
  neutralCount: number;
  alignmentScore: number;
  overallTrend: TimeframeTrend;
  confidenceAdjustment: number;
  summary: string;
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

export function evaluateTimeframeAlignment(
  signals: TimeframeSignal[]
): TimeframeConfirmation {
  if (signals.length === 0) {
    throw new Error(
      "At least one timeframe signal is required."
    );
  }

  const normalizedSignals = signals.map((signal) => ({
    ...signal,
    score: clampScore(signal.score),
  }));

  const bullishCount = normalizedSignals.filter(
    (signal) => signal.trend === "BULLISH"
  ).length;

  const bearishCount = normalizedSignals.filter(
    (signal) => signal.trend === "BEARISH"
  ).length;

  const neutralCount = normalizedSignals.filter(
    (signal) => signal.trend === "NEUTRAL"
  ).length;

  const total = normalizedSignals.length;

  const dominantCount = Math.max(
    bullishCount,
    bearishCount,
    neutralCount
  );

  const alignmentScore = Math.round(
    (dominantCount / total) * 100
  );

  const overallTrend: TimeframeTrend =
    bullishCount > bearishCount &&
    bullishCount > neutralCount
      ? "BULLISH"
      : bearishCount > bullishCount &&
          bearishCount > neutralCount
        ? "BEARISH"
        : "NEUTRAL";

  const averageSignalScore = Math.round(
    normalizedSignals.reduce(
      (totalScore, signal) =>
        totalScore + signal.score,
      0
    ) / total
  );

  let confidenceAdjustment = 0;

  if (
    alignmentScore >= 80 &&
    overallTrend !== "NEUTRAL"
  ) {
    confidenceAdjustment = 10;
  } else if (
    alignmentScore >= 60 &&
    overallTrend !== "NEUTRAL"
  ) {
    confidenceAdjustment = 5;
  } else if (alignmentScore < 50) {
    confidenceAdjustment = -10;
  }

  const summary =
    overallTrend === "NEUTRAL"
      ? `Timeframes are mixed. Alignment is ${alignmentScore}% with an average strength of ${averageSignalScore}/100.`
      : `${bullishCount} bullish, ${bearishCount} bearish, and ${neutralCount} neutral timeframes produce a ${overallTrend.toLowerCase()} alignment of ${alignmentScore}%.`;

  return {
    signals: normalizedSignals,
    bullishCount,
    bearishCount,
    neutralCount,
    alignmentScore,
    overallTrend,
    confidenceAdjustment,
    summary,
  };
}
