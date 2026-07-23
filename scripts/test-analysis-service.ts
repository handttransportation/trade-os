import { getAnalysis } from "../services/analysisService";

async function main() {
  const analysis = await getAnalysis(
    "QQQ",
    "http://localhost:3000"
  );

  console.log({
    symbol: analysis.symbol,
    action: analysis.decision.action,
    score: analysis.decision.score,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
