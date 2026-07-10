import TradingChart from "./TradingChart";
import LiveMarketCard from "./LiveMarketCard";
import DashboardCard from "./DashboardCard";
import MarketRibbon from "./MarketRibbon";
import AIMarketAnalysis from "./AIMarketAnalysis";
import WatchlistPanel from "./WatchlistPanel";
import PortfolioSummary from "./PortfolioSummary";
import PositionsTable from "./PositionsTable";
import NewsFeed from "./NewsFeed";
import QuickActions from "./QuickActions";
import TopMovers from "./TopMovers";

export default function Dashboard() {
  return (
    <div className="p-8">
      <MarketRibbon />

      <div className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="mt-2 text-slate-400">
          Monitor markets, portfolio and AI insights from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <LiveMarketCard />
        <WatchlistPanel />
        <PortfolioSummary />
        <DashboardCard
          title="Economic Calendar"
          value="Today"
          subtitle="No major events loaded"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl bg-slate-900 p-6 xl:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">Market Chart</h3>
          <TradingChart />
        </div>

        <AIMarketAnalysis />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PositionsTable />
        </div>

        <div className="space-y-6">
          <QuickActions />
          <TopMovers />
          <NewsFeed />
        </div>
      </div>
    </div>
  );
}
