import { runScanner } from "../services/scanner";

async function main() {
  const results = await runScanner();

  console.table(
    results.map((result) => ({
      Symbol: result.symbol,
      Action: result.decision.action,
      Score: result.decision.score,
      Price: result.currentPrice,
      ATR: result.atr14.toFixed(2),
    }))
  );
}

main().catch(console.error);
