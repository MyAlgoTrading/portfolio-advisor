import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  Portfolio, 
  Holding, 
  Transaction, 
  PortfolioMetrics, 
  Recommendation, 
  RebalanceTrade, 
  Currency, 
  RiskProfile, 
  AssetClass, 
  ChatMessage,
  Asset
} from '../types';
import { INITIAL_ASSETS, CURRENCY_RATES, marketService } from '../services/marketData';
import { PRESET_PORTFOLIOS } from '../data/presets';
import { AdvisorEngine } from '../services/advisorEngine';
import { formatINR } from '../utils/indianCurrency';

const BACKEND_URL = 'http://localhost:3001';

interface BrokerSessionState {
  broker: 'zerodha' | 'shoonya' | 'blinkx';
  connected: boolean;
  userName?: string;
  brokerClientId?: string;
  accountType?: string;
  availableMargin?: number;
}

interface PortfolioContextType {
  portfolios: Portfolio[];
  activePortfolio: Portfolio;
  metrics: PortfolioMetrics;
  recommendations: Recommendation[];
  assets: Record<string, Asset>;
  currency: Currency;
  selectedTimeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL';
  activeTab: string;
  aiMessages: ChatMessage[];
  connectedBrokers: Record<string, BrokerSessionState>;
  
  // Actions
  setActivePortfolioId: (id: string) => void;
  createPortfolio: (name: string, description: string, currency: Currency, riskProfile: RiskProfile, templateId?: string) => void;
  deletePortfolio: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (txId: string) => void;
  updateTargetAllocations: (allocations: Record<AssetClass, number>) => void;
  setCurrency: (c: Currency) => void;
  setSelectedTimeframe: (tf: '1D' | '1W' | '1M' | '1Y' | 'ALL') => void;
  setActiveTab: (tab: string) => void;
  executeTrade: (trade: RebalanceTrade) => void;
  executeAllRebalanceTrades: (trades: RebalanceTrade[]) => void;
  sendAIMessage: (text: string) => void;
  formatConverted: (amount: number, compact?: boolean) => string;
  exportPortfolioJSON: () => void;
  exportPortfolioCSV: () => void;
  importPortfolioJSON: (jsonStr: string) => boolean;
  
  // Indian Broker Actions
  connectBroker: (broker: 'zerodha' | 'shoonya' | 'blinkx', credentials: any) => Promise<void>;
  disconnectBroker: (broker: 'zerodha' | 'shoonya' | 'blinkx') => Promise<void>;
  syncBrokerHoldings: (broker: 'zerodha' | 'shoonya' | 'blinkx') => Promise<number>;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const STORAGE_KEY = 'portfolio_advisor_data_v2_inr';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.portfolios && parsed.portfolios.length > 0) return parsed.portfolios;
      } catch (e) {
        console.error('Failed to parse portfolios from localStorage', e);
      }
    }
    return PRESET_PORTFOLIOS;
  });

  const [activePortfolioId, setActivePortfolioId] = useState<string>(() => {
    return portfolios[0]?.id || 'preset-nifty-titans';
  });

  const [assets, setAssets] = useState<Record<string, Asset>>(INITIAL_ASSETS);
  const [currency, setCurrency] = useState<Currency>('INR');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Connected Brokers State
  const [connectedBrokers, setConnectedBrokers] = useState<Record<string, BrokerSessionState>>({
    zerodha: { broker: 'zerodha', connected: false },
    shoonya: { broker: 'shoonya', connected: false },
    blinkx: { broker: 'blinkx', connected: false }
  });

  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      content: "👋 Namaste! I'm your **Portfolio Advisor AI**, specialized in Indian capital markets (NSE/BSE).\n\nI continuously monitor your Nifty 50 constituents, Sharpe ratio, and STCG/LTCG tax allocations in real-time.\n\nConnect your **Zerodha Kite**, **Shoonya**, or **BlinkX** Demat account or choose a prompt below to diagnose portfolio health, check rebalancing drift, or simulate Indian macro stress tests!",
      metricsHighlight: [
        { label: 'Market', value: 'NSE / BSE India' },
        { label: 'STCG Rate', value: '20% (Sec 111A)' },
        { label: 'LTCG Rate', value: '12.5% (Sec 112A)' }
      ]
    }
  ]);

  // Fetch initial broker session statuses from backend
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/brokers/sessions`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sessions) {
          const map: Record<string, BrokerSessionState> = {};
          data.sessions.forEach((s: BrokerSessionState) => {
            map[s.broker] = s;
          });
          setConnectedBrokers(prev => ({ ...prev, ...map }));
        }
      })
      .catch(err => console.log('Backend server status check:', err.message));
  }, []);

  // Subscribe to live market tick simulation
  useEffect(() => {
    const unsubscribe = marketService.subscribe((updatedAssets) => {
      setAssets(updatedAssets);
    });
    return () => unsubscribe();
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ portfolios }));
  }, [portfolios]);

  const activePortfolio = portfolios.find(p => p.id === activePortfolioId) || portfolios[0];

  // Recalculate metrics & recommendations
  const metrics = AdvisorEngine.calculateMetrics(activePortfolio, assets);
  const recommendations = AdvisorEngine.generateRecommendations(activePortfolio, metrics, assets);

  const formatConverted = (amount: number, compact: boolean = false): string => {
    if (currency === 'INR') {
      return formatINR(amount, compact);
    }
    const rateInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.INR;
    const inrToTarget = (amount / CURRENCY_RATES.INR.rate) * rateInfo.rate;
    return `${rateInfo.symbol}${inrToTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const createPortfolio = (
    name: string, 
    description: string, 
    curr: Currency, 
    riskProfile: RiskProfile,
    templateId?: string
  ) => {
    let newPortfolio: Portfolio;
    if (templateId) {
      const tmpl = PRESET_PORTFOLIOS.find(p => p.id === templateId);
      if (tmpl) {
        newPortfolio = {
          ...tmpl,
          id: `portfolio-${Date.now()}`,
          name,
          description,
          currency: curr,
          riskProfile,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
      } else {
        newPortfolio = createBlankPortfolio(name, description, curr, riskProfile);
      }
    } else {
      newPortfolio = createBlankPortfolio(name, description, curr, riskProfile);
    }

    setPortfolios(prev => [...prev, newPortfolio]);
    setActivePortfolioId(newPortfolio.id);
  };

  const createBlankPortfolio = (name: string, desc: string, curr: Currency, risk: RiskProfile): Portfolio => ({
    id: `portfolio-${Date.now()}`,
    name,
    description: desc,
    currency: curr,
    riskProfile: risk,
    targetAllocations: {
      stocks: 50,
      etfs: 25,
      bonds: 10,
      commodities: 5,
      cash: 10,
      real_estate: 0,
      crypto: 0
    },
    holdings: [],
    transactions: [],
    cashBalance: 100000.00,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  });

  const deletePortfolio = (id: string) => {
    if (portfolios.length <= 1) {
      alert('You must have at least one active portfolio.');
      return;
    }
    const remaining = portfolios.filter(p => p.id !== id);
    setPortfolios(remaining);
    setActivePortfolioId(remaining[0].id);
  };

  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const txId = `tx-${Date.now()}`;
    const newTx: Transaction = { ...txData, id: txId };

    setPortfolios(prev => prev.map(p => {
      if (p.id !== activePortfolio.id) return p;

      let newHoldings = [...p.holdings];
      let newCash = p.cashBalance;
      const asset = assets[newTx.symbol];

      if (newTx.type === 'DEPOSIT') {
        newCash += newTx.total;
      } else if (newTx.type === 'WITHDRAWAL') {
        newCash = Math.max(0, newCash - newTx.total);
      } else if (newTx.type === 'BUY') {
        newCash = Math.max(0, newCash - (newTx.total + (newTx.fee || 0)));
        const existingIdx = newHoldings.findIndex(h => h.symbol === newTx.symbol);
        const currPrice = asset ? asset.currentPrice : newTx.price;

        if (existingIdx >= 0) {
          const existing = newHoldings[existingIdx];
          const newQty = existing.quantity + newTx.quantity;
          const newCost = existing.totalCost + newTx.total;
          const newAvg = newCost / newQty;
          const curVal = newQty * currPrice;

          const updatedHolding: Holding = {
            ...existing,
            quantity: newQty,
            avgBuyPrice: +newAvg.toFixed(2),
            totalCost: +newCost.toFixed(2),
            currentPrice: currPrice,
            currentValue: +curVal.toFixed(2),
            unrealizedPnL: +(curVal - newCost).toFixed(2),
            unrealizedPnLPercent: +(((curVal - newCost) / newCost) * 100).toFixed(2),
            lots: [
              ...(existing.lots || []),
              {
                id: `lot-${Date.now()}`,
                date: newTx.date,
                quantity: newTx.quantity,
                buyPrice: newTx.price,
                currentValue: +(newTx.quantity * currPrice).toFixed(2),
                unrealizedPnL: +((currPrice - newTx.price) * newTx.quantity).toFixed(2),
                unrealizedPnLPercent: +(((currPrice - newTx.price) / newTx.price) * 100).toFixed(2)
              }
            ]
          };
          newHoldings[existingIdx] = updatedHolding;
        } else {
          const curVal = newTx.quantity * currPrice;
          const holding: Holding = {
            id: `h-${Date.now()}`,
            symbol: newTx.symbol,
            name: asset ? asset.name : newTx.symbol,
            assetClass: asset ? asset.assetClass : 'stocks',
            sector: asset ? asset.sector : 'Other',
            quantity: newTx.quantity,
            avgBuyPrice: newTx.price,
            currentPrice: currPrice,
            totalCost: newTx.total,
            currentValue: curVal,
            unrealizedPnL: +(curVal - newTx.total).toFixed(2),
            unrealizedPnLPercent: +(((curVal - newTx.total) / newTx.total) * 100).toFixed(2),
            allocationPercent: 0,
            targetAllocationPercent: 10,
            change24hPercent: asset ? asset.change24hPercent : 0,
            dividendYield: asset ? asset.dividendYield : 0,
            annualDividendIncome: +(curVal * (asset ? asset.dividendYield : 0)).toFixed(2),
            beta: asset ? asset.beta : 1.0,
            sparkline: asset ? asset.sparkline : [newTx.price, newTx.price],
            lots: [
              {
                id: `lot-${Date.now()}`,
                date: newTx.date,
                quantity: newTx.quantity,
                buyPrice: newTx.price,
                currentValue: curVal,
                unrealizedPnL: +((currPrice - newTx.price) * newTx.quantity).toFixed(2),
                unrealizedPnLPercent: +(((currPrice - newTx.price) / newTx.price) * 100).toFixed(2)
              }
            ]
          };
          newHoldings.push(holding);
        }
      } else if (newTx.type === 'SELL') {
        newCash += (newTx.total - (newTx.fee || 0));
        const existingIdx = newHoldings.findIndex(h => h.symbol === newTx.symbol);
        if (existingIdx >= 0) {
          const existing = newHoldings[existingIdx];
          const newQty = Math.max(0, existing.quantity - newTx.quantity);
          if (newQty === 0) {
            newHoldings.splice(existingIdx, 1);
          } else {
            const currPrice = asset ? asset.currentPrice : existing.currentPrice;
            const curVal = newQty * currPrice;
            const newCost = newQty * existing.avgBuyPrice;
            newHoldings[existingIdx] = {
              ...existing,
              quantity: newQty,
              totalCost: +newCost.toFixed(2),
              currentValue: +curVal.toFixed(2),
              unrealizedPnL: +(curVal - newCost).toFixed(2),
              unrealizedPnLPercent: +(((curVal - newCost) / newCost) * 100).toFixed(2)
            };
          }
        }
      }

      return {
        ...p,
        holdings: newHoldings,
        transactions: [newTx, ...p.transactions],
        cashBalance: +newCash.toFixed(2),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
  };

  const deleteTransaction = (txId: string) => {
    setPortfolios(prev => prev.map(p => {
      if (p.id !== activePortfolio.id) return p;
      return {
        ...p,
        transactions: p.transactions.filter(t => t.id !== txId)
      };
    }));
  };

  const updateTargetAllocations = (allocations: Record<AssetClass, number>) => {
    setPortfolios(prev => prev.map(p => {
      if (p.id !== activePortfolio.id) return p;
      return {
        ...p,
        targetAllocations: allocations,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
  };

  const executeTrade = (trade: RebalanceTrade) => {
    const orderType = trade.action;
    addTransaction({
      portfolioId: activePortfolio.id,
      symbol: trade.symbol,
      type: orderType,
      quantity: trade.shares,
      price: trade.estimatedPrice,
      fee: 20,
      total: trade.estimatedTotal,
      date: new Date().toISOString().split('T')[0],
      notes: `Rebalancing order: ${trade.rationale}`
    });
  };

  const executeAllRebalanceTrades = (trades: RebalanceTrade[]) => {
    if (!trades || trades.length === 0) return;
    trades.forEach(trade => {
      executeTrade(trade);
    });

    import('canvas-confetti').then(confettiModule => {
      const confetti = confettiModule.default || confettiModule;
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }).catch(err => console.log('Confetti load error', err));
  };

  // Indian Broker Methods
  const connectBroker = async (broker: 'zerodha' | 'shoonya' | 'blinkx', credentials: any) => {
    const res = await fetch(`${BACKEND_URL}/api/brokers/connect/${broker}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to connect broker');
    }
    setConnectedBrokers(prev => ({
      ...prev,
      [broker]: data.session
    }));
  };

  const disconnectBroker = async (broker: 'zerodha' | 'shoonya' | 'blinkx') => {
    await fetch(`${BACKEND_URL}/api/brokers/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ broker })
    });
    setConnectedBrokers(prev => ({
      ...prev,
      [broker]: { broker, connected: false }
    }));
  };

  const syncBrokerHoldings = async (broker: 'zerodha' | 'shoonya' | 'blinkx'): Promise<number> => {
    const res = await fetch(`${BACKEND_URL}/api/brokers/${broker}/holdings`);
    const data = await res.json();
    if (!data.success || !data.holdings) {
      throw new Error(data.message || 'Failed to fetch broker holdings');
    }

    const importedHoldings: Holding[] = data.holdings.map((bh: any) => {
      const asset = assets[bh.tradingsymbol] || {
        name: bh.tradingsymbol,
        sector: bh.sector || 'Equities',
        dividendYield: 0.015,
        sparkline: [bh.average_price, bh.last_price],
        change24h: bh.day_change || 0,
        change24hPercent: bh.day_change_percentage || 0,
        beta: 1.0
      };

      const totalCost = +(bh.quantity * bh.average_price).toFixed(2);
      const currentValue = +(bh.quantity * bh.last_price).toFixed(2);
      const unrealizedPnL = +(currentValue - totalCost).toFixed(2);
      const unrealizedPnLPercent = +(((currentValue - totalCost) / totalCost) * 100).toFixed(2);

      return {
        id: `h-broker-${bh.tradingsymbol}-${Date.now()}`,
        symbol: bh.tradingsymbol,
        name: asset.name,
        assetClass: bh.assetClass || 'stocks',
        sector: bh.sector || asset.sector || 'Equities',
        quantity: bh.quantity,
        avgBuyPrice: bh.average_price,
        currentPrice: bh.last_price,
        totalCost,
        currentValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        allocationPercent: 0,
        targetAllocationPercent: 10,
        change24hPercent: asset.change24hPercent,
        dividendYield: asset.dividendYield,
        annualDividendIncome: +(currentValue * asset.dividendYield).toFixed(2),
        beta: asset.beta || 1.0,
        sparkline: asset.sparkline,
        lots: [
          {
            id: `lot-br-${bh.tradingsymbol}`,
            date: new Date().toISOString().split('T')[0],
            quantity: bh.quantity,
            buyPrice: bh.average_price,
            currentValue,
            unrealizedPnL,
            unrealizedPnLPercent
          }
        ]
      };
    });

    setPortfolios(prev => prev.map(p => {
      if (p.id !== activePortfolio.id) return p;
      return {
        ...p,
        holdings: importedHoldings,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));

    return importedHoldings.length;
  };

  const sendAIMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages(prev => [...prev, userMsg]);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: { portfolio: activePortfolio, metrics } })
      });
      const data = await res.json();

      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: data.timestamp || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        content: data.response
      };
      setAiMessages(prev => [...prev, aiReply]);
    } catch {
      // Fallback local heuristic
      const responseText = `### 🇮🇳 Indian Portfolio Insight\n\nI evaluated your portfolio "${activePortfolio.name}" (${formatConverted(metrics.totalValue)} net worth):\n\n* **Sharpe Ratio**: ${metrics.sharpeRatio} (Beta: ${metrics.beta})\n* **Health Score**: ${metrics.healthScore}/100\n* **Tax Optimization**: Keep LTCG within the ₹1.25 Lakh exemption limit under Section 112A to pay 0% capital gains tax.`;
      const aiReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        content: responseText
      };
      setAiMessages(prev => [...prev, aiReply]);
    }
  };

  const exportPortfolioJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activePortfolio, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activePortfolio.name.toLowerCase().replace(/\s+/g, '_')}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportPortfolioCSV = () => {
    let csv = "Symbol,Name,Asset Class,Quantity,Avg Buy Price,Current Price,Total Cost,Current Value,Unrealized P&L,Unrealized P&L %\n";
    activePortfolio.holdings.forEach(h => {
      csv += `"${h.symbol}","${h.name}","${h.assetClass}",${h.quantity},${h.avgBuyPrice},${h.currentPrice},${h.totalCost},${h.currentValue},${h.unrealizedPnL},${h.unrealizedPnLPercent}%\n`;
    });
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activePortfolio.name.toLowerCase().replace(/\s+/g, '_')}_holdings.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importPortfolioJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.name && Array.isArray(parsed.holdings)) {
        const imported: Portfolio = {
          ...parsed,
          id: `portfolio-${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setPortfolios(prev => [...prev, imported]);
        setActivePortfolioId(imported.id);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        activePortfolio,
        metrics,
        recommendations,
        assets,
        currency,
        selectedTimeframe,
        activeTab,
        aiMessages,
        connectedBrokers,
        setActivePortfolioId,
        createPortfolio,
        deletePortfolio,
        addTransaction,
        deleteTransaction,
        updateTargetAllocations,
        setCurrency,
        setSelectedTimeframe,
        setActiveTab,
        executeTrade,
        executeAllRebalanceTrades,
        sendAIMessage,
        formatConverted,
        exportPortfolioJSON,
        exportPortfolioCSV,
        importPortfolioJSON,
        connectBroker,
        disconnectBroker,
        syncBrokerHoldings
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within PortfolioProvider');
  return context;
};
