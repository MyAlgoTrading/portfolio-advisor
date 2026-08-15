# Product Requirements Document (PRD) — Portfolio Advisor

**Product Name:** Portfolio Advisor (India Edition)  
**Version:** 1.0.0  
**Target Market:** Indian Capital Markets (NSE, BSE, MCX)  
**Base Currency:** INR (₹)  
**Primary Users:** Indian Retail Investors, Wealth Builders, HNIs, and Active Traders  

---

## 1. Executive Summary & Vision

**Portfolio Advisor** is an intelligent, privacy-first portfolio management and automated quantitative advisory platform built specifically for Indian investors. It bridges the gap between passive tracking spreadsheets and institutional wealth engines by providing:
1. **Direct Demat Synchronization** with premier Indian discount and full-service brokerages (**Zerodha Kite Connect**, **Shoonya by Finvasia**, and **BlinkX by JM Financial**).
2. **Real-time Market Ticks & Indian Benchmark Feeds** across NIFTY 50, SENSEX, NIFTY BANK, INDIA VIX, and MCX Gold.
3. **Institutional Quantitative Diagnosis**: Herfindahl-Hirschman Index (HHI) concentration scoring, Sharpe Ratio risk adjustment, and 5-Pillar Health Radar.
4. **Visual Drift Rebalancer**: Side-by-side current vs. target asset allocation with 1-click trade generation.
5. **Indian Capital Gains Tax Intelligence**: Automated tracking of STCG (20% under Section 111A) and LTCG (12.5% under Section 112A with ₹1,25,000 annual exemption post-Union Budget 2024).
6. **10-Year Monte Carlo Wealth Forecaster & Indian Macro Stress-Testing Lab**.
7. **Interactive AI Strategy Co-Pilot** assisting users with natural language financial inquiries and instant rebalance executions.

---

## 2. User Personas

| Persona | Description | Core Pain Points Addressed |
|---|---|---|
| **P1: The Long-Term SIP Investor** | Working professional investing monthly in Nifty 50 ETFs, large-caps, and SGBs. | Tracks asset class drift, ensures healthy diversification, and forecasts 10-20 year compounding milestones via Monte Carlo. |
| **P2: The Multi-Broker Trader** | Has Demat holdings split across Zerodha, Shoonya, and BlinkX. | Aggregates all Demat accounts into a unified net-worth view with 1-click broker sync. |
| **P3: The Tax-Conscious HNI** | Manages significant equity positions and wants to minimize capital gains tax outflows. | Calculates STCG/LTCG liabilities, monitors the ₹1.25 Lakh exemption threshold, and flags year-end tax-loss harvesting candidates. |

---

## 3. Functional Requirements (FR)

### FR-1: Multi-Portfolio & Multi-Asset Tracking
- **Multi-Portfolio Architecture**: Support creation, naming, description, and management of multiple distinct portfolios (e.g., *Retirement 401(k)*, *Nifty Titans*, *All-Weather India*).
- **Supported Asset Classes**:
  - `stocks`: Listed equities on NSE/BSE (e.g., Reliance, TCS, HDFC Bank, Infosys).
  - `etfs`: Index & Sectoral ETFs (e.g., NIFTYBEES, BANKBEES, JUNIORBEES).
  - `commodities`: Physical Gold ETFs (GOLDBEES), Silver ETFs.
  - `bonds`: Sovereign Gold Bonds (SGBs), Corporate Bonds, Bharat Bond ETF.
  - `real_estate`: Publicly listed Real Estate Investment Trusts (Embassy REIT, Nexus REIT).
  - `cash`: Overnight Liquid funds (LIQUIDBEES) and uninvested cash reserves.
  - `crypto`: Digital store of value (BTC in INR).
- **Tax Lots & Purchase History**: Granular lots tracking buy dates, quantities, cost bases, and individual unrealized gains.

### FR-2: Real-Time Market Ticks & Indian Indices
- **Live Ticker Tape**: Broadcast real-time prices and percentage changes for **NIFTY 50**, **SENSEX**, **NIFTY BANK**, **INDIA VIX**, and **MCX GOLD**.
- **Price Fluctuation Engine**: Sub-3-second live market tick simulation updating asset prices, 24h P&L, and 7-day sparkline curves with green/red flash visual feedback.

### FR-3: Indian Broker Integration Gateway
- **Supported Brokers**:
  - **Zerodha Kite Connect**: OAuth 2.0 / SHA-256 Checksum (`api_key + request_token + api_secret`), holdings retrieval (`GET /portfolio/holdings`), available margins, order routing.
  - **Shoonya (Finvasia)**: Zero-brokerage API authentication (User ID, Password, TOTP 2FA), position and holdings sync.
  - **BlinkX (JM Financial)**: Client code and session token authentication.
- **1-Click Sync**: Direct extraction and conversion of broker holdings into active portfolio positions.
- **Sandbox Mode**: Realistic pre-configured Demat portfolios for zero-setup demonstration.

### FR-4: Quantitative Health Score (0–100) & 5-Pillar Radar
- **Diversification Pillar (25%)**: Evaluates asset and stock concentration using the Herfindahl-Hirschman Index (HHI).
- **Risk-Adjusted Return Pillar (25%)**: Evaluates portfolio Beta and Sharpe Ratio against the 6.5% risk-free benchmark.
- **Rebalance Drift Pillar (25%)**: Measures deviations between actual asset class percentages and user target weights.
- **Dividend Stability Pillar (15%)**: Evaluates annual cash flow yield against inflation.
- **Liquidity Buffer Pillar (10%)**: Ensures healthy cash/liquid reserves (optimal 3% – 15%).

### FR-5: Visual Target Allocation Rebalancing
- **Side-by-Side Comparison**: Live comparison between Current Weight % and Target Weight %.
- **Interactive Sliders**: Real-time slider controls with 100% total allocation validation.
- **Strategy Presets**: One-click allocation models (*Nifty Growth & Alpha*, *All-Weather Dalio India*, *High-Yield Dividend*, *Classic 60/40*).
- **Automated Order Generation**: Computes exact buy/sell shares and rupee amounts to achieve 0% drift.
- **1-Click Execution**: Fires rebalancing orders with celebratory confetti animations.

### FR-6: Indian Capital Gains Tax Intelligence (Budget 2024)
- **STCG Module (Section 111A)**: Calculates 20% short-term capital gains tax for assets held `< 12 months`.
- **LTCG Module (Section 112A)**: Calculates 12.5% long-term capital gains tax on gains exceeding the ₹1,25,000 annual exemption limit.
- **Tax-Loss Harvesting**: Scans short-term loss positions and computes exact rupee tax savings if harvested before March 31.
- **SGB Exemption Rules**: Highlights 100% tax-free capital gains on Sovereign Gold Bonds held till maturity.

### FR-7: 10-to-30 Year Monte Carlo Stochastic Forecaster
- **Geometric Brownian Motion**: 1,000 simulation runs modeling monthly compound growth, volatility, and monthly SIP contributions.
- **Percentile Fan Charts**: Visualizes **10th Percentile (Conservative)**, **50th Percentile (Median Expected)**, and **90th Percentile (Optimistic Bullish)**.
- **Milestone Probabilities**: Computes probability of capital profit and probability of doubling net worth.

### FR-8: Indian Macroeconomic Stress-Testing Lab
- Simulates portfolio resilience across real-world macro shocks:
  1. *RBI Repo Rate Spike (+75 bps)*
  2. *FII Mega Outflow Wave (₹35,000 Cr Exodus)*
  3. *Union Budget Capital Gains Tax Revision Shock*
  4. *Rupee Depreciation (USD/INR to 88.50) & Crude Oil Surge ($95/bbl)*
- Displays projected portfolio return, maximum drawdown %, recovery duration in months, and recommended hedges (`GOLDBEES`, `SGB`, `LIQUIDBEES`).

### FR-9: Market Pulse & News Sentiment Stream
- **Fear & Greed Dial (0–100)**: Market momentum gauge.
- **Trending Movers**: Top gainers and decliners across watchlist assets.
- **Curated News Stream**: Real-time headlines from Moneycontrol, Economic Times, and LiveMint with algorithmic sentiment tags (`BULLISH`, `BEARISH`, `NEUTRAL`) and actionable portfolio takeaways.

### FR-10: Conversational AI Strategy Co-Pilot
- Context-aware financial chat assistant answering questions on portfolio risk, Nifty allocations, tax optimization, and executing trades directly from chat chips.

---

## 4. Non-Functional Requirements (NFR)

* **NFR-1: Local Privacy & Security**: Broker credentials and financial holdings reside strictly in the local environment and are never transmitted to unauthorized third parties.
* **NFR-2: Sub-Millisecond Frontend Performance**: Sliders, scenario toggles, and charts must re-render at 60 FPS without UI jank.
* **NFR-3: Data Portability**: Complete export/import functionality supporting JSON format and CSV spreadsheet backups.
* **NFR-4: Responsive Dark Cyber-Fintech UI**: Glassmorphism design, Outfit & Inter typography, JetBrains Mono numbers, and mobile/desktop responsive layouts.
* **NFR-5: Modular Backend Architecture**: Clean separation between REST controller, broker connectors, tax engine, and market data services.
