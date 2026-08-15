---
name: portfolio-advisor-expert
description: Comprehensive expert workflow guide and architectural reference for developing, maintaining, and extending Portfolio Advisor (India Edition) with Zerodha Kite, Shoonya, BlinkX, Indian market feeds, tax engines, and Monte Carlo models.
---

# Portfolio Advisor Expert Skill

Use this skill when developing, debugging, extending, or maintaining **Portfolio Advisor (India Edition)**.

---

## 1. Quick Repository Map

```
portfolio-advisor/
├── src/                          # React 19 + TypeScript Frontend
│   ├── types/index.ts            # Canonical data types & interfaces
│   ├── styles/index.css          # Design system, cyber-fintech dark theme, glassmorphism tokens
│   ├── utils/
│   │   ├── chartSetup.ts         # Chart.js registered controllers
│   │   └── indianCurrency.ts     # formatINR() Lakhs & Crores formatter
│   ├── services/
│   │   ├── marketData.ts         # Frontend Indian market feeds & real-time tick engine
│   │   └── advisorEngine.ts      # Health scoring (0-100), drift rebalancing, Monte Carlo, stress tests
│   ├── data/presets.ts           # Indian investor default templates (Nifty Titans, Dalio All-Weather)
│   ├── context/PortfolioContext.tsx # Global state, broker connectors, LocalStorage persistence
│   └── components/
│       ├── Header.tsx            # Live ticker tape, portfolio dropdown, broker connect button
│       ├── PortfolioOverview.tsx # Metrics cards, trajectory chart, asset class doughnut
│       ├── HoldingsTable.tsx     # Multi-asset table, 7-day sparklines, tax lots accordion
│       ├── RecommendationHub.tsx # Health radar, visual allocation sliders, 1-click rebalance, Indian tax card
│       ├── ScenarioStudio.tsx    # 10-year Monte Carlo fan chart, Indian macro stress-tests
│       ├── MarketPulse.tsx       # Benchmark indices, Fear & Greed gauge, news sentiment feed
│       ├── AICoPilot.tsx         # AI Financial Advisor chat interface
│       └── Modals/
│           ├── AddTransactionModal.tsx  # Manual trade recorder
│           ├── CreatePortfolioModal.tsx # New portfolio wizard
│           ├── ImportExportModal.tsx    # JSON/CSV backup & restore
│           ├── AssetDetailModal.tsx     # Asset deep-dive modal with mini chart & fundamentals
│           └── BrokerConnectModal.tsx   # Zerodha, Shoonya, BlinkX auth & 1-click Demat sync
│
└── server/                       # Node.js + Express Backend (:3001)
    ├── src/
    │   ├── index.ts              # REST API endpoints (/api/*)
    │   ├── types/index.ts        # Backend broker, asset, and tax contracts
    │   └── services/
    │       ├── brokerGateway.ts  # Zerodha Kite, Shoonya, BlinkX gateways + Sandbox
    │       ├── indianMarketData.ts # Real-time tick engine for NSE/BSE stocks & indices
    │       └── indianTaxEngine.ts # Section 111A (STCG 20%) & 112A (LTCG 12.5%) calculator
```

---

## 2. Common Developer Workflows

### A. How to Add a New Indian Broker Connector (e.g. Angel One, Groww, Upstox)
1. **Define Credentials & Session in Backend Types**:
   - In `server/src/types/index.ts`, extend `BrokerType` and add `NewBrokerCredentials`.
2. **Implement Connector in `server/src/services/brokerGateway.ts`**:
   - Add `connectNewBroker(creds)`: Handle OAuth / API handshake and store session.
   - Add holdings mapping in `getHoldings(broker)` returning standardized `BrokerHolding[]`.
3. **Expose REST API in `server/src/index.ts`**:
   - Add `app.post('/api/brokers/connect/newbroker', ...)`
4. **Update Frontend UI in `src/components/Modals/BrokerConnectModal.tsx`**:
   - Add new broker tab with logo, API input fields, and instructions.

---

### B. How to Add New Indian Equities or Mutual Funds
1. **Update `server/src/services/indianMarketData.ts`**:
   - Add entry to `INDIAN_ASSETS` with `symbol`, `name`, `exchange` (`NSE`/`BSE`), `currentPrice`, `dividendYield`, `beta`, `sparkline`, `sector`.
2. **Update Frontend `src/services/marketData.ts`**:
   - Mirror the asset entry in `INITIAL_ASSETS`.

---

### C. How to Update Indian Tax Rates (Post-Union Budget Revisions)
1. **In `server/src/services/indianTaxEngine.ts`**:
   - Modify `STCG_RATE` (e.g., `0.20`), `LTCG_RATE` (e.g., `0.125`), and `LTCG_EXEMPTION_LIMIT` (e.g., `125000`).
2. **In `src/components/RecommendationHub.tsx`**:
   - Update the tax card labels and calculation constants.
3. **In `src/services/advisorEngine.ts`**:
   - Adjust `rec-tax-loss-india` tax rate multiplier.

---

### D. How to Modify Rebalancing Rules or Health Scoring Weights
1. Open `src/services/advisorEngine.ts`:
   - `calculateMetrics()`: Adjust weightings between Diversification (25%), Risk-Adjusted Return (25%), Rebalance Drift (25%), Dividend Stability (15%), and Liquidity (10%).
   - `generateRecommendations()`: Modify drift threshold triggers (currently `> 2%` of total portfolio value).

---

## 3. Running & Verifying Changes

```bash
# 1. Start Backend Server
cd server
npm run dev # Runs on port 3001

# 2. Start Frontend App
npm run dev # Runs on port 5173

# 3. Test Production Compilation
npm run build # Frontend
npm --prefix server run build # Backend
```
