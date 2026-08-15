import type { Portfolio } from '../types';

export const PRESET_PORTFOLIOS: Portfolio[] = [
  {
    id: 'preset-nifty-titans',
    name: 'Nifty Bluechip & Growth Titans',
    description: 'High-conviction exposure to top Indian market leaders spanning Tech, Private Banking, EV Auto, and Energy.',
    currency: 'INR',
    riskProfile: 'aggressive',
    targetAllocations: {
      stocks: 55,
      etfs: 25,
      crypto: 5,
      bonds: 5,
      commodities: 5,
      cash: 5,
      real_estate: 0
    },
    holdings: [
      {
        id: 'h-rel',
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd.',
        assetClass: 'stocks',
        sector: 'Energy & Petrochemicals',
        quantity: 40,
        avgBuyPrice: 2820.00,
        currentPrice: 3012.45,
        totalCost: 112800.00,
        currentValue: 120498.00,
        unrealizedPnL: 7698.00,
        unrealizedPnLPercent: 6.82,
        allocationPercent: 23.5,
        targetAllocationPercent: 20.0,
        change24hPercent: 0.75,
        dividendYield: 0.0035,
        annualDividendIncome: 421.74,
        beta: 1.05,
        sparkline: [2960, 2975, 2990, 2985, 3000, 3008, 3012.45],
        lots: [
          { id: 'lot-rel-1', date: '2024-06-12', quantity: 25, buyPrice: 2780.00, currentValue: 75311.25, unrealizedPnL: 5811.25, unrealizedPnLPercent: 8.36 },
          { id: 'lot-rel-2', date: '2024-11-04', quantity: 15, buyPrice: 2886.67, currentValue: 45186.75, unrealizedPnL: 1886.75, unrealizedPnLPercent: 4.36 }
        ]
      },
      {
        id: 'h-tcs',
        symbol: 'TCS',
        name: 'Tata Consultancy Services Ltd.',
        assetClass: 'stocks',
        sector: 'Information Technology',
        quantity: 25,
        avgBuyPrice: 3950.00,
        currentPrice: 4325.80,
        totalCost: 98750.00,
        currentValue: 108145.00,
        unrealizedPnL: 9395.00,
        unrealizedPnLPercent: 9.51,
        allocationPercent: 21.1,
        targetAllocationPercent: 20.0,
        change24hPercent: 0.60,
        dividendYield: 0.0165,
        annualDividendIncome: 1784.39,
        beta: 0.82,
        sparkline: [4250, 4280, 4300, 4295, 4315, 4320, 4325.80],
        lots: [
          { id: 'lot-tcs-1', date: '2024-04-18', quantity: 25, buyPrice: 3950.00, currentValue: 108145.00, unrealizedPnL: 9395.00, unrealizedPnLPercent: 9.51 }
        ]
      },
      {
        id: 'h-hdfc',
        symbol: 'HDFCBANK',
        name: 'HDFC Bank Ltd.',
        assetClass: 'stocks',
        sector: 'Banking & Financials',
        quantity: 60,
        avgBuyPrice: 1540.00,
        currentPrice: 1648.20,
        totalCost: 92400.00,
        currentValue: 98892.00,
        unrealizedPnL: 6492.00,
        unrealizedPnLPercent: 7.03,
        allocationPercent: 19.3,
        targetAllocationPercent: 15.0,
        change24hPercent: 0.81,
        dividendYield: 0.0118,
        annualDividendIncome: 1166.93,
        beta: 0.95,
        sparkline: [1610, 1622, 1635, 1632, 1640, 1645, 1648.20],
        lots: [
          { id: 'lot-hdfc-1', date: '2024-08-10', quantity: 60, buyPrice: 1540.00, currentValue: 98892.00, unrealizedPnL: 6492.00, unrealizedPnLPercent: 7.03 }
        ]
      },
      {
        id: 'h-tm',
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Ltd.',
        assetClass: 'stocks',
        sector: 'Automotive & EV',
        quantity: 80,
        avgBuyPrice: 940.00,
        currentPrice: 1084.60,
        totalCost: 75200.00,
        currentValue: 86768.00,
        unrealizedPnL: 11568.00,
        unrealizedPnLPercent: 15.38,
        allocationPercent: 16.9,
        targetAllocationPercent: 15.0,
        change24hPercent: 1.84,
        dividendYield: 0.0055,
        annualDividendIncome: 477.22,
        beta: 1.42,
        sparkline: [1030, 1045, 1065, 1058, 1072, 1080, 1084.60],
        lots: [
          { id: 'lot-tm-1', date: '2024-09-05', quantity: 80, buyPrice: 940.00, currentValue: 86768.00, unrealizedPnL: 11568.00, unrealizedPnLPercent: 15.38 }
        ]
      },
      {
        id: 'h-niftybees',
        symbol: 'NIFTYBEES',
        name: 'Nippon India ETF Nifty 50 BeES',
        assetClass: 'etfs',
        sector: 'Nifty 50 Index ETF',
        quantity: 350,
        avgBuyPrice: 252.00,
        currentPrice: 268.40,
        totalCost: 88200.00,
        currentValue: 93940.00,
        unrealizedPnL: 5740.00,
        unrealizedPnLPercent: 6.51,
        allocationPercent: 18.3,
        targetAllocationPercent: 25.0,
        change24hPercent: 0.49,
        dividendYield: 0.012,
        annualDividendIncome: 1127.28,
        beta: 1.0,
        sparkline: [264, 265.5, 267.1, 266.8, 267.8, 268.1, 268.40],
        lots: [
          { id: 'lot-nb-1', date: '2024-03-20', quantity: 350, buyPrice: 252.00, currentValue: 93940.00, unrealizedPnL: 5740.00, unrealizedPnLPercent: 6.51 }
        ]
      },
      {
        id: 'h-goldbees',
        symbol: 'GOLDBEES',
        name: 'Nippon India ETF Gold BeES',
        assetClass: 'commodities',
        sector: 'Physical Gold ETF',
        quantity: 300,
        avgBuyPrice: 58.00,
        currentPrice: 64.20,
        totalCost: 17400.00,
        currentValue: 19260.00,
        unrealizedPnL: 1860.00,
        unrealizedPnLPercent: 10.69,
        allocationPercent: 3.7,
        targetAllocationPercent: 5.0,
        change24hPercent: 0.63,
        dividendYield: 0.0,
        annualDividendIncome: 0.0,
        beta: 0.06,
        sparkline: [62.8, 63.2, 63.8, 63.7, 63.9, 64.1, 64.20],
        lots: [
          { id: 'lot-gb-1', date: '2024-02-14', quantity: 300, buyPrice: 58.00, currentValue: 19260.00, unrealizedPnL: 1860.00, unrealizedPnLPercent: 10.69 }
        ]
      }
    ],
    transactions: [
      { id: 'tx-1', portfolioId: 'preset-nifty-titans', date: '2024-02-14', type: 'BUY', symbol: 'GOLDBEES', quantity: 300, price: 58.00, fee: 20, total: 17420.00, notes: 'Gold hedge allocation' },
      { id: 'tx-2', portfolioId: 'preset-nifty-titans', date: '2024-03-20', type: 'BUY', symbol: 'NIFTYBEES', quantity: 350, price: 252.00, fee: 20, total: 88220.00, notes: 'Nifty 50 core SIP' },
      { id: 'tx-3', portfolioId: 'preset-nifty-titans', date: '2024-04-18', type: 'BUY', symbol: 'TCS', quantity: 25, price: 3950.00, fee: 20, total: 98770.00, notes: 'Q4 earnings accumulation' },
      { id: 'tx-4', portfolioId: 'preset-nifty-titans', date: '2024-06-12', type: 'BUY', symbol: 'RELIANCE', quantity: 25, price: 2780.00, fee: 20, total: 69520.00, notes: 'Post-election dip buy' },
      { id: 'tx-5', portfolioId: 'preset-nifty-titans', date: '2024-08-10', type: 'BUY', symbol: 'HDFCBANK', quantity: 60, price: 1540.00, fee: 20, total: 92420.00, notes: 'Valuation discount entry' },
      { id: 'tx-6', portfolioId: 'preset-nifty-titans', date: '2024-09-05', type: 'BUY', symbol: 'TATAMOTORS', quantity: 80, price: 940.00, fee: 20, total: 75220.00, notes: 'EV market leader accumulation' }
    ],
    cashBalance: 45000.00,
    createdAt: '2024-01-15',
    updatedAt: '2026-08-15'
  },
  {
    id: 'preset-all-weather-india',
    name: 'All-Weather Indian Wealth (Dalio India)',
    description: 'Engineered for smooth compounding across all Indian economic cycles (Inflation, Deflation, High Growth, Rate Hikes).',
    currency: 'INR',
    riskProfile: 'moderate',
    targetAllocations: {
      stocks: 30,
      etfs: 25,
      bonds: 25,
      commodities: 10,
      cash: 5,
      real_estate: 5,
      crypto: 0
    },
    holdings: [
      {
        id: 'h-nb-aw',
        symbol: 'NIFTYBEES',
        name: 'Nippon India ETF Nifty 50 BeES',
        assetClass: 'etfs',
        sector: 'Nifty 50 Index ETF',
        quantity: 550,
        avgBuyPrice: 255.00,
        currentPrice: 268.40,
        totalCost: 140250.00,
        currentValue: 147620.00,
        unrealizedPnL: 7370.00,
        unrealizedPnLPercent: 5.25,
        allocationPercent: 36.8,
        targetAllocationPercent: 25.0,
        change24hPercent: 0.49,
        dividendYield: 0.012,
        annualDividendIncome: 1771.44,
        beta: 1.0,
        sparkline: [264, 265.5, 267.1, 266.8, 267.8, 268.1, 268.40],
        lots: [
          { id: 'lot-nb-aw-1', date: '2024-03-01', quantity: 550, buyPrice: 255.00, currentValue: 147620.00, unrealizedPnL: 7370.00, unrealizedPnLPercent: 5.25 }
        ]
      },
      {
        id: 'h-sgb-aw',
        symbol: 'SGB',
        name: 'Sovereign Gold Bonds (RBI)',
        assetClass: 'bonds',
        sector: 'Sovereign Debt & Gold',
        quantity: 15,
        avgBuyPrice: 6600.00,
        currentPrice: 7180.00,
        totalCost: 99000.00,
        currentValue: 107700.00,
        unrealizedPnL: 8700.00,
        unrealizedPnLPercent: 8.79,
        allocationPercent: 26.8,
        targetAllocationPercent: 25.0,
        change24hPercent: 0.42,
        dividendYield: 0.025,
        annualDividendIncome: 2692.50,
        beta: 0.05,
        sparkline: [7050, 7100, 7150, 7140, 7165, 7175, 7180.00],
        lots: [
          { id: 'lot-sgb-aw-1', date: '2024-03-05', quantity: 15, buyPrice: 6600.00, currentValue: 107700.00, unrealizedPnL: 8700.00, unrealizedPnLPercent: 8.79 }
        ]
      },
      {
        id: 'h-itc-aw',
        symbol: 'ITC',
        name: 'ITC Ltd.',
        assetClass: 'stocks',
        sector: 'FMCG & Consumer',
        quantity: 180,
        avgBuyPrice: 445.00,
        currentPrice: 492.10,
        totalCost: 80100.00,
        currentValue: 88578.00,
        unrealizedPnL: 8478.00,
        unrealizedPnLPercent: 10.58,
        allocationPercent: 22.1,
        targetAllocationPercent: 20.0,
        change24hPercent: 0.63,
        dividendYield: 0.0280,
        annualDividendIncome: 2480.18,
        beta: 0.65,
        sparkline: [480, 485, 489, 488, 490, 491, 492.10],
        lots: [
          { id: 'lot-itc-aw-1', date: '2024-03-10', quantity: 180, buyPrice: 445.00, currentValue: 88578.00, unrealizedPnL: 8478.00, unrealizedPnLPercent: 10.58 }
        ]
      },
      {
        id: 'h-embassy-aw',
        symbol: 'EMBASSY',
        name: 'Embassy Office Parks REIT',
        assetClass: 'real_estate',
        sector: 'Real Estate REIT',
        quantity: 150,
        avgBuyPrice: 360.00,
        currentPrice: 382.40,
        totalCost: 54000.00,
        currentValue: 57360.00,
        unrealizedPnL: 3360.00,
        unrealizedPnLPercent: 6.22,
        allocationPercent: 14.3,
        targetAllocationPercent: 10.0,
        change24hPercent: 0.63,
        dividendYield: 0.068,
        annualDividendIncome: 3900.48,
        beta: 0.58,
        sparkline: [374, 377, 380, 379, 381, 381.8, 382.40],
        lots: [
          { id: 'lot-emb-aw-1', date: '2024-03-15', quantity: 150, buyPrice: 360.00, currentValue: 57360.00, unrealizedPnL: 3360.00, unrealizedPnLPercent: 6.22 }
        ]
      }
    ],
    transactions: [],
    cashBalance: 60000.00,
    createdAt: '2024-03-01',
    updatedAt: '2026-08-15'
  }
];
