import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Line } from 'react-chartjs-2';
import '../../utils/chartSetup';
import { X, TrendingUp, TrendingDown, Plus } from 'lucide-react';

interface AssetDetailModalProps {
  symbol: string | null;
  onClose: () => void;
  onOpenTrade: (symbol: string) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  symbol,
  onClose,
  onOpenTrade
}) => {
  const { assets, activePortfolio, formatConverted } = usePortfolio();

  if (!symbol) return null;

  const asset = assets[symbol];
  if (!asset) return null;

  const userHolding = activePortfolio.holdings.find(h => h.symbol === symbol);

  const isPositive = asset.change24hPercent >= 0;

  // Chart
  const chartData = {
    labels: ['1D ago', '6D ago', '5D ago', '4D ago', '3D ago', 'Yesterday', 'Live'],
    datasets: [
      {
        label: `${asset.symbol} Price`,
        data: asset.sparkline,
        borderColor: isPositive ? '#10B981' : '#F43F5E',
        backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: isPositive ? '#10B981' : '#F43F5E'
      }
    ]
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => ` Price: ${formatConverted(context.parsed.y)}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748B', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.04)' }, ticks: { color: '#64748B', font: { size: 10 } } }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 42, height: 42, borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
              {asset.symbol.slice(0, 3)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{asset.symbol}</h3>
                <span className="badge badge-blue">{asset.assetClass}</span>
                <span className="badge badge-violet">{asset.sector}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{asset.name}</div>
            </div>
          </div>

          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Live Price & Change */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
            {formatConverted(asset.currentPrice)}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositive ? '+' : ''}{asset.change24hPercent}% ({isPositive ? '+' : ''}{formatConverted(asset.change24h)})
          </div>
        </div>

        {/* Historical Mini Chart */}
        <div style={{ height: '180px', width: '100%', marginBottom: '20px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-md)', padding: '10px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Asset Fundamental Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>52-Week Range</div>
            <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              ${asset.low52w} - ${asset.high52w}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Dividend Yield</div>
            <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', marginTop: '2px' }}>
              {(asset.dividendYield * 100).toFixed(2)}%
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Volatility Beta</div>
            <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '2px' }}>
              {asset.beta}
            </div>
          </div>
        </div>

        {/* User Holding Snapshot if owned */}
        {userHolding ? (
          <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '14px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(59, 130, 246, 0.25)', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Your Position in {activePortfolio.name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Owned</div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>{userHolding.quantity} units</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Avg Cost</div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>{formatConverted(userHolding.avgBuyPrice)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Total Value</div>
                <div style={{ fontWeight: 700, fontSize: '13px' }}>{formatConverted(userHolding.currentValue)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Unrealized P&L</div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: userHolding.unrealizedPnL >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {userHolding.unrealizedPnL >= 0 ? '+' : ''}{userHolding.unrealizedPnLPercent.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            You do not currently hold any shares of {asset.symbol} in this portfolio.
          </div>
        )}

        {/* Trade Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-emerald"
            onClick={() => {
              onClose();
              onOpenTrade(asset.symbol);
            }}
          >
            <Plus size={16} /> Trade / Buy {asset.symbol}
          </button>
        </div>
      </div>
    </div>
  );
};
