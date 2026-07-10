import { NextRequest, NextResponse } from "next/server";

type FinnhubCandleResponse = {
  c?: number[];
  h?: number[];
  l?: number[];
  o?: number[];
  s?: string;
  t?: number[];
  v?: number[];
};

const allowedResolutions = new Set([
  "1",
  "5",
  "15",
  "30",
  "60",
  "D",
  "W",
  "M",
]);

export async function GET(request: NextRequest) {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Finnhub API key is not configured." },
      { status: 500 }
    );
  }

  const searchParams = request.nextUrl.searchParams;

  const symbol = searchParams.get("symbol")?.trim().toUpperCase();
  const resolution = searchParams.get("resolution") ?? "15";
  const from = Number(searchParams.get("from"));
  const to = Number(searchParams.get("to"));

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol is required." },
      { status: 400 }
    );
  }

  if (!allowedResolutions.has(resolution)) {
    return NextResponse.json(
      { error: "Unsupported candle resolution." },
      { status: 400 }
    );
  }

  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from <= 0 ||
    to <= from
  ) {
    return NextResponse.json(
      { error: "A valid from/to Unix timestamp range is required." },
      { status: 400 }
    );
  }

  const endpoint = new URL("https://finnhub.io/api/v1/stock/candle");
  endpoint.searchParams.set("symbol", symbol);
  endpoint.searchParams.set("resolution", resolution);
  endpoint.searchParams.set("from", String(from));
  endpoint.searchParams.set("to", String(to));

  try {
    const response = await fetch(endpoint, {
      headers: {
        "X-Finnhub-Token": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            response.status === 429
              ? "Finnhub rate limit reached."
              : "Finnhub candle request failed.",
        },
        { status: response.status }
      );
    }

    const data = (await response.json()) as FinnhubCandleResponse;

    if (data.s !== "ok") {
      return NextResponse.json(
        {
          error:
            data.s === "no_data"
              ? "No candle data was returned."
              : "Candle data is unavailable for this account or symbol.",
        },
        { status: 404 }
      );
    }

    const timestamps = data.t ?? [];

    const candles = timestamps.map((timestamp, index) => ({
      timestamp,
      open: data.o?.[index] ?? 0,
      high: data.h?.[index] ?? 0,
      low: data.l?.[index] ?? 0,
      close: data.c?.[index] ?? 0,
      volume: data.v?.[index] ?? 0,
    }));

    return NextResponse.json({ symbol, resolution, candles });
  } catch {
    return NextResponse.json(
      { error: "Unable to contact Finnhub." },
      { status: 502 }
    );
  }
}
