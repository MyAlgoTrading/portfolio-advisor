import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { brokerGateway } from './services/brokerGateway.js';
import { indianMarketService } from './services/indianMarketData.js';
import { IndianTaxEngine } from './services/indianTaxEngine.js';
import { BrokerType } from './types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    market: 'India (NSE/BSE/MCX)',
    timestamp: new Date().toISOString()
  });
});

// 2. Indian Market Data Endpoints
app.get('/api/market/assets', (req, res) => {
  res.json({
    success: true,
    assets: indianMarketService.getAssets()
  });
});

app.get('/api/market/indices', (req, res) => {
  res.json({
    success: true,
    indices: indianMarketService.getIndices()
  });
});

app.get('/api/market/news', (req, res) => {
  res.json({
    success: true,
    news: indianMarketService.getNews()
  });
});

// 3. Broker Management & Auth Endpoints
app.get('/api/brokers/sessions', (req, res) => {
  res.json({
    success: true,
    sessions: brokerGateway.getAllSessions()
  });
});

app.post('/api/brokers/connect/zerodha', async (req, res) => {
  try {
    const { apiKey, apiSecret, requestToken } = req.body;
    const result = await brokerGateway.connectZerodha({ apiKey, apiSecret, requestToken });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/brokers/connect/shoonya', async (req, res) => {
  try {
    const { userId, password, twoFA, vendorCode, apiKey } = req.body;
    const result = await brokerGateway.connectShoonya({ userId, password, twoFA, vendorCode, apiKey });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/brokers/connect/blinkx', async (req, res) => {
  try {
    const { clientCode, apiKey, sessionToken } = req.body;
    const result = await brokerGateway.connectBlinkX({ clientCode, apiKey, sessionToken });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/brokers/disconnect', (req, res) => {
  const { broker } = req.body;
  const session = brokerGateway.disconnect(broker as BrokerType);
  res.json({ success: true, session, message: `Disconnected from ${broker}` });
});

app.get('/api/brokers/:broker/holdings', async (req, res) => {
  try {
    const broker = req.params.broker as BrokerType;
    const holdings = await brokerGateway.getHoldings(broker);
    res.json({ success: true, broker, holdings });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/brokers/:broker/order', async (req, res) => {
  try {
    const broker = req.params.broker as BrokerType;
    const orderData = req.body;
    const result = await brokerGateway.placeOrder(broker, orderData);
    res.json({ success: true, result });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 4. Indian Capital Gains Tax Analysis Endpoint
app.post('/api/advisor/tax-analysis', (req, res) => {
  try {
    const { holdings } = req.body;
    const summary = IndianTaxEngine.analyzeTax(holdings || []);
    res.json({ success: true, taxSummary: summary });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 5. AI Advisor Co-Pilot Query Endpoint
app.post('/api/ai/chat', (req, res) => {
  const { message, context } = req.body;
  const q = (message || '').toLowerCase();

  let response = '';
  if (q.includes('tax') || q.includes('budget') || q.includes('ltcg') || q.includes('stcg')) {
    response = `### 🇮🇳 Indian Tax Analysis (Union Budget 2024 Provisions)\n\n* **STCG (Section 111A)**: 20% on equity shares and equity mutual funds held for less than 12 months.\n* **LTCG (Section 112A)**: 12.5% on gains exceeding the **₹1,25,000 annual exemption** per financial year.\n* **Tax-Loss Harvesting**: You can harvest unrealized losses in lagger stocks before March 31 to offset short-term gains, directly saving 20% in tax outflow.\n* **SGB & Debt Funds**: Sovereign Gold Bonds held until 8-year maturity enjoy 100% tax-free capital gains under Section 47.`;
  } else if (q.includes('broker') || q.includes('zerodha') || q.includes('shoonya') || q.includes('blinkx')) {
    response = `### 🔌 Broker Integration Guide\n\n* **Zerodha Kite**: Connect using your Kite Connect API Key & Secret for automated Demat holdings synchronization and 1-click rebalancing order routing.\n* **Shoonya (Finvasia)**: Supports zero-brokerage trading and free API access for seamless multi-account tracking.\n* **BlinkX (JM Financial)**: Connect via Client Code and API Token for smart portfolio risk evaluation.`;
  } else {
    response = `### 🇮🇳 Indian Market Wealth Strategy\n\nFor a balanced long-term portfolio in India:\n1. **Core Equities (50-60%)**: Nifty 50 leaders (Reliance, TCS, HDFC Bank, Infosys) or NIFTYBEES ETF.\n2. **Gold & Hedges (10-15%)**: GOLDBEES or Sovereign Gold Bonds (SGBs) for rupee depreciation protection.\n3. **Debt & Cash (20-30%)**: Corporate Bonds, Bharat Bond ETF, or LIQUIDBEES yielding 6.7%+ daily.\n4. **Rebalance Rule**: Rebalance whenever equity drift exceeds ±5% from your target allocation.`;
  }

  res.json({
    success: true,
    response,
    timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  });
});

app.listen(PORT, () => {
  console.log(`🇮🇳 Portfolio Advisor Indian Backend Server running on http://localhost:${PORT}`);
});
