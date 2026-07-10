type NewsItem = {
  id: number;
  time: string;
  category: string;
  headline: string;
  sentiment: "positive" | "negative" | "neutral";
};

const newsItems: NewsItem[] = [
  {
    id: 1,
    time: "09:32",
    category: "Markets",
    headline: "Technology shares lead the major indexes higher.",
    sentiment: "positive",
  },
  {
    id: 2,
    time: "10:05",
    category: "Federal Reserve",
    headline: "Investors review new comments on inflation and interest rates.",
    sentiment: "neutral",
  },
  {
    id: 3,
    time: "10:41",
    category: "TSLA",
    headline: "Tesla volatility increases as traders watch a key technical level.",
    sentiment: "negative",
  },
  {
    id: 4,
    time: "11:18",
    category: "AAPL",
    headline: "Apple holds above intraday support as buying pressure improves.",
    sentiment: "positive",
  },
];

function getSentimentStyles(sentiment: NewsItem["sentiment"]) {
  if (sentiment === "positive") {
    return "bg-green-400";
  }

  if (sentiment === "negative") {
    return "bg-red-400";
  }

  return "bg-yellow-400";
}

export default function NewsFeed() {
  return (
    <section className="rounded-xl bg-slate-900 p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">Market News</h3>
        <p className="mt-1 text-sm text-slate-400">
          Important market headlines and developing stories.
        </p>
      </div>

      <div className="space-y-4">
        {newsItems.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-slate-800 bg-slate-950 p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${getSentimentStyles(
                  item.sentiment
                )}`}
              />

              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {item.category}
              </span>

              <span className="ml-auto text-xs text-slate-500">
                {item.time}
              </span>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-200">
              {item.headline}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}