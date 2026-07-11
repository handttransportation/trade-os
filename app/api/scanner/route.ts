import { NextRequest, NextResponse } from "next/server";
import { runScanner } from "@/services/scanner";
import type { TradingMode } from "@/context/TradingModeContext";

function parseSymbols(request: NextRequest) {
  const rawSymbols =
    request.nextUrl.searchParams.get("symbols");

  if (!rawSymbols) {
    return undefined;
  }

  const symbols = rawSymbols
    .split(",")
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean);

  return symbols.length > 0
    ? [...new Set(symbols)]
    : undefined;
}

function parseTradingMode(
  request: NextRequest
): TradingMode {
  const mode =
    request.nextUrl.searchParams.get("mode");

  return mode === "DAY_TRADE"
    ? "DAY_TRADE"
    : "SWING";
}

export async function GET(request: NextRequest) {
  try {
    const symbols = parseSymbols(request);
    const tradingMode = parseTradingMode(request);

    const results = await runScanner(
      symbols,
      request.nextUrl.origin,
      tradingMode
    );

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      tradingMode,
      count: results.length,
      results,
    });
  } catch (caughtError) {
    console.error("Scanner route failed:", caughtError);

    return NextResponse.json(
      {
        error:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to run the market scanner.",
      },
      { status: 500 }
    );
  }
}
