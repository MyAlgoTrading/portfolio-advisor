export type AssetClass = 
  | 'stocks' 
  | 'crypto' 
  | 'etfs' 
  | 'bonds' 
  | 'commodities' 
  | 'cash' 
  | 'real_estate';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR';

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive' | 'custom';

export type TransactionType = 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAWAL';

export interface Asset {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  currentPrice: number;
  previousClose: number;
  change24h: number;
  change24hPercent: number;
  marketCap?: number;
  sector: string;
  dividendYield: number; // e.g. 0.025 for 2.5%
  beta: number;
  sparkline: number[];
  high52w: number;
  low52w: number;
  volume24h?: number;
  description?: string;
}

export interface TransactionLot {
  id: string;
  date: string;
  quantity: number;
  buyPrice: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface Holding {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  sector: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  totalCost: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  allocationPercent: number;
  targetAllocationPercent: number;
  change24hPercent: number;
  dividendYield: number;
  annualDividendIncome: number;
  beta: number;
  sparkline: number[];
  lots: TransactionLot[];
}

export interface Transaction {
  id: string;
  portfolioId: string;
  symbol: string;
  type: TransactionType;
  quantity: number;
  price: number;
  fee: number;
  total: number;
  date: string;
  notes?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  currency: Currency;
  cashBalance: number;
  holdings: Holding[];
  transactions: Transaction[];
  targetAllocations: Record<AssetClass, number>;
  riskProfile: RiskProfile;
  createdAt: string;
  updatedAt: string;
}

export interface HealthBreakdown {
  diversification: number; // 0-100
  riskAdjustedReturn: number; // 0-100
  rebalanceDrift: number; // 0-100
  feeEfficiency: number; // 0-100
  dividendStability: number; // 0-100
  liquidityScore: number; // 0-100
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayGainLoss: number;
  dayGainLossPercent: number;
  annualDividendIncome: number;
  portfolioYield: number;
  sharpeRatio: number;
  beta: number;
  volatility: number;
  healthScore: number;
  healthBreakdown: HealthBreakdown;
  assetClassWeights: Record<AssetClass, { value: number; percent: number }>;
  sectorWeights: Record<string, { value: number; percent: number }>;
}

export interface RebalanceTrade {
  symbol: string;
  assetClass: AssetClass;
  action: 'BUY' | 'SELL';
  shares: number;
  estimatedPrice: number;
  estimatedTotal: number;
  currentWeight: number;
  targetWeight: number;
  urgency: 'high' | 'medium' | 'low';
  rationale: string;
}

export interface Recommendation {
  id: string;
  type: 'REBALANCE' | 'TAX_LOSS_HARVEST' | 'DIVERSIFICATION' | 'DIVIDEND_BOOSTER' | 'HEDGE' | 'CASH_DRAG' | 'DCA_ALERT';
  title: string;
  description: string;
  badge: string;
  impactScore: number; // 1 to 100
  urgency: 'high' | 'medium' | 'low';
  trades?: RebalanceTrade[];
  actionLabel?: string;
  actionPayload?: {
    type: 'BUY' | 'SELL' | 'REBALANCE_ALL' | 'NAVIGATE';
    symbol?: string;
    quantity?: number;
    amount?: number;
    targetTab?: string;
  };
  metrics?: { label: string; value: string; positive?: boolean }[];
  rationale: string[];
}

export interface ScenarioResult {
  id: string;
  title: string;
  category: 'Macro' | 'Market Crisis' | 'Geopolitical' | 'Tech Wave';
  description: string;
  projectedReturnPercent: number;
  projectedValue: number;
  estimatedLossOrGain: number;
  maxDrawdown: number;
  recoveryMonths: number;
  resilienceScore: number; // 0-100
  impactsByAssetClass: Record<AssetClass, number>;
  insights: string[];
  recommendedHedges: string[];
}

export interface MonteCarloPoint {
  year: number;
  p10: number; // Conservative 10th percentile
  p50: number; // Expected Median 50th percentile
  p90: number; // Optimistic 90th percentile
  p25: number;
  p75: number;
  contributions: number;
}

export interface MonteCarloSimulationResult {
  points: MonteCarloPoint[];
  finalConservative: number;
  finalMedian: number;
  finalOptimistic: number;
  totalContributions: number;
  probabilityOfProfit: number;
  probabilityOfDoubling: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impactTag: string;
  relatedSymbols: string[];
  summary: string;
  actionableInsight: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: 'EXECUTE_TRADE' | 'REBALANCE' | 'APPLY_PRESET' | 'SWITCH_TAB';
    payload: any;
  }[];
  metricsHighlight?: {
    label: string;
    value: string;
    change?: string;
  }[];
}
