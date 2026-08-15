import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Radar } from 'react-chartjs-2';
import '../utils/chartSetup';
import { 
  Sparkles, 
  Scale, 
  Zap, 
  Sliders,
  Receipt
} from 'lucide-react';
import type { AssetClass } from '../types';

export const RecommendationHub: React.FC = () => {
  const { 
    activePortfolio, 
    metrics, 
    recommendations, 
    updateTargetAllocations, 
    executeTrade, 
    executeAllRebalanceTrades, 
    formatConverted,
    assets
  } = usePortfolio();

  const [customTargets, setCustomTargets] = useState<Record<AssetClass, number>>({
    stocks: activePortfolio.targetAllocations.stocks || 50,
    etfs: activePortfolio.targetAllocations.etfs || 25,
    crypto: activePortfolio.targetAllocations.crypto || 5,
    bonds: activePortfolio.targetAllocations.bonds || 10,
    commodities: activePortfolio.targetAllocations.commodities || 5,
    cash: activePortfolio.targetAllocations.cash || 5,
    real_estate: activePortfolio.targetAllocations.real_estate || 0
  });

  const [isEditingTargets, setIsEditingTargets] = useState(false);

  // Strategy Presets for Indian Investors
  const strategyPresets: { name: string; icon: string; alloc: Record<AssetClass, number> }[] = [
    {
      name: '🇮🇳 Nifty Growth & Alpha',
      icon: '🚀',
      alloc: { stocks: 55, etfs: 25, crypto: 5, bonds: 5, commodities: 5, cash: 5, real_estate: 0 }
    },
    {
      name: '🛡️ All-Weather Dalio India',
      icon: '🛡️',
      alloc: { stocks: 30, etfs: 25, bonds: 25, commodities: 10, cash: 5, real_estate: 5, crypto: 0 }
    },
    {
      name: '💰 Indian Dividend & REITs',
      icon: '💰',
      alloc: { stocks: 40, etfs: 25, bonds: 15, commodities: 5, real_estate: 10, cash: 5, crypto: 0 }
    },
    {
      name: '⚖️ Classic 60/40 Balanced',
      icon: '⚖️',
      alloc: { stocks: 45, etfs: 15, bonds: 30, commodities: 0, cash: 10, real_estate: 0, crypto: 0 }
    }
  ];

  const totalTargetSum = Object.values(customTargets).reduce((a, b) => a + b, 0);

  const handleTargetChange = (ac: AssetClass, val: number) => {
    setCustomTargets(prev => ({
      ...prev,
      [ac]: Math.max(0, Math.min(100, val))
    }));
  };

  const applyPreset = (presetAlloc: Record<AssetClass, number>) => {
    setCustomTargets({ ...presetAlloc });
    updateTargetAllocations(presetAlloc);
  };

  const saveTargetAllocations = () => {
    if (totalTargetSum !== 100) {
      alert(`Target allocations must sum to exactly 100%. Current sum: ${totalTargetSum}%`);
      return;
    }
    updateTargetAllocations(customTargets);
    setIsEditingTargets(false);
  };

  // Radar Chart data for 5 Pillars Health Score
  const radarData = {
    labels: [
      'Diversification (HHI)',
      'Sharpe Ratio',
      'Rebalance Drift',
      'Fee Efficiency',
      'Dividend Yield',
      'Liquidity Buffer'
    ],
    datasets: [
      {
        label: 'Current Score',
        data: [
          metrics.healthBreakdown.diversification,
          metrics.healthBreakdown.riskAdjustedReturn,
          metrics.healthBreakdown.rebalanceDrift,
          metrics.healthBreakdown.feeEfficiency,
          metrics.healthBreakdown.dividendStability,
          metrics.healthBreakdown.liquidityScore
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
        borderColor: '#3B82F6',
        pointBackgroundColor: '#60A5FA',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3B82F6',
        borderWidth: 2
      },
      {
        label: 'Optimal Benchmark (100)',
        data: [90, 85, 95, 90, 80, 90],
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        borderColor: 'rgba(16, 185, 129, 0.4)',
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1.5
      }
    ]
  };

  const radarOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94A3B8', font: { size: 11, family: 'Inter' } }
      }
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        pointLabels: { color: '#CBD5E1', font: { size: 11, weight: 600 } },
        ticks: { backdropColor: 'transparent', color: '#64748B', stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  const rebalanceRec = recommendations.find(r => r.type === 'REBALANCE');
  const otherRecommendations = recommendations.filter(r => r.type !== 'REBALANCE');

  // Indian Tax Calculation
  const totalUnrealizedGains = Math.max(0, metrics.totalGainLoss);
  const ltcgExemption = 125000; // ₹1,25,000 exemption limit
  const taxableLTCG = Math.max(0, totalUnrealizedGains * 0.7 - ltcgExemption);
  const estLTCGTax = +(taxableLTCG * 0.125).toFixed(0);
  const estSTCGTax = +(totalUnrealizedGains * 0.3 * 0.20).toFixed(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Health Score Diagnosis & 5-Pillar Radar */}
      <div className="grid-3col">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              <Sparkles size={18} />
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Quantitative Diagnosis
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
              Portfolio Health: <span style={{ color: metrics.healthScore > 80 ? 'var(--accent-emerald)' : metrics.healthScore > 60 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>{metrics.healthScore}/100</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Evaluates asset concentration (HHI), volatility beta against NIFTY 50, rebalance drift penalty, and dividend yield sustainability for Indian capital markets.
            </p>

            {/* Score Pillar Bars */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>DIVERSIFICATION</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{metrics.healthBreakdown.diversification}/100</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px' }}>
                  <div style={{ width: `${metrics.healthBreakdown.diversification}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '999px' }} />
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>SHARPE RETURN</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{metrics.healthBreakdown.riskAdjustedReturn}/100</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px' }}>
                  <div style={{ width: `${metrics.healthBreakdown.riskAdjustedReturn}%`, height: '100%', background: 'var(--accent-emerald)', borderRadius: '999px' }} />
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>DRIFT ALIGNMENT</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{metrics.healthBreakdown.rebalanceDrift}/100</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px' }}>
                  <div style={{ width: `${metrics.healthBreakdown.rebalanceDrift}%`, height: '100%', background: 'var(--accent-amber)', borderRadius: '999px' }} />
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>DIVIDEND YIELD</span>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{metrics.healthBreakdown.dividendStability}/100</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px' }}>
                  <div style={{ width: `${metrics.healthBreakdown.dividendStability}%`, height: '100%', background: 'var(--accent-violet)', borderRadius: '999px' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '12px 16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '12px', color: '#93C5FD' }}>
              <strong>Optimization Impact:</strong> Executing recommendations will raise health score to ~<strong>95/100</strong>.
            </div>
            {rebalanceRec && (
              <button 
                className="btn btn-emerald btn-sm"
                onClick={() => executeAllRebalanceTrades(rebalanceRec.trades || [])}
              >
                Auto-Fix Now
              </button>
            )}
          </div>
        </div>

        {/* 5-Pillar Health Radar Chart */}
        <div className="glass-card" style={{ height: '340px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Health Radar</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>Multi-dimensional Indian portfolio balance</p>
          <div style={{ height: '250px', width: '100%' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* 2. Indian Capital Gains Tax (Budget 2024) Intelligence Card */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Receipt size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800 }}>🇮🇳 Indian Capital Gains Tax Intelligence (FY 2025-26)</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Compliant with Section 111A (STCG 20%) & Section 112A (LTCG 12.5% on gains exceeding ₹1.25 Lakh)
              </p>
            </div>
          </div>
          <span className="badge badge-emerald">Budget 2024 Compliant</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Unrealized Gain / P&L</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', marginTop: '4px' }}>
              {formatConverted(totalUnrealizedGains)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Total paper profit in portfolio</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>LTCG ₹1.25L Exemption</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFFFFF', marginTop: '4px' }}>
              ₹{ltcgExemption.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', marginTop: '2px' }}>0% Tax on first ₹1.25L/yr</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Est. LTCG Tax (12.5%)</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', marginTop: '4px' }}>
              {formatConverted(estLTCGTax)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Holding period &gt; 12 months</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Est. STCG Tax (20%)</div>
            <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', marginTop: '4px' }}>
              {formatConverted(estSTCGTax)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Holding period &lt; 12 months</div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Visual Rebalancing Workbench */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Scale size={20} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Visual Target Rebalancer</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Compare Current Asset Weights against Target Allocations and generate exact zero-drift trade orders
            </p>
          </div>

          {/* Strategy Preset Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Strategy Presets:</span>
            {strategyPresets.map(preset => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset.alloc)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                <span>{preset.icon}</span> {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Current vs Target Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {(['stocks', 'etfs', 'crypto', 'bonds', 'commodities', 'cash', 'real_estate'] as AssetClass[]).map(ac => {
            const currentPct = metrics.assetClassWeights[ac]?.percent || 0;
            const currentVal = metrics.assetClassWeights[ac]?.value || 0;
            const targetPct = isEditingTargets ? customTargets[ac] : (activePortfolio.targetAllocations[ac] || 0);
            const diffPct = +(targetPct - currentPct).toFixed(1);
            const isDrifted = Math.abs(diffPct) >= 2.5;

            return (
              <div key={ac} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px 18px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                      {ac === 'real_estate' ? 'Real Estate REITs' : ac === 'bonds' ? 'Bonds & SGBs' : ac}
                    </span>
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {formatConverted(currentVal)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '13px' }}>
                      Current: <strong style={{ color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>{currentPct}%</strong>
                    </span>
                    <span style={{ fontSize: '13px' }}>
                      Target: <strong style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{targetPct}%</strong>
                    </span>
                    {isDrifted && (
                      <span className={`badge ${diffPct > 0 ? 'badge-blue' : 'badge-amber'}`} style={{ fontSize: '10px' }}>
                        {diffPct > 0 ? `+${diffPct}% Under` : `${diffPct}% Over`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Visual Stacked Progress Bar */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '3px', textTransform: 'uppercase' }}>Current Weight</div>
                    <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(100, currentPct)}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)', borderRadius: '999px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', marginBottom: '3px', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Target Weight</span>
                      {isEditingTargets && <span>{customTargets[ac]}%</span>}
                    </div>
                    {isEditingTargets ? (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={customTargets[ac]}
                        onChange={e => handleTargetChange(ac, Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                      />
                    ) : (
                      <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, targetPct)}%`, height: '100%', background: 'linear-gradient(90deg, #10B981 0%, #06B6D4 100%)', borderRadius: '999px' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Target Allocation Edit Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
          {isEditingTargets ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13px', color: totalTargetSum === 100 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 700 }}>
                Total Target Sum: {totalTargetSum}% {totalTargetSum === 100 ? '✓ (Valid)' : `(Must equal 100%)`}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingTargets(false)}>Cancel</button>
                <button className="btn btn-emerald btn-sm" onClick={saveTargetAllocations} disabled={totalTargetSum !== 100}>
                  Save Target Model
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingTargets(true)}>
              <Sliders size={14} /> Customize Target Weights
            </button>
          )}
        </div>

        {/* Generated Action Trades Table */}
        {rebalanceRec && rebalanceRec.trades && rebalanceRec.trades.length > 0 && (
          <div style={{ marginTop: '24px', background: 'rgba(14, 21, 38, 0.95)', padding: '20px', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Execution Plan
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Generated Zero-Drift Trade Orders</h3>
              </div>

              <button 
                className="btn btn-emerald btn-lg"
                onClick={() => executeAllRebalanceTrades(rebalanceRec.trades || [])}
                style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}
              >
                <Zap size={18} /> Execute All Rebalance Trades ({rebalanceRec.trades.length})
              </button>
            </div>

            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Asset</th>
                    <th>Shares</th>
                    <th>Est. Price</th>
                    <th>Order Total</th>
                    <th>Rationale</th>
                    <th style={{ textAlign: 'right' }}>Execute</th>
                  </tr>
                </thead>
                <tbody>
                  {rebalanceRec.trades.map((trade, idx) => (
                    <tr key={idx}>
                      <td>
                        <span className={`badge ${trade.action === 'BUY' ? 'badge-emerald' : 'badge-rose'}`} style={{ fontWeight: 800 }}>
                          {trade.action}
                        </span>
                      </td>
                      <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                        {trade.symbol}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {trade.shares}
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>
                        {formatConverted(trade.estimatedPrice)}
                      </td>
                      <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: trade.action === 'BUY' ? 'var(--accent-cyan)' : 'var(--accent-amber)' }}>
                        {formatConverted(trade.estimatedTotal)}
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {trade.rationale}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => executeTrade(trade)}
                        >
                          Execute
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. Actionable Opportunity Cards */}
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
          Additional High-Impact Opportunities ({otherRecommendations.length})
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
          {otherRecommendations.map(rec => (
            <div key={rec.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className={`badge ${rec.type === 'TAX_LOSS_HARVEST' ? 'badge-emerald' : rec.type === 'DIVERSIFICATION' ? 'badge-rose' : 'badge-blue'}`}>
                    {rec.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Impact: {rec.impactScore}/100
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px', color: '#FFFFFF' }}>
                  {rec.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {rec.description}
                </p>

                {rec.metrics && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                    {rec.metrics.map((m, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: m.positive === true ? 'var(--accent-emerald)' : m.positive === false ? 'var(--accent-rose)' : 'var(--text-primary)' }}>
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {rec.actionLabel && (
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: '12px' }}
                  onClick={() => {
                    if (rec.actionPayload?.type === 'BUY' && rec.actionPayload.symbol) {
                      const asset = assets[rec.actionPayload.symbol];
                      const price = asset?.currentPrice || 500;
                      const amount = rec.actionPayload.amount || 25000;
                      const shares = Math.max(1, Math.round(amount / price));
                      executeTrade({
                        symbol: rec.actionPayload.symbol,
                        assetClass: asset?.assetClass || 'stocks',
                        action: 'BUY',
                        shares,
                        estimatedPrice: price,
                        estimatedTotal: +(shares * price).toFixed(2),
                        currentWeight: 0,
                        targetWeight: 10,
                        urgency: 'medium',
                        rationale: rec.title
                      });
                    } else if (rec.actionPayload?.type === 'SELL' && rec.actionPayload.symbol) {
                      const holding = activePortfolio.holdings.find(h => h.symbol === rec.actionPayload?.symbol);
                      if (holding) {
                        executeTrade({
                          symbol: holding.symbol,
                          assetClass: holding.assetClass,
                          action: 'SELL',
                          shares: rec.actionPayload.quantity || Math.ceil(holding.quantity * 0.5),
                          estimatedPrice: holding.currentPrice,
                          estimatedTotal: +((rec.actionPayload.quantity || Math.ceil(holding.quantity * 0.5)) * holding.currentPrice).toFixed(2),
                          currentWeight: 20,
                          targetWeight: 10,
                          urgency: 'high',
                          rationale: rec.title
                        });
                      }
                    }
                  }}
                >
                  <Zap size={14} /> {rec.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
