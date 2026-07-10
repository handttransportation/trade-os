import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.FINNHUB_API_KEY;
  const symbol = request.nextUrl.searchParams
    .get("symbol")
    ?.trim()
    .toUpperCase();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Finnhub API key is not configured." },
      { status: 500 }
    );
  }

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol is required." },
      { status: 400 }
    );
  }

  try {
    const endpoint = new URL("https://finnhub.io/api/v1/quote");
    endpoint.searchParams.set("symbol", symbol);

    const response = await fetch(endpoint, {
      headers: {
        "X-Finnhub-Token": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Finnhub quote request failed." },
        { status: response.status }
      );
    }

    const data = await response.json();

    const previousClose = Number(data.pc ?? 0);
    const currentPrice = Number(data.c ?? 0);

    return NextResponse.json({
      symbol,
      currentPrice,
      high: Number(data.h ?? 0),
      low: Number(data.l ?? 0),
      open: Number(data.o ?? 0),
      previousClose,
      change: currentPrice - previousClose,
      changePercent:
        previousClose > 0
          ? ((currentPrice - previousClose) / previousClose) * 100
          : 0,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to contact Finnhub." },
      { status: 502 }
    );
  }
}
