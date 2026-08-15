import { IndianAsset, IndianMarketIndex, IndianNewsItem } from '../types/index.js';

export const INDIAN_ASSETS: Record<string, IndianAsset> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 3012.45,
    previousClose: 2990.00,
    change24h: 22.45,
    change24hPercent: 0.75,
    marketCap: 20380000000000, // ₹20.38 Lakh Crore
    sector: 'Energy & Petrochemicals',
    dividendYield: 0.0035, // 0.35%
    beta: 1.05,
    sparkline: [2960, 2975, 2990, 2985, 3000, 3008, 3012.45],
    high52w: 3217.90,
    low52w: 2220.30,
    isin: 'INE002A01018',
    description: "India's largest conglomerate spanning Oil-to-Chemicals, Jio Digital Telecom, and Reliance Retail."
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 4325.80,
    previousClose: 4300.00,
    change24h: 25.80,
    change24hPercent: 0.60,
    marketCap: 15650000000000, // ₹15.65 Lakh Crore
    sector: 'Information Technology',
    dividendYield: 0.0165, // 1.65%
    beta: 0.82,
    sparkline: [4250, 4280, 4300, 4295, 4315, 4320, 4325.80],
    high52w: 4592.25,
    low52w: 3313.00,
    isin: 'INE467B01029',
    description: 'Premier global IT services, enterprise consulting and digital transformation powerhouse.'
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 1648.20,
    previousClose: 1635.00,
    change24h: 13.20,
    change24hPercent: 0.81,
    marketCap: 12540000000000, // ₹12.54 Lakh Crore
    sector: 'Banking & Financials',
    dividendYield: 0.0118,
    beta: 0.95,
    sparkline: [1610, 1622, 1635, 1632, 1640, 1645, 1648.20],
    high52w: 1794.00,
    low52w: 1363.55,
    isin: 'INE040A01034',
    description: "India's largest private sector bank with unmatched nationwide branch and retail credit network."
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 1885.50,
    previousClose: 1870.00,
    change24h: 15.50,
    change24hPercent: 0.83,
    marketCap: 7820000000000,
    sector: 'Information Technology',
    dividendYield: 0.0245,
    beta: 0.88,
    sparkline: [1840, 1855, 1870, 1865, 1875, 1882, 1885.50],
    high52w: 1990.00,
    low52w: 1358.35,
    isin: 'INE009A01021',
    description: 'Global leader in next-generation digital services, enterprise cloud, and Topaz AI solutions.'
  },
  ICICIBANK: {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 1248.50,
    previousClose: 1238.00,
    change24h: 10.50,
    change24hPercent: 0.85,
    marketCap: 8780000000000,
    sector: 'Banking & Financials',
    dividendYield: 0.0085,
    beta: 1.02,
    sparkline: [1215, 1225, 1238, 1234, 1242, 1245, 1248.50],
    high52w: 1300.90,
    low52w: 913.50,
    isin: 'INE090A01021',
    description: 'Leading private sector bank demonstrating strong return on assets (RoA) and digital leadership.'
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 1084.60,
    previousClose: 1065.00,
    change24h: 19.60,
    change24hPercent: 1.84,
    marketCap: 3980000000000,
    sector: 'Automotive & EV',
    dividendYield: 0.0055,
    beta: 1.42,
    sparkline: [1030, 1045, 1065, 1058, 1072, 1080, 1084.60],
    high52w: 1179.05,
    low52w: 593.50,
    isin: 'INE155A01022',
    description: 'Pioneer of India’s electric vehicle revolution and luxury mobility icon (Jaguar Land Rover).'
  },
  ITC: {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 492.10,
    previousClose: 489.00,
    change24h: 3.10,
    change24hPercent: 0.63,
    marketCap: 6140000000000,
    sector: 'FMCG & Consumer',
    dividendYield: 0.0280, // 2.8%
    beta: 0.65,
    sparkline: [480, 485, 489, 488, 490, 491, 492.10],
    high52w: 528.55,
    low52w: 399.30,
    isin: 'INE154A01025',
    description: 'Diversified consumer giant across FMCG brands (Aashirvaad, Sunfeast), Agri, and Paperboards.'
  },
  LT: {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd.',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 3680.00,
    previousClose: 3650.00,
    change24h: 30.00,
    change24hPercent: 0.82,
    marketCap: 5060000000000,
    sector: 'Infrastructure & Capital Goods',
    dividendYield: 0.0092,
    beta: 1.08,
    sparkline: [3590, 3620, 3650, 3640, 3665, 3675, 3680.00],
    high52w: 3948.60,
    low52w: 2853.00,
    isin: 'INE018A01030',
    description: 'National infrastructure builder with mega orders across defense, railways, power and green energy.'
  },
  SBIN: {
    symbol: 'SBIN',
    name: 'State Bank of India',
    exchange: 'NSE',
    assetClass: 'stocks',
    currentPrice: 834.50,
    previousClose: 828.00,
    change24h: 6.50,
    change24hPercent: 0.79,
    marketCap: 7440000000000,
    sector: 'PSU Banking',
    dividendYield: 0.0165,
    beta: 1.15,
    sparkline: [815, 822, 828, 826, 830, 832, 834.50],
    high52w: 912.10,
    low52w: 543.15,
    isin: 'INE062A01020',
    description: "The nation's largest sovereign public sector bank with over 500 million bank accounts."
  },

  // INDIAN ETFS & MUTUAL FUNDS
  NIFTYBEES: {
    symbol: 'NIFTYBEES',
    name: 'Nippon India ETF Nifty 50 BeES',
    exchange: 'NSE',
    assetClass: 'etfs',
    currentPrice: 268.40,
    previousClose: 267.10,
    change24h: 1.30,
    change24hPercent: 0.49,
    marketCap: 280000000000,
    sector: 'Nifty 50 Index ETF',
    dividendYield: 0.012,
    beta: 1.0,
    sparkline: [264, 265.5, 267.1, 266.8, 267.8, 268.1, 268.40],
    high52w: 275.50,
    low52w: 202.10,
    isin: 'INF732E01015',
    description: 'Tracks the benchmark NIFTY 50 Index with low expense ratio and high secondary market liquidity.'
  },
  BANKBEES: {
    symbol: 'BANKBEES',
    name: 'Nippon India ETF Nifty Bank BeES',
    exchange: 'NSE',
    assetClass: 'etfs',
    currentPrice: 524.30,
    previousClose: 521.00,
    change24h: 3.30,
    change24hPercent: 0.63,
    marketCap: 140000000000,
    sector: 'Banking Index ETF',
    dividendYield: 0.009,
    beta: 1.12,
    sparkline: [512, 516, 521, 519, 522.5, 523.8, 524.30],
    high52w: 548.00,
    low52w: 425.00,
    isin: 'INF732E01023',
    description: 'Tracks the 12 most capitalized and liquid Indian banking stocks in Nifty Bank.'
  },
  GOLDBEES: {
    symbol: 'GOLDBEES',
    name: 'Nippon India ETF Gold BeES',
    exchange: 'NSE',
    assetClass: 'commodities',
    currentPrice: 64.20,
    previousClose: 63.80,
    change24h: 0.40,
    change24hPercent: 0.63,
    marketCap: 120000000000,
    sector: 'Physical Gold ETF',
    dividendYield: 0.0,
    beta: 0.06,
    sparkline: [62.8, 63.2, 63.8, 63.7, 63.9, 64.1, 64.20],
    high52w: 66.80,
    low52w: 49.50,
    isin: 'INF732E01031',
    description: 'Direct investment in 99.5% pure physical gold bullion as inflation and rupee hedge.'
  },
  SGB: {
    symbol: 'SGB',
    name: 'Sovereign Gold Bonds (RBI Tranche)',
    exchange: 'NSE',
    assetClass: 'bonds',
    currentPrice: 7180.00,
    previousClose: 7150.00,
    change24h: 30.00,
    change24hPercent: 0.42,
    marketCap: 600000000000,
    sector: 'Sovereign Debt & Gold',
    dividendYield: 0.025, // 2.5% semi-annual interest from Govt of India
    beta: 0.05,
    sparkline: [7050, 7100, 7150, 7140, 7165, 7175, 7180.00],
    high52w: 7420.00,
    low52w: 5800.00,
    isin: 'IN0020230085',
    description: 'Government of India bonds denominated in gold grams with 2.5% annual interest and tax-free redemption.'
  },
  LIQUIDBEES: {
    symbol: 'LIQUIDBEES',
    name: 'Nippon India ETF Liquid BeES',
    exchange: 'NSE',
    assetClass: 'cash',
    currentPrice: 1000.00,
    previousClose: 1000.00,
    change24h: 0.00,
    change24hPercent: 0.00,
    marketCap: 150000000000,
    sector: 'Cash & Overnight Liquid',
    dividendYield: 0.0665, // ~6.65% annualized daily dividend reinvestment
    beta: 0.0,
    sparkline: [1000, 1000, 1000, 1000, 1000, 1000, 1000],
    high52w: 1000.00,
    low52w: 1000.00,
    isin: 'INF732E01037',
    description: 'Overnight money market tri-party repo fund used by traders to earn daily compounding returns on idle cash.'
  },
  EMBASSY: {
    symbol: 'EMBASSY',
    name: 'Embassy Office Parks REIT',
    exchange: 'NSE',
    assetClass: 'real_estate',
    currentPrice: 382.40,
    previousClose: 380.00,
    change24h: 2.40,
    change24hPercent: 0.63,
    marketCap: 362000000000,
    sector: 'Real Estate REIT',
    dividendYield: 0.068, // 6.8% distribution yield
    beta: 0.58,
    sparkline: [374, 377, 380, 379, 381, 381.8, 382.40],
    high52w: 405.00,
    low52w: 298.00,
    isin: 'INE041025011',
    description: "India's first publicly listed commercial office Real Estate Investment Trust with prime Grade-A IT parks."
  },
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin (INR Spot)',
    exchange: 'NSE',
    assetClass: 'crypto',
    currentPrice: 5240000.00, // ₹52.40 Lakhs
    previousClose: 5110000.00,
    change24h: 130000.00,
    change24hPercent: 2.54,
    marketCap: 103000000000000,
    sector: 'Digital Currency',
    dividendYield: 0.0,
    beta: 2.35,
    sparkline: [4980000, 5050000, 5110000, 5160000, 5210000, 5230000, 5240000],
    high52w: 6200000.00,
    low52w: 2200000.00,
    description: 'Decentralized digital store of value.'
  }
};

export const INDIAN_MARKET_INDICES: IndianMarketIndex[] = [
  {
    symbol: '^NSEI',
    name: 'NIFTY 50',
    exchange: 'NSE',
    price: 24540.20,
    change: 118.50,
    changePercent: 0.49,
    sparkline: [24300, 24380, 24450, 24490, 24520, 24540.2]
  },
  {
    symbol: '^BSESN',
    name: 'SENSEX',
    exchange: 'BSE',
    price: 80436.80,
    change: 375.40,
    changePercent: 0.47,
    sparkline: [79700, 79950, 80150, 80280, 80380, 80436.8]
  },
  {
    symbol: '^NSEBANK',
    name: 'NIFTY BANK',
    exchange: 'NSE',
    price: 51240.50,
    change: 322.10,
    changePercent: 0.63,
    sparkline: [50600, 50850, 51000, 51120, 51180, 51240.5]
  },
  {
    symbol: 'INDIAVIX',
    name: 'INDIA VIX',
    exchange: 'NSE',
    price: 14.85,
    change: -0.65,
    changePercent: -4.19,
    sparkline: [16.8, 16.1, 15.6, 15.2, 15.0, 14.85]
  },
  {
    symbol: 'MCXGOLD',
    name: 'GOLD MCX (₹/10g)',
    exchange: 'MCX',
    price: 71850.00,
    change: 280.00,
    changePercent: 0.39,
    sparkline: [71100, 71350, 71570, 71680, 71790, 71850]
  }
];

export const INDIAN_NEWS_FEED: IndianNewsItem[] = [
  {
    id: 'in-news-1',
    title: 'RBI Monetary Policy Committee Maintains Status Quo at 6.50%; Projects FY26 GDP Growth at 7.2%',
    source: 'Moneycontrol',
    timeAgo: '20m ago',
    sentiment: 'bullish',
    impactTag: 'Macro Tailwinds',
    relatedSymbols: ['NIFTYBEES', 'BANKBEES', 'HDFCBANK'],
    summary: 'RBI Governor emphasized robust domestic economic fundamentals, moderating core inflation, and disciplined banking system credit expansion.',
    actionableInsight: 'Stable interest rates benefit private sector lenders (HDFC Bank, ICICI Bank) and maintain high liquidity in corporate bonds.'
  },
  {
    id: 'in-news-2',
    title: 'DIIs Pump ₹3,850 Crore Into Large-Cap Equities as Retail SIP Inflows Cross Record ₹24,000 Crore/Month',
    source: 'Economic Times',
    timeAgo: '45m ago',
    sentiment: 'bullish',
    impactTag: 'SIP Inflows',
    relatedSymbols: ['RELIANCE', 'TCS', 'ITC'],
    summary: 'Mutual fund domestic institutional flows continue to absorb global volatility, providing strong support for Nifty 50 index constituents.',
    actionableInsight: 'Systematic rupee averaging (SIP) in core Nifty ETFs continues to generate asymmetric wealth compounding over 5-10 year cycles.'
  },
  {
    id: 'in-news-3',
    title: 'India Budget 2024 Tax Reforms: Equity STCG Revised to 20%, LTCG to 12.5% with ₹1.25 Lakh Annual Exemption',
    source: 'LiveMint',
    timeAgo: '2h ago',
    sentiment: 'neutral',
    impactTag: 'Tax Planning',
    relatedSymbols: ['NIFTYBEES', 'TATAMOTORS', 'INFY'],
    summary: 'Investors are adjusting year-end portfolios to optimize capital gains thresholds and leverage tax-loss harvesting under Section 112A.',
    actionableInsight: 'Use our AI Tax-Loss Harvester to offset short-term gains and save up to 20% on tax liability before March 31.'
  },
  {
    id: 'in-news-4',
    title: 'Tata Motors & Reliance Green Energy Drive Renewable and EV Supply Chain Expansions',
    source: 'Business Standard',
    timeAgo: '3h ago',
    sentiment: 'bullish',
    impactTag: 'Clean Energy Alpha',
    relatedSymbols: ['TATAMOTORS', 'RELIANCE', 'LT'],
    summary: 'Capex allocations for gigafactories and solar photovoltaic value chains receive government production-linked incentive (PLI) approvals.',
    actionableInsight: 'Industrial capex heavyweights (L&T, Tata Motors) offer multi-year earnings visibility in capital goods.'
  }
];

export class IndianMarketDataService {
  private assets: Record<string, IndianAsset> = { ...INDIAN_ASSETS };
  private listeners: ((assets: Record<string, IndianAsset>) => void)[] = [];
  private timer: any = null;

  constructor() {
    this.startSimulation();
  }

  public getAssets(): Record<string, IndianAsset> {
    return this.assets;
  }

  public getIndices(): IndianMarketIndex[] {
    return INDIAN_MARKET_INDICES;
  }

  public getNews(): IndianNewsItem[] {
    return INDIAN_NEWS_FEED;
  }

  public subscribe(callback: (assets: Record<string, IndianAsset>) => void): () => void {
    this.listeners.push(callback);
    callback(this.assets);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private startSimulation() {
    this.timer = setInterval(() => {
      const updated = { ...this.assets };
      let changed = false;

      const symbols = Object.keys(updated);
      const sampleCount = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < sampleCount; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const asset = updated[symbol];
        if (!asset || asset.symbol === 'LIQUIDBEES') continue;

        const vol = asset.assetClass === 'crypto' ? 0.003 : asset.assetClass === 'commodities' ? 0.001 : 0.0015;
        const delta = (Math.random() - 0.49) * vol * (asset.beta || 1.0);
        const newPrice = Math.max(0.05, +(asset.currentPrice * (1 + delta)).toFixed(2));

        if (newPrice !== asset.currentPrice) {
          const change24h = +(newPrice - asset.previousClose).toFixed(2);
          const change24hPercent = +((change24h / asset.previousClose) * 100).toFixed(2);
          const newSparkline = [...asset.sparkline.slice(1), newPrice];

          updated[symbol] = {
            ...asset,
            currentPrice: newPrice,
            change24h,
            change24hPercent,
            sparkline: newSparkline
          };
          changed = true;
        }
      }

      if (changed) {
        this.assets = updated;
        this.listeners.forEach(cb => cb(this.assets));
      }
    }, 2800);
  }
}

export const indianMarketService = new IndianMarketDataService();
