import { NextRequest, NextResponse } from "next/server";

type FinnhubQuote = {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
  error?: string;
};

export async function GET(request: NextRequest) {
  const apiKey = process.env.FINNHUB_API_KEY;

  const symbol = request.nextUrl.searchParams
    .get("symbol")
    ?.trim()
    .toUpperCase();

  if (!apiKey) {
    return NextResponse.json(
      { error: "FINNHUB_API_KEY is not configured." },
      { status: 500 }
    );
  }

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol is required." },
      { status: 400 }
    );
  }

  const endpoint = new URL("https://finnhub.io/api/v1/quote");
  endpoint.searchParams.set("symbol", symbol);

  try {
    const response = await fetch(endpoint, {
      headers: {
        "X-Finnhub-Token": apiKey,
      },
      cache: "no-store",
    });

    const rawBody = await response.text();

    if (!response.ok) {
      let message = `Finnhub quote request failed with status ${response.status}.`;

      if (response.status === 401 || response.status === 403) {
        message = "Finnhub rejected the API key.";
      }

      if (response.status === 429) {
        message = "Finnhub rate limit reached. Wait about one minute.";
      }

      return NextResponse.json(
        {
          error: message,
          upstreamStatus: response.status,
          upstreamMessage: rawBody,
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(rawBody) as FinnhubQuote;

    const currentPrice = Number(data.c ?? 0);
    const previousClose = Number(data.pc ?? 0);

    if (currentPrice <= 0 || previousClose <= 0) {
      return NextResponse.json(
        {
          error: "Finnhub returned an empty or invalid quote.",
          upstreamMessage: rawBody,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      symbol,
      currentPrice,
      high: Number(data.h ?? 0),
      low: Number(data.l ?? 0),
      open: Number(data.o ?? 0),
      previousClose,
      change: Number(data.d ?? currentPrice - previousClose),
      changePercent:
        typeof data.dp === "number"
          ? data.dp
          : ((currentPrice - previousClose) / previousClose) * 100,
      timestamp: Number(data.t ?? 0),
    });
  } catch (caughtError) {
    return NextResponse.json(
      {
        error: "Trade OS could not contact Finnhub.",
        details:
          caughtError instanceof Error
            ? caughtError.message
            : "Unknown server error.",
      },
      { status: 502 }
    );
  }
}
