import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Line, Doughnut } from 'react-chartjs-2';
import '../utils/chartSetup';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import type { AssetClass } from '../types';

export const PortfolioOverview: React.FC = () => {
  const { 
    activePortfolio, 
    metrics, 
    recommendations, 
    formatConverted, 
    setActiveTab, 
    executeTrade 
  } = usePortfolio();

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1M');
  const [showBenchmark, setShowBenchmark] = useState<boolean>(true);

  // Colors for asset classes
  const assetClassColors: Record<AssetClass, string> = {
    stocks: '#3B82F6',
    crypto: '#8B5CF6',
    etfs: '#06B6D4',
    bonds: '#10B981',
    commodities: '#F59E0B',
    cash: '#64748B',
    real_estate: '#EC4899'
  };

  // Generate historical curve based on timeframe
  const generateHistoryData = () => {
    let points = 20;
    let labels: string[] = [];
    const baseVal = metrics.totalCost || 40000;
    const currentVal = metrics.totalValue;

    if (timeframe === '1D') {
      labels = ['9:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '1:30 PM', '2:30 PM', '3:30 PM', '4:00 PM'];
      points = labels.length;
    } else if (timeframe === '1W') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      points = labels.length;
    } else if (timeframe === '1M') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Today'];
      points = labels.length;
    } else if (timeframe === '1Y') {
      labels = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Today'];
      points = labels.length;
    } else {
      labels = ['2023 Q1', '2023 Q3', '2024 Q1', '2024 Q3', '2025 Q1', '2025 Q3', 'Today'];
      points = labels.length;
    }

    const curve: number[] = [];
    const benchmarkCurve: number[] = [];

    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const randomNoise = (Math.sin(i * 1.5) * 0.03 + (Math.random() - 0.5) * 0.015);
      const val = baseVal + (currentVal - baseVal) * Math.pow(progress, 0.9) * (1 + randomNoise);
      curve.push(Math.round(val));

      // S&P 500 benchmark (+14% annualized baseline)
      const benchVal = baseVal * (1 + progress * 0.14 + (Math.sin(i * 1.2) * 0.02));
      benchmarkCurve.push(Math.round(benchVal));
    }
    curve[curve.length - 1] = Math.round(currentVal);

    return { labels, curve, benchmarkCurve };
  };

  const { labels, curve, benchmarkCurve } = generateHistoryData();

  // Performance Chart Data
  const lineChartData = {
    labels,
    datasets: [
      {
        label: `${activePortfolio.name}`,
        data: curve,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.12)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3B82F6'
      },
      ...(showBenchmark ? [{
        label: 'S&P 500 Benchmark (SPY)',
        data: benchmarkCurve,
        borderColor: '#94A3B8',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.35,
        borderWidth: 1.8,
        pointRadius: 0
      }] : [])
    ]
  };

  const lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#94A3B8', font: { size: 12, family: 'Inter' }, usePointStyle: true, boxWidth: 6 }
      },
      tooltip: {
        backgroundColor: 'rgba(14, 21, 38, 0.95)',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${formatConverted(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748B', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { 
          color: '#64748B', 
          font: { size: 11 },
          callback: (val: any) => `$${(val / 1000).toFixed(0)}k`
        }
      }
    }
  };

  // Asset Class Allocation Doughnut
  const activeAssetClasses = (Object.keys(metrics.assetClassWeights) as AssetClass[])
    .filter(ac => (metrics.assetClassWeights[ac]?.value || 0) > 0);

  const doughnutData = {
    labels: activeAssetClasses.map(ac => ac.toUpperCase()),
    datasets: [
      {
        data: activeAssetClasses.map(ac => metrics.assetClassWeights[ac].value),
        backgroundColor: activeAssetClasses.map(ac => assetClassColors[ac]),
        borderColor: '#0E1526',
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94A3B8', font: { size: 11, family: 'Inter' }, boxWidth: 8, padding: 12 }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed;
            const pct = ((val / metrics.totalValue) * 100).toFixed(1);
            return ` ${context.label}: ${formatConverted(val)} (${pct}%)`;
          }
        }
      }
    },
    cutout: '72%'
  };

  // Sorted holdings for top performers and losers
  const sortedByPnL = [...activePortfolio.holdings].sort((a, b) => b.unrealizedPnLPercent - a.unrealizedPnLPercent);
  const topGainer = sortedByPnL[0];
  const topLoser = sortedByPnL[sortedByPnL.length - 1];

  const primaryRecommendation = recommendations[0];

  return (
    <div>
      {/* 1. Top Metrics Cards Grid */}
      <div className="grid-metrics">
        {/* Card 1: Total Portfolio Value */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Net Worth
            </span>
            <span className={`badge ${metrics.totalGainLoss >= 0 ? 'badge-emerald' : 'badge-rose'}`}>
              {metrics.totalGainLoss >= 0 ? '+' : ''}{metrics.totalGainLossPercent.toFixed(2)}% All-Time
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {formatConverted(metrics.totalValue)}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Total Gain:</span>
            <span className={metrics.totalGainLoss >= 0 ? 'val-positive' : 'val-negative'} style={{ fontWeight: 700 }}>
              {metrics.totalGainLoss >= 0 ? '+' : ''}{formatConverted(metrics.totalGainLoss)}
            </span>
          </div>
        </div>

        {/* Card 2: 24h Daily P&L */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Today's Change (24h)
            </span>
            <div style={{ width: 28, height: 28, borderRadius: '8px', background: metrics.dayGainLoss >= 0 ? 'var(--accent-emerald-bg)' : 'var(--accent-rose-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: metrics.dayGainLoss >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              {metrics.dayGainLoss >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: metrics.dayGainLoss >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', marginBottom: '6px' }}>
            {metrics.dayGainLoss >= 0 ? '+' : ''}{formatConverted(metrics.dayGainLoss)}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span>Daily Return: </span>
            <span style={{ fontWeight: 700, color: metrics.dayGainLoss >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              {metrics.dayGainLoss >= 0 ? '+' : ''}{metrics.dayGainLossPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Card 3: Passive Dividend Yield */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Annual Dividend Income
            </span>
            <span className="badge badge-blue">
              {metrics.portfolioYield.toFixed(2)}% Yield
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {formatConverted(metrics.annualDividendIncome)}
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>/yr</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            <span>Monthly Avg: </span>
            <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
              {formatConverted(metrics.annualDividendIncome / 12)}/mo
            </span>
          </div>
        </div>

        {/* Card 4: Health Score & Risk Gauge */}
        <div 
          className="glass-card interactive" 
          onClick={() => setActiveTab('recommendations')}
          style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.15) 100%)', borderColor: 'rgba(99, 102, 241, 0.3)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#C4B5FD', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} /> Health Score
            </span>
            <span style={{ fontSize: '11px', color: '#93C5FD', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              Optimize <ChevronRight size={14} />
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: metrics.healthScore > 80 ? 'var(--accent-emerald)' : metrics.healthScore > 60 ? 'var(--accent-amber)' : 'var(--accent-rose)' }}>
              {metrics.healthScore}
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</div>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Beta: <strong style={{ color: '#F8FAFC' }}>{metrics.beta}</strong> • Sharpe: <strong style={{ color: '#F8FAFC' }}>{metrics.sharpeRatio}</strong> • {recommendations.length} Fixes
          </div>
        </div>
      </div>

      {/* 2. Main Visual Charts Row */}
      <div className="grid-3col">
        {/* Net Worth Growth Chart */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Performance Trajectory</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Historical portfolio growth with benchmark comparison</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Benchmark Toggle */}
              <button
                onClick={() => setShowBenchmark(!showBenchmark)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: showBenchmark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: showBenchmark ? 'var(--accent-primary)' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                SPY S&P 500 Overlay
              </button>

              {/* Timeframe Buttons */}
              <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', padding: '2px', border: '1px solid var(--border-subtle)' }}>
                {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: 'none',
                      background: timeframe === tf ? 'var(--accent-primary)' : 'transparent',
                      color: timeframe === tf ? '#FFFFFF' : 'var(--text-muted)',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: '280px', width: '100%' }}>
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Asset Class Allocation Donut */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Asset Class Allocation</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Target vs current distribution</p>
          </div>

          <div style={{ flex: 1, minHeight: '200px', position: 'relative' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cash Balance</div>
              <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatConverted(activePortfolio.cashBalance)}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Holdings</div>
              <div style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{activePortfolio.holdings.length} Assets</div>
            </div>
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => setActiveTab('recommendations')}
              style={{ color: 'var(--accent-primary)' }}
            >
              Rebalance <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Secondary Row: Sector Exposure + Urgent Recommendations + Top Movers */}
      <div className="grid-3col">
        {/* Sector Exposure Bar breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Sector Diversification</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Risk exposure across industry sectors</p>
            </div>
            <span className={`badge ${metrics.healthBreakdown.diversification > 75 ? 'badge-emerald' : 'badge-amber'}`}>
              Diversification: {metrics.healthBreakdown.diversification}/100
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.keys(metrics.sectorWeights).map(sector => {
              const weight = metrics.sectorWeights[sector];
              const isOverconcentrated = weight.percent > 30;

              return (
                <div key={sector}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sector}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: isOverconcentrated ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
                      {formatConverted(weight.value)} ({weight.percent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${Math.min(100, weight.percent)}%`, 
                        height: '100%', 
                        background: isOverconcentrated 
                          ? 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' 
                          : 'linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)',
                        borderRadius: '999px' 
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Urgent AI Recommendation Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(180deg, rgba(20, 32, 58, 0.9) 0%, rgba(13, 20, 36, 0.9) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
            <Sparkles size={16} />
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Advisor Action Item</span>
          </div>

          {primaryRecommendation ? (
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                {primaryRecommendation.title}
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {primaryRecommendation.description}
              </p>

              {primaryRecommendation.trades && primaryRecommendation.trades.length > 0 && (
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Suggested Trade:</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>{primaryRecommendation.trades[0].action} {primaryRecommendation.trades[0].shares} {primaryRecommendation.trades[0].symbol}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>~${primaryRecommendation.trades[0].estimatedTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => {
                  if (primaryRecommendation.type === 'REBALANCE') {
                    setActiveTab('recommendations');
                  } else if (primaryRecommendation.trades && primaryRecommendation.trades.length > 0) {
                    executeTrade(primaryRecommendation.trades[0]);
                  } else {
                    setActiveTab('recommendations');
                  }
                }}
              >
                <Zap size={14} /> {primaryRecommendation.actionLabel || 'Inspect Recommendation'}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
              <ShieldCheck size={36} style={{ color: 'var(--accent-emerald)', margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Portfolio in Prime Shape!</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>No urgent rebalancing triggers detected.</div>
            </div>
          )}

          {/* Quick Gainers & Losers */}
          <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '10px' }}>
              Performance Leaders
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {topGainer && (
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--accent-emerald)', fontWeight: 700 }}>TOP GAINER</div>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>{topGainer.symbol}</div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 700 }}>+{topGainer.unrealizedPnLPercent.toFixed(1)}%</div>
                </div>
              )}
              {topLoser && (
                <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--accent-rose)', fontWeight: 700 }}>LAGGING</div>
                  <div style={{ fontWeight: 800, fontSize: '13px' }}>{topLoser.symbol}</div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-rose)', fontWeight: 700 }}>{topLoser.unrealizedPnLPercent.toFixed(1)}%</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
