import { NextRequest, NextResponse } from "next/server";
import {
  getCachedValue,
  setCachedValue,
} from "@/services/cache/memoryCache";

type TwelveDataValue = {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
};

type TwelveDataResponse = {
  status?: string;
  code?: number;
  message?: string;
  values?: TwelveDataValue[];
};

type Candle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type CandlePayload = {
  provider: string;
  symbol: string;
  resolution: string;
  cached: boolean;
  candles: Candle[];
};

const intervalMap: Record<string, string> = {
  "1": "1min",
  "5": "5min",
  "15": "15min",
  "30": "30min",
  "60": "1h",
  D: "1day",
  W: "1week",
  M: "1month",
};

function getCacheDuration(resolution: string) {
  const fiveMinutes = 5 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;

  return resolution === "D" ||
    resolution === "W" ||
    resolution === "M"
    ? oneHour
    : fiveMinutes;
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const params = request.nextUrl.searchParams;

  const symbol = params
    .get("symbol")
    ?.trim()
    .toUpperCase();

  const resolution = params.get("resolution") ?? "D";
  const from = Number(params.get("from"));
  const to = Number(params.get("to"));

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "TWELVE_DATA_API_KEY is not configured.",
      },
      { status: 500 }
    );
  }

  if (!symbol) {
    return NextResponse.json(
      { error: "Symbol is required." },
      { status: 400 }
    );
  }

  const interval = intervalMap[resolution];

  if (!interval) {
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
      {
        error:
          "A valid from/to timestamp range is required.",
      },
      { status: 400 }
    );
  }

  const cacheKey = [
    "candles",
    symbol,
    resolution,
    from,
    to,
  ].join(":");

  const cachedPayload =
    getCachedValue<CandlePayload>(cacheKey);

  if (cachedPayload) {
    return NextResponse.json({
      ...cachedPayload,
      cached: true,
    });
  }

  const endpoint = new URL(
    "https://api.twelvedata.com/time_series"
  );

  endpoint.searchParams.set("symbol", symbol);
  endpoint.searchParams.set("interval", interval);
  endpoint.searchParams.set("outputsize", "500");
  endpoint.searchParams.set(
    "timezone",
    "America/New_York"
  );
  endpoint.searchParams.set("apikey", apiKey);

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
    });

    const data =
      (await response.json()) as TwelveDataResponse;

    if (!response.ok || data.status === "error") {
      return NextResponse.json(
        {
          error:
            data.message ??
            "Twelve Data candle request failed.",
          upstreamStatus: response.status,
          upstreamCode: data.code,
        },
        {
          status: response.ok
            ? 502
            : response.status,
        }
      );
    }

    if (!data.values || data.values.length === 0) {
      return NextResponse.json(
        {
          error:
            "Twelve Data returned no candle values.",
        },
        { status: 404 }
      );
    }

    const candles = data.values
      .map((value) => ({
        timestamp: Math.floor(
          new Date(
            `${value.datetime} GMT-0400`
          ).getTime() / 1000
        ),
        open: Number(value.open),
        high: Number(value.high),
        low: Number(value.low),
        close: Number(value.close),
        volume: Number(value.volume ?? 0),
      }))
      .filter(
        (candle) =>
          Number.isFinite(candle.timestamp) &&
          candle.timestamp >= from &&
          candle.timestamp <= to &&
          Number.isFinite(candle.open) &&
          Number.isFinite(candle.high) &&
          Number.isFinite(candle.low) &&
          Number.isFinite(candle.close)
      )
      .sort(
        (first, second) =>
          first.timestamp - second.timestamp
      );

    if (candles.length === 0) {
      return NextResponse.json(
        {
          error:
            "No candles were found inside the requested range.",
        },
        { status: 404 }
      );
    }

    const payload: CandlePayload = {
      provider: "Twelve Data",
      symbol,
      resolution,
      cached: false,
      candles,
    };

    setCachedValue(
      cacheKey,
      payload,
      getCacheDuration(resolution)
    );

    return NextResponse.json(payload);
  } catch (caughtError) {
    return NextResponse.json(
      {
        error:
          "Trade OS could not contact Twelve Data.",
        details:
          caughtError instanceof Error
            ? caughtError.message
            : "Unknown server error.",
      },
      { status: 502 }
    );
  }
}
