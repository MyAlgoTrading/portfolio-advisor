export type BrokerType = 'zerodha' | 'shoonya' | 'blinkx';

export interface ZerodhaCredentials {
  apiKey: string;
  apiSecret: string;
  requestToken?: string;
  accessToken?: string;
  publicToken?: string;
}

export interface ShoonyaCredentials {
  userId: string;
  password?: string;
  twoFA?: string; // TOTP or answer
  vendorCode?: string;
  apiKey?: string;
  token?: string;
}

export interface BlinkXCredentials {
  clientCode: string;
  apiKey?: string;
  sessionToken?: string;
}

export interface BrokerSession {
  broker: BrokerType;
  connected: boolean;
  connectedAt?: string;
  userName?: string;
  userEmail?: string;
  brokerClientId?: string;
  accountType?: string;
  availableMargin?: number;
}

export interface BrokerHolding {
  tradingsymbol: string;
  exchange: 'NSE' | 'BSE' | 'MCX';
  isin: string;
  quantity: number;
  t1_quantity: number;
  average_price: number;
  last_price: number;
  close_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  assetClass: 'stocks' | 'crypto' | 'etfs' | 'bonds' | 'commodities' | 'cash' | 'real_estate';
  sector: string;
}

export interface IndianAsset {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'MCX';
  assetClass: 'stocks' | 'crypto' | 'etfs' | 'bonds' | 'commodities' | 'cash' | 'real_estate';
  currentPrice: number;
  previousClose: number;
  change24h: number;
  change24hPercent: number;
  marketCap?: number;
  sector: string;
  dividendYield: number;
  beta: number;
  sparkline: number[];
  high52w: number;
  low52w: number;
  isin?: string;
  description?: string;
}

export interface IndianMarketIndex {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE' | 'MCX';
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface IndianNewsItem {
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

export interface IndianTaxCalculation {
  holdingPeriodDays: number;
  isLongTerm: boolean;
  unrealizedGainLoss: number;
  applicableTaxRate: number; // 20% STCG or 12.5% LTCG
  estimatedTax: number;
  eligibleForLossHarvesting: boolean;
}
