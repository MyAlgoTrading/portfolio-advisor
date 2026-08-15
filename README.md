# 🇮🇳 Portfolio Advisor — Intelligent Portfolio Manager & AI Advisor (India Edition)

An institutional-grade, privacy-first web application designed specifically for Indian capital markets (NSE, BSE, MCX), featuring real-time Indian market feeds, Indian rupee (`₹` Lakhs & Crores) formatting, Indian capital gains tax intelligence (STCG 20% / LTCG 12.5% per Union Budget 2024), and direct broker integrations for **Zerodha Kite Connect**, **Shoonya (Finvasia)**, and **BlinkX (JM Financial)**.

---

## 🌟 Key Features

* **🔌 Indian Broker Integration Hub**: Direct synchronization with **Zerodha Kite**, **Shoonya**, and **BlinkX** to import live Demat holdings, monitor margins, and execute rebalancing trades with 1 click (includes zero-setup **Sandbox Mode**).
* **📊 Live Indian Market Feed**: Real-time ticker tape and sub-3-second live tick engine for **NIFTY 50**, **SENSEX**, **NIFTY BANK**, **INDIA VIX**, **MCX GOLD**, and top NSE bluechips (`RELIANCE`, `TCS`, `HDFCBANK`, `INFY`, `TATAMOTORS`, `ITC`, `LT`).
* **🧠 Quantitative Health Diagnosis (0–100)**: 5-pillar evaluation measuring Diversification (HHI Index), Risk-Adjusted Sharpe Ratio, Allocation Drift Penalty, Fee Efficiency, and Dividend Stability.
* **⚖️ Visual Target Rebalancing Workbench**: Interactive allocation sliders, strategy presets (*Nifty Growth*, *All-Weather Dalio India*, *High-Yield Dividend*), and automated zero-drift order calculation.
* **📜 Indian Capital Gains Tax Intelligence**: Automated tracking of **STCG (20% under Sec 111A)** and **LTCG (12.5% on gains > ₹1.25 Lakh under Sec 112A)** with tax-loss harvesting recommendations.
* **🔮 10-Year Monte Carlo Wealth Forecaster**: 1,000-run stochastic simulation modeling compound growth, monthly SIP contributions, and wealth percentile trajectories (Conservative 10th, Expected Median 50th, Optimistic 90th).
* **🛡️ Indian Macro Stress-Testing Lab**: Simulate tail-risk shocks (*RBI Repo Rate Hikes*, *FII Mega Outflows*, *Budget Tax Shocks*, *Rupee Depreciation*) with max drawdown and recovery estimates.
* **🤖 AI Strategy Co-Pilot**: Conversational financial assistant providing real-time portfolio analysis and executing trade orders directly from chat.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18+ or v22+
* **npm**: v9+ or v10+

### 1. Start the Backend API Server
```bash
cd server
npm install
npm run dev
```
* Backend API will start on **`http://localhost:3001`**.

### 2. Start the Frontend Web App
In a new terminal window:
```bash
# In the root directory (portfolio-advisor)
npm install
npm run dev
```
* Open **`http://localhost:5173`** in your browser!

---

## 🔌 How to Connect Your Indian Broker

1. Click the **"🔗 Connect Indian Broker"** button in the top navigation bar.
2. Select your broker:
   * **Zerodha Kite Connect**: Enter your Kite API Key, API Secret, and Request Token.
   * **Shoonya by Finvasia**: Enter your Shoonya User ID, Password, and 2FA TOTP code.
   * **BlinkX by JM Financial**: Enter your Client Code.
   * **🚀 Sandbox Mode**: Click *"Quick Connect with Sandbox Data"* to test-drive without entering live secrets!
3. Click **"📥 1-Click Sync Demat Holdings to Active Portfolio"** to import all your holdings into the dashboard.

---

## 📁 Repository Structure

```
portfolio-advisor/
├── docs/
│   ├── REQUIREMENTS.md         # Product Requirements Document (PRD)
│   └── TECH_SPEC.md            # In-depth Technical Specification & Architecture
├── .agents/
│   ├── skills/
│   │   └── portfolio-advisor-expert/
│   │       └── SKILL.md        # Antigravity Expert Skill for future modifications
│   └── rules/
│       └── portfolio-advisor.md# Antigravity Workspace Coding Conventions
├── src/                        # React 19 + TypeScript Frontend
│   ├── types/index.ts          # Core domain models
│   ├── utils/
│   │   ├── indianCurrency.ts   # Format ₹ Lakhs and Crores
│   │   └── chartSetup.ts       # Chart.js registered controllers
│   ├── services/
│   │   ├── marketData.ts       # Live Indian market tick feed
│   │   └── advisorEngine.ts    # Scoring, rebalancing, Monte Carlo, stress tests
│   ├── context/PortfolioContext.tsx # Central state & broker sync bindings
│   └── components/             # Dashboard, Holdings, Rebalancing, Co-Pilot UI
│
└── server/                     # Node.js + Express Backend (:3001)
    ├── src/
    │   ├── index.ts            # REST API endpoints (/api/*)
    │   ├── types/index.ts      # Backend broker & tax interfaces
    │   └── services/
    │       ├── brokerGateway.ts   # Zerodha, Shoonya, BlinkX connectors
    │       ├── indianMarketData.ts# Real-time tick engine
    │       └── indianTaxEngine.ts # Section 111A / 112A tax calculator
```

---

## 📜 Indian Tax Rules Implemented (Budget 2024)

| Tax Section | Asset Class | Holding Period | Tax Rate | Notes |
|---|---|---|---|---|
| **Section 111A (STCG)** | Listed Equities & Equity ETFs | < 12 Months | **20%** | Revised from 15% in July 2024 Budget |
| **Section 112A (LTCG)** | Listed Equities & Equity ETFs | >= 12 Months | **12.5%** | Applicable on aggregate gains above ₹1.25 Lakh/yr |
| **Section 47 (SGBs)** | Sovereign Gold Bonds | 8-Year Maturity | **0% (Tax-Free)** | 100% Capital Gains Exemption |

---

## 🛠️ Production Build

```bash
# Build Frontend
npm run build

# Build Backend
npm --prefix server run build
```

---

## 📄 License & Privacy
* **Privacy-First**: Your Demat data and API keys are stored locally on your machine and never transmitted to external analytics.
* MIT License.
