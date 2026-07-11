export type Signal = "BUY" | "SELL" | "HOLD";

export type StrategyResult = {
  strategy: string;
  signal: Signal;
  confidence: number;
  entry: number;
  stopLoss: number;
  takeProfit: number;
  reason: string[];
};

export type MarketSnapshot = {
  symbol: string;
  currentPrice: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  atr?: number;
};
