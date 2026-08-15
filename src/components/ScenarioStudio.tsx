import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Line, Scatter } from 'react-chartjs-2';
import '../utils/chartSetup';
import { AdvisorEngine } from '../services/advisorEngine';
import { 
  Compass, 
  ShieldAlert
} from 'lucide-react';

export const ScenarioStudio: React.FC = () => {
  const { activePortfolio, metrics, formatConverted } = usePortfolio();

  // Monte Carlo parameters
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [timeHorizonYears, setTimeHorizonYears] = useState<number>(10);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('stress-2008-crash');

  // Run Monte Carlo
  const mcResult = useMemo(() => {
    return AdvisorEngine.runMonteCarloSimulation(
      metrics.totalValue,
      monthlyContribution,
      timeHorizonYears,
      metrics.beta,
      metrics.portfolioYield / 100
    );
  }, [metrics.totalValue, monthlyContribution, timeHorizonYears, metrics.beta, metrics.portfolioYield]);

  // Run Stress Tests
  const stressScenarios = useMemo(() => {
    return AdvisorEngine.runStressTests(activePortfolio, metrics);
  }, [activePortfolio, metrics]);

  const activeScenario = stressScenarios.find(s => s.id === selectedScenarioId) || stressScenarios[0];

  // Monte Carlo Chart Data
  const mcChartData = {
    labels: mcResult.points.map(p => `Year ${p.year}`),
    datasets: [
      {
        label: 'Optimistic (90th Percentile)',
        data: mcResult.points.map(p => p.p90),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: '+1',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 2
      },
      {
        label: 'Median Expected (50th Percentile)',
        data: mcResult.points.map(p => p.p50),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: '+1',
        tension: 0.3,
        borderWidth: 3,
        pointRadius: 3
      },
      {
        label: 'Conservative (10th Percentile)',
        data: mcResult.points.map(p => p.p10),
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        fill: false,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 2
      },
      {
        label: 'Total Capital Contributed',
        data: mcResult.points.map(p => p.contributions),
        borderColor: '#64748B',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        fill: false,
        borderWidth: 1.5,
        pointRadius: 0
      }
    ]
  };

  const mcChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94A3B8', font: { size: 12, family: 'Inter' }, usePointStyle: true, boxWidth: 8 }
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

  // Efficient Frontier Scatter Plot Data
  const scatterData = {
    datasets: [
      {
        label: 'Optimal Efficient Frontier',
        data: [
          { x: 6, y: 5.2 },
          { x: 9, y: 7.8 },
          { x: 12, y: 10.1 },
          { x: 16, y: 12.4 },
          { x: 20, y: 14.1 },
          { x: 25, y: 15.6 }
        ],
        showLine: true,
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4
      },
      {
        label: 'Your Current Portfolio',
        data: [{ x: metrics.volatility, y: +(4.2 + metrics.beta * 6.2).toFixed(1) }],
        backgroundColor: '#EC4899',
        borderColor: '#FFFFFF',
        pointRadius: 9,
        pointHoverRadius: 11
      }
    ]
  };

  const scatterOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94A3B8', font: { size: 11 } }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` Volatility: ${context.parsed.x}% | Expected Return: ${context.parsed.y}%`
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Annual Volatility / Risk (%)', color: '#64748B', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748B' }
      },
      y: {
        title: { display: true, text: 'Expected Return (%)', color: '#64748B', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#64748B' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Monte Carlo Wealth Trajectory Forecaster */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={20} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 800 }}>10-Year Monte Carlo Wealth Forecast</h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              1,000-run stochastic simulation modeling geometric Brownian motion across compound market cycles
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-emerald">
              Probability of Growth: {mcResult.probabilityOfProfit}%
            </span>
            <span className="badge badge-blue">
              Probability of 2x: {mcResult.probabilityOfDoubling}%
            </span>
          </div>
        </div>

        {/* Sliders for Monthly Contribution and Horizon */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', background: 'rgba(255, 255, 255, 0.02)', padding: '16px 20px', borderRadius: 'var(--radius-lg)', marginBottom: '20px', border: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Monthly Contribution</span>
              <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                ${monthlyContribution.toLocaleString()}/mo
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={monthlyContribution}
              onChange={e => setMonthlyContribution(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Simulation Horizon</span>
              <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                {timeHorizonYears} Years
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="30"
              step="1"
              value={timeHorizonYears}
              onChange={e => setTimeHorizonYears(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-emerald)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Monte Carlo Fan Chart */}
        <div style={{ height: '320px', width: '100%', marginBottom: '20px' }}>
          <Line data={mcChartData} options={mcChartOptions} />
        </div>

        {/* Projected Milestone Outcome Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: 700, textTransform: 'uppercase' }}>Conservative (10th %)</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFFFFF', marginTop: '4px' }}>
              {formatConverted(mcResult.finalConservative)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Tough market conditions</div>
          </div>

          <div style={{ background: 'rgba(59, 130, 246, 0.12)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>Expected Median (50th %)</div>
            <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFFFFF', marginTop: '4px' }}>
              {formatConverted(mcResult.finalMedian)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Historical market trend</div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 700, textTransform: 'uppercase' }}>Optimistic (90th %)</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFFFFF', marginTop: '4px' }}>
              {formatConverted(mcResult.finalOptimistic)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Strong secular bull market</div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Contributed</div>
            <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {formatConverted(mcResult.totalContributions)}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Principal capital invested</div>
          </div>
        </div>
      </div>

      {/* 2. Macroeconomic Stress-Test Simulator & Efficient Frontier */}
      <div className="grid-3col">
        {/* Stress-Test Selector & Impact Analyzer */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ShieldAlert size={18} style={{ color: 'var(--accent-amber)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Macroeconomic Stress-Testing Lab</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Simulate historical tail-risk black swan events and analyze portfolio resilience
          </p>

          {/* Scenario Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
            {stressScenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenarioId(sc.id)}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedScenarioId === sc.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: selectedScenarioId === sc.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  color: selectedScenarioId === sc.id ? '#FFFFFF' : 'var(--text-secondary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>{sc.category}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '2px' }}>{sc.title}</div>
              </button>
            ))}
          </div>

          {/* Active Scenario Impact Breakdown */}
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '16px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800 }}>{activeScenario.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{activeScenario.description}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: activeScenario.projectedReturnPercent >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {activeScenario.projectedReturnPercent >= 0 ? '+' : ''}{activeScenario.projectedReturnPercent}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {activeScenario.estimatedLossOrGain >= 0 ? '+' : ''}{formatConverted(activeScenario.estimatedLossOrGain)}
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max Drawdown</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>-{activeScenario.maxDrawdown}%</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Recovery</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{activeScenario.recoveryMonths} Months</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resilience Score</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{activeScenario.resilienceScore}/100</div>
              </div>
            </div>

            {/* AI Insights & Recommended Hedges */}
            <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Recommended Mitigations & Hedges:
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {activeScenario.recommendedHedges.map(h => (
                  <span key={h} className="badge badge-blue">{h}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modern Portfolio Theory Efficient Frontier Curve */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Efficient Frontier Risk Curve</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sharpe ratio optimization boundary</p>
          </div>

          <div style={{ flex: 1, minHeight: '260px', marginTop: '12px' }}>
            <Scatter data={scatterData} options={scatterOptions} />
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', marginTop: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            💡 Your portfolio (Pink dot) achieves an estimated annual return of <strong>{(4.2 + metrics.beta * 6.2).toFixed(1)}%</strong> at <strong>{metrics.volatility}%</strong> annual volatility.
          </div>
        </div>
      </div>
    </div>
  );
};
