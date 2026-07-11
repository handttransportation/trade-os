import TradingChart from "./TradingChart";
import LiveMarketCard from "./LiveMarketCard";
import MarketRibbon from "./MarketRibbon";
import AIMarketAnalysis from "./AIMarketAnalysis";
import WatchlistPanel from "./WatchlistPanel";
import PortfolioSummary from "./PortfolioSummary";
import PositionsTable from "./PositionsTable";
import NewsFeed from "./NewsFeed";
import QuickActions from "./QuickActions";
import TopMovers from "./TopMovers";
import OpportunityOverview from "./OpportunityOverview";
import Card from "./ui/Card";

export default function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-6 md:px-6 xl:px-8">
      <MarketRibbon />

      <div className="mt-6">
        <OpportunityOverview />
      </div>

      <div className="mb-6 mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
            Trading Workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
            Market Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            Monitor market conditions, AI analysis, watchlists,
            portfolio exposure, and trading opportunities from one
            professional workspace.
          </p>
        </div>

        <div className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-400">
          Paper trading environment
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <LiveMarketCard />
        <WatchlistPanel />
        <PortfolioSummary />

        <Card
          title="Economic Calendar"
          subtitle="Upcoming market-moving events"
          className="h-full"
        >
          <div className="flex min-h-28 flex-col justify-center">
            <p className="text-2xl font-bold text-white">
              Today
            </p>

            <p className="mt-2 text-sm text-slate-500">
              No major economic events are currently loaded.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Market Chart"
          subtitle="Interactive price action and technical structure"
          className="min-w-0 xl:col-span-2"
        >
          <div className="min-h-[440px]">
            <TradingChart />
          </div>
        </Card>

        <div className="min-w-0">
          <AIMarketAnalysis />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card
          title="Open Positions"
          subtitle="Current paper-trading holdings and performance"
          className="min-w-0 xl:col-span-2"
        >
          <PositionsTable embedded />
        </Card>

        <div className="space-y-6">
          <QuickActions />
          <TopMovers />
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}
