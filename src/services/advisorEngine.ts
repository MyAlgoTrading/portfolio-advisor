import type { 
  Portfolio, 
  PortfolioMetrics, 
  Recommendation, 
  RebalanceTrade, 
  ScenarioResult, 
  MonteCarloSimulationResult, 
  AssetClass, 
  Asset 
} from '../types';

export class AdvisorEngine {
  /**
   * Calculate full quantitative health metrics
   */
  public static calculateMetrics(
    portfolio: Portfolio,
    assets: Record<string, Asset>
  ): PortfolioMetrics {
    const holdings = portfolio.holdings || [];
    let holdingsValue = 0;
    let totalCost = 0;
    let totalDayChange = 0;
    let annualDividendIncome = 0;
    let weightedBeta = 0;

    const classWeights: Record<AssetClass, { value: number; percent: number }> = {
      stocks: { value: 0, percent: 0 },
      crypto: { value: 0, percent: 0 },
      etfs: { value: 0, percent: 0 },
      bonds: { value: 0, percent: 0 },
      commodities: { value: 0, percent: 0 },
      cash: { value: portfolio.cashBalance || 0, percent: 0 },
      real_estate: { value: 0, percent: 0 }
    };

    const sectorValues: Record<string, number> = {};

    holdings.forEach(h => {
      const asset = assets[h.symbol];
      const price = asset ? asset.currentPrice : h.currentPrice;
      const currentVal = h.quantity * price;
      const cost = h.totalCost || (h.quantity * h.avgBuyPrice);
      const dayChange = (asset ? asset.change24h : 0) * h.quantity;
      const divYield = asset ? asset.dividendYield : (h.dividendYield || 0);
      const beta = asset ? asset.beta : 1.0;

      holdingsValue += currentVal;
      totalCost += cost;
      totalDayChange += dayChange;
      annualDividendIncome += currentVal * divYield;

      const ac: AssetClass = h.assetClass || 'stocks';
      if (classWeights[ac]) {
        classWeights[ac].value += currentVal;
      } else {
        classWeights.stocks.value += currentVal;
      }

      const sec = h.sector || (asset ? asset.sector : 'Other');
      sectorValues[sec] = (sectorValues[sec] || 0) + currentVal;
      weightedBeta += (beta * currentVal);
    });

    const totalValue = +(holdingsValue + (portfolio.cashBalance || 0)).toFixed(2);
    const totalGainLoss = +(totalValue - totalCost - (portfolio.cashBalance || 0)).toFixed(2);
    const totalGainLossPercent = totalCost > 0 ? +((totalGainLoss / totalCost) * 100).toFixed(2) : 0;
    const dayGainLossPercent = totalValue > 0 ? +((totalDayChange / totalValue) * 100).toFixed(2) : 0;

    if (totalValue > 0) {
      (Object.keys(classWeights) as AssetClass[]).forEach(k => {
        classWeights[k].percent = +((classWeights[k].value / totalValue) * 100).toFixed(1);
      });
      weightedBeta = totalValue > 0 ? +(weightedBeta / totalValue).toFixed(2) : 1.0;
    } else {
      weightedBeta = 1.0;
    }

    const sectorWeights: Record<string, { value: number; percent: number }> = {};
    Object.keys(sectorValues).forEach(sec => {
      sectorWeights[sec] = {
        value: +sectorValues[sec].toFixed(2),
        percent: totalValue > 0 ? +((sectorValues[sec] / totalValue) * 100).toFixed(1) : 0
      };
    });

    // 1. Diversification Score (HHI)
    let hhi = 0;
    holdings.forEach(h => {
      const sharePct = totalValue > 0 ? ((h.currentValue / totalValue) * 100) : 0;
      hhi += (sharePct * sharePct);
    });
    const diversificationScore = Math.max(20, Math.min(100, Math.round(100 - (hhi / 100))));

    // 2. Risk-adjusted Sharpe ratio estimate
    const riskFreeRate = 0.065; // ~6.5% RBI repo rate
    const portfolioYield = totalValue > 0 ? +((annualDividendIncome / totalValue) * 100).toFixed(2) : 0;
    const estimatedReturn = 0.12 + (weightedBeta - 1) * 0.04;
    const estimatedVolatility = 0.14 * Math.max(0.7, weightedBeta);
    const sharpeRatio = +(Math.max(-1, (estimatedReturn - riskFreeRate) / estimatedVolatility)).toFixed(2);
    const riskScore = Math.max(30, Math.min(100, Math.round(50 + (sharpeRatio * 30))));

    // 3. Drift Score
    let totalDrift = 0;
    const targetAllocations = portfolio.targetAllocations || { stocks: 50, etfs: 25, bonds: 10, commodities: 5, cash: 10, real_estate: 0, crypto: 0 };
    (Object.keys(classWeights) as AssetClass[]).forEach(ac => {
      const current = classWeights[ac].percent;
      const target = targetAllocations[ac] || 0;
      totalDrift += Math.abs(current - target);
    });
    const rebalanceScore = Math.max(10, Math.min(100, Math.round(100 - (totalDrift * 1.5))));

    // 4. Dividend Stability
    const dividendScore = Math.min(100, Math.round(portfolioYield * 25 + 30));

    // 5. Liquidity buffer
    const cashPct = classWeights.cash.percent;
    const liquidityScore = (cashPct >= 3 && cashPct <= 15) ? 95 : (cashPct > 15 ? 70 : 45);

    // 6. Fee Efficiency
    const feeScore = 92;

    const overallHealthScore = Math.round(
      (diversificationScore * 0.25) +
      (riskScore * 0.25) +
      (rebalanceScore * 0.25) +
      (dividendScore * 0.15) +
      (liquidityScore * 0.10)
    );

    return {
      totalValue,
      totalCost: +totalCost.toFixed(2),
      totalGainLoss,
      totalGainLossPercent,
      dayGainLoss: +totalDayChange.toFixed(2),
      dayGainLossPercent,
      annualDividendIncome: +annualDividendIncome.toFixed(2),
      portfolioYield,
      beta: weightedBeta,
      sharpeRatio,
      volatility: +(estimatedVolatility * 100).toFixed(1),
      healthScore: Math.max(10, Math.min(100, overallHealthScore)),
      healthBreakdown: {
        diversification: diversificationScore,
        riskAdjustedReturn: riskScore,
        rebalanceDrift: rebalanceScore,
        feeEfficiency: feeScore,
        dividendStability: dividendScore,
        liquidityScore
      },
      assetClassWeights: classWeights,
      sectorWeights
    };
  }

  /**
   * Generate actionable rebalancing & tax recommendations
   */
  public static generateRecommendations(
    portfolio: Portfolio,
    metrics: PortfolioMetrics,
    assets: Record<string, Asset>
  ): Recommendation[] {
    const recs: Recommendation[] = [];
    const targets = portfolio.targetAllocations || { stocks: 50, etfs: 25, bonds: 10, commodities: 5, cash: 10, real_estate: 0, crypto: 0 };
    const totalVal = metrics.totalValue;

    // 1. Target Rebalancing
    const trades: RebalanceTrade[] = [];
    (Object.keys(targets) as AssetClass[]).forEach(ac => {
      const currentVal = metrics.assetClassWeights[ac]?.value || 0;
      const targetPct = targets[ac] || 0;
      const targetVal = (totalVal * targetPct) / 100;
      const diffVal = targetVal - currentVal;

      if (Math.abs(diffVal) > totalVal * 0.02) {
        if (diffVal > 0) {
          const defaultSymbol = ac === 'etfs' ? 'NIFTYBEES' : ac === 'bonds' ? 'SGB' : ac === 'commodities' ? 'GOLDBEES' : ac === 'real_estate' ? 'EMBASSY' : 'RELIANCE';
          const asset = assets[defaultSymbol];
          const price = asset ? asset.currentPrice : 100;
          const shares = Math.max(1, Math.round(diffVal / price));
          trades.push({
            symbol: defaultSymbol,
            assetClass: ac,
            action: 'BUY',
            shares,
            estimatedPrice: price,
            estimatedTotal: +(shares * price).toFixed(2),
            currentWeight: metrics.assetClassWeights[ac]?.percent || 0,
            targetWeight: targetPct,
            urgency: Math.abs(diffVal) > totalVal * 0.08 ? 'high' : 'medium',
            rationale: `Target allocation requires adding ₹${diffVal.toLocaleString('en-IN', { maximumFractionDigits: 0 })} to ${ac.toUpperCase()}`
          });
        } else {
          const holding = portfolio.holdings.find(h => h.assetClass === ac);
          if (holding) {
            const price = holding.currentPrice;
            const sharesToSell = Math.min(holding.quantity, Math.max(1, Math.round(Math.abs(diffVal) / price)));
            trades.push({
              symbol: holding.symbol,
              assetClass: ac,
              action: 'SELL',
              shares: sharesToSell,
              estimatedPrice: price,
              estimatedTotal: +(sharesToSell * price).toFixed(2),
              currentWeight: metrics.assetClassWeights[ac]?.percent || 0,
              targetWeight: targetPct,
              urgency: Math.abs(diffVal) > totalVal * 0.08 ? 'high' : 'medium',
              rationale: `Trim overweight ${ac.toUpperCase()} position to lock in gains and eliminate drift`
            });
          }
        }
      }
    });

    if (trades.length > 0) {
      recs.push({
        id: 'rec-rebalance-engine',
        type: 'REBALANCE',
        urgency: 'high',
        title: 'Zero-Drift Target Rebalance',
        description: `Execute ${trades.length} trade order(s) to realign your current allocation with your target model.`,
        impactScore: 92,
        badge: 'Recommended',
        trades,
        rationale: [
          'Eliminates allocation drift across asset classes',
          'Lock in profits from overweighted stocks'
        ]
      });
    }

    // 2. Indian Tax-Loss Harvesting Opportunity
    const lossPositions = portfolio.holdings.filter(h => h.unrealizedPnL < -2000);
    if (lossPositions.length > 0) {
      const topLoss = lossPositions[0];
      const estTaxSavings = +(Math.abs(topLoss.unrealizedPnL) * 0.20).toFixed(0);
      recs.push({
        id: 'rec-tax-loss-india',
        type: 'TAX_LOSS_HARVEST',
        urgency: 'medium',
        title: `Harvest ₹${Math.abs(topLoss.unrealizedPnL).toLocaleString('en-IN')} Loss on ${topLoss.symbol}`,
        description: `Under Section 111A, booking this short-term loss before FY year-end can offset your realized equity gains, saving up to ₹${estTaxSavings} in tax liability.`,
        impactScore: 84,
        badge: 'Tax Optimization',
        actionLabel: `Harvest ${topLoss.symbol} Loss`,
        actionPayload: { type: 'SELL', symbol: topLoss.symbol, quantity: topLoss.quantity },
        metrics: [
          { label: 'Harvestable Loss', value: `₹${Math.abs(topLoss.unrealizedPnL).toLocaleString('en-IN')}`, positive: false },
          { label: 'Estimated Tax Saved (20%)', value: `₹${estTaxSavings}`, positive: true }
        ],
        rationale: [
          'Offsets short-term capital gains under Section 111A',
          'Saves 20% in direct tax outflow'
        ]
      });
    }

    // 3. Indian Dividend Aristocrat Booster
    if (metrics.portfolioYield < 2.0) {
      recs.push({
        id: 'rec-dividend-boost-india',
        type: 'DIVIDEND_BOOSTER',
        urgency: 'low',
        title: 'Enhance Cash Flow with High-Yield Indian Dividend Aristocrats',
        description: 'Your current portfolio yield is 1.15%. Rotating into high-yield champions like ITC (2.80% yield) or Embassy REIT (6.8% yield) increases passive compounding.',
        impactScore: 78,
        badge: 'Cash Flow',
        actionLabel: 'Add ITC / Embassy Position',
        actionPayload: { type: 'BUY', symbol: 'ITC', amount: 50000 },
        metrics: [
          { label: 'Current Yield', value: `${metrics.portfolioYield}%`, positive: false },
          { label: 'Target Yield', value: '2.85%', positive: true }
        ],
        rationale: [
          'Increases quarterly dividend cash payouts',
          'Embassy REIT provides steady rental yields'
        ]
      });
    }

    return recs;
  }

  /**
   * 10-Year Monte Carlo stochastic wealth simulation
   */
  public static runMonteCarloSimulation(
    initialWealth: number,
    monthlySIP: number,
    horizonYears: number = 10,
    beta: number = 1.0,
    divYield: number = 0.015
  ): MonteCarloSimulationResult {
    const annualExpectedReturn = 0.125 + (beta - 1) * 0.03 + divYield;
    const annualVolatility = 0.15 * Math.max(0.8, beta);
    const months = horizonYears * 12;
    const runs = 1000;

    const allTrajectories: number[][] = [];

    for (let r = 0; r < runs; r++) {
      let current = initialWealth;
      const trajectory: number[] = [current];

      for (let m = 1; m <= months; m++) {
        const dt = 1 / 12;
        const u1 = Math.random() || 0.0001;
        const u2 = Math.random() || 0.0001;
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

        const drift = (annualExpectedReturn - 0.5 * annualVolatility * annualVolatility) * dt;
        const diffusion = annualVolatility * Math.sqrt(dt) * z;
        current = current * Math.exp(drift + diffusion) + monthlySIP;
        trajectory.push(Math.max(100, current));
      }
      allTrajectories.push(trajectory);
    }

    const points: MonteCarloSimulationResult['points'] = [];
    for (let y = 0; y <= horizonYears; y++) {
      const monthIdx = y * 12;
      const valuesAtStep = allTrajectories.map(t => t[monthIdx]).sort((a, b) => a - b);
      const p10 = Math.round(valuesAtStep[Math.floor(runs * 0.10)]);
      const p25 = Math.round(valuesAtStep[Math.floor(runs * 0.25)]);
      const p50 = Math.round(valuesAtStep[Math.floor(runs * 0.50)]);
      const p75 = Math.round(valuesAtStep[Math.floor(runs * 0.75)]);
      const p90 = Math.round(valuesAtStep[Math.floor(runs * 0.90)]);
      const contributions = Math.round(initialWealth + monthlySIP * 12 * y);

      points.push({
        year: y,
        p10,
        p25,
        p50,
        p75,
        p90,
        contributions
      });
    }

    const finalValues = allTrajectories.map(t => t[months]);
    const finalConservative = Math.round(points[points.length - 1].p10);
    const finalMedian = Math.round(points[points.length - 1].p50);
    const finalOptimistic = Math.round(points[points.length - 1].p90);
    const totalContributions = Math.round(initialWealth + monthlySIP * months);

    const profitableCount = finalValues.filter(v => v > totalContributions).length;
    const doubledCount = finalValues.filter(v => v > initialWealth * 2).length;

    return {
      points,
      finalConservative,
      finalMedian,
      finalOptimistic,
      totalContributions,
      probabilityOfProfit: Math.round((profitableCount / runs) * 100),
      probabilityOfDoubling: Math.round((doubledCount / runs) * 100)
    };
  }

  /**
   * Indian Macroeconomic Tail-Risk Stress Tests
   */
  public static runStressTests(
    _portfolio: Portfolio,
    metrics: PortfolioMetrics
  ): ScenarioResult[] {
    const totalVal = metrics.totalValue;

    return [
      {
        id: 'stress-rbi-rate-hike',
        title: 'RBI Repo Rate Hike (+75 bps) & Banking Squeeze',
        description: 'RBI implements aggressive monetary tightening to fight food inflation, triggering short-term yield spikes and credit contraction.',
        category: 'Macro',
        projectedReturnPercent: -7.8,
        projectedValue: +(totalVal * 0.922).toFixed(2),
        estimatedLossOrGain: -(totalVal * 0.078),
        maxDrawdown: 11.2,
        recoveryMonths: 4,
        resilienceScore: 82,
        impactsByAssetClass: { stocks: -8.5, etfs: -7.0, bonds: +2.5, commodities: +4.0, cash: 0, real_estate: -5.0, crypto: -12.0 },
        insights: [
          'Banking stocks face net interest margin compression',
          'Sovereign Gold Bonds and Liquid funds outperform'
        ],
        recommendedHedges: ['GOLDBEES', 'LIQUIDBEES', 'SGB']
      },
      {
        id: 'stress-fii-exodus',
        title: 'FII Mega Outflow Wave (₹35,000 Cr Exodus)',
        description: 'US Fed rate expectations drive global funds to liquidate emerging market equities, putting heavy pressure on large-cap Nifty heavyweights.',
        category: 'Market Crisis',
        projectedReturnPercent: -12.4,
        projectedValue: +(totalVal * 0.876).toFixed(2),
        estimatedLossOrGain: -(totalVal * 0.124),
        maxDrawdown: 16.5,
        recoveryMonths: 7,
        resilienceScore: 74,
        impactsByAssetClass: { stocks: -14.2, etfs: -11.8, bonds: +1.5, commodities: +6.2, cash: 0, real_estate: -8.0, crypto: -18.0 },
        insights: [
          'Domestic DII SIP inflows cushion severe downside',
          'Great entry opportunity for long-term systematic averaging'
        ],
        recommendedHedges: ['NIFTYBEES SIP', 'GOLDBEES', 'SGB']
      },
      {
        id: 'stress-budget-tax-shock',
        title: 'Union Budget Capital Gains Tax Revision Shock',
        description: 'Market absorbs sudden adjustments to STCG (20%) and LTCG (12.5%) rates with elevated volatility in momentum mid-caps.',
        category: 'Macro',
        projectedReturnPercent: -5.2,
        projectedValue: +(totalVal * 0.948).toFixed(2),
        estimatedLossOrGain: -(totalVal * 0.052),
        maxDrawdown: 8.4,
        recoveryMonths: 3,
        resilienceScore: 88,
        impactsByAssetClass: { stocks: -6.0, etfs: -4.5, bonds: 0, commodities: +2.0, cash: 0, real_estate: -3.0, crypto: -10.0 },
        insights: [
          'Sovereign Gold Bonds (SGB) gain attraction due to 100% tax-free capital gains at maturity',
          'Tax-loss harvesting mitigates realized gains liability'
        ],
        recommendedHedges: ['Tax-Loss Harvesting', 'SGB (Tax-Free)']
      },
      {
        id: 'stress-rupee-crude-shock',
        title: 'Rupee Depreciation (USD/INR to 88.50) & Brent Crude Spike',
        description: 'Geopolitical energy crisis pushes crude oil to $95/barrel, widening the current account deficit and driving physical gold demand.',
        category: 'Geopolitical',
        projectedReturnPercent: +4.8,
        projectedValue: +(totalVal * 1.048).toFixed(2),
        estimatedLossOrGain: +(totalVal * 0.048),
        maxDrawdown: 6.2,
        recoveryMonths: 2,
        resilienceScore: 91,
        impactsByAssetClass: { stocks: +3.5, etfs: +4.0, bonds: -1.5, commodities: +14.5, cash: 0, real_estate: +2.0, crypto: +8.0 },
        insights: [
          'IT exporters (TCS, Infosys) benefit from dollar appreciation',
          'Gold BeES surges as currency hedge'
        ],
        recommendedHedges: ['GOLDBEES', 'TCS (USD Exporter)', 'INFY']
      }
    ];
  }
}
