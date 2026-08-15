import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import type { AssetClass } from '../types';
import { 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Trash2, 
  Layers, 
  History, 
  ArrowUpRight
} from 'lucide-react';

interface HoldingsTableProps {
  onOpenAddModal: (initialSymbol?: string) => void;
  onSelectAssetDetail: (symbol: string) => void;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  onOpenAddModal,
  onSelectAssetDetail
}) => {
  const { 
    activePortfolio, 
    formatConverted, 
    metrics, 
    deleteTransaction
  } = usePortfolio();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedClass, setSelectedClass] = useState<AssetClass | 'ALL'>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'holdings' | 'transactions'>('holdings');
  const [expandedHoldingId, setExpandedHoldingId] = useState<string | null>(null);

  const assetClasses: (AssetClass | 'ALL')[] = [
    'ALL',
    'stocks',
    'crypto',
    'etfs',
    'bonds',
    'commodities',
    'real_estate'
  ];

  const filteredHoldings = activePortfolio.holdings.filter(h => {
    const matchesSearch = h.symbol.toLowerCase().includes(searchFilter.toLowerCase()) || 
                          h.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          h.sector.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesClass = selectedClass === 'ALL' || h.assetClass === selectedClass;
    return matchesSearch && matchesClass;
  });

  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke={isPositive ? '#10B981' : '#F43F5E'}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords}
        />
      </svg>
    );
  };

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      {/* Header with Search and Sub-tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('holdings')}
            className="btn"
            style={{
              background: activeSubTab === 'holdings' ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.04)',
              color: activeSubTab === 'holdings' ? '#FFFFFF' : 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <Layers size={15} /> Active Holdings ({activePortfolio.holdings.length})
          </button>
          <button
            onClick={() => setActiveSubTab('transactions')}
            className="btn"
            style={{
              background: activeSubTab === 'transactions' ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.04)',
              color: activeSubTab === 'transactions' ? '#FFFFFF' : 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <History size={15} /> Transaction Ledger ({activePortfolio.transactions.length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search ticker, name..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '32px', fontSize: '12px', height: '36px' }}
            />
          </div>

          <button 
            className="btn btn-emerald btn-sm"
            onClick={() => onOpenAddModal()}
          >
            <Plus size={14} /> Add Transaction
          </button>
        </div>
      </div>

      {activeSubTab === 'holdings' ? (
        <div>
          {/* Asset Class Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
            {assetClasses.map(ac => (
              <button
                key={ac}
                onClick={() => setSelectedClass(ac)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: '1px solid',
                  borderColor: selectedClass === ac ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  background: selectedClass === ac ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  color: selectedClass === ac ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {ac === 'ALL' ? 'All Classes' : ac}
              </button>
            ))}
          </div>

          {/* Holdings Data Table */}
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Class</th>
                  <th>Price (24h)</th>
                  <th>Quantity / Avg Cost</th>
                  <th>Total Value</th>
                  <th>Allocation</th>
                  <th>Unrealized P&L</th>
                  <th>Trend (7D)</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHoldings.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No assets found matching your criteria. Click "+ Add Transaction" to buy assets.
                    </td>
                  </tr>
                ) : (
                  filteredHoldings.map(h => {
                    const isExpanded = expandedHoldingId === h.id;
                    const isPnLPositive = h.unrealizedPnL >= 0;
                    const allocationPct = metrics.totalValue > 0 ? ((h.currentValue / metrics.totalValue) * 100).toFixed(1) : '0';

                    return (
                      <React.Fragment key={h.id}>
                        <tr>
                          {/* Asset Name & Logo */}
                          <td>
                            <div 
                              onClick={() => onSelectAssetDetail(h.symbol)}
                              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                            >
                              <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                                {h.symbol.slice(0, 3)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {h.symbol}
                                  <ArrowUpRight size={12} style={{ color: 'var(--text-muted)' }} />
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.name}</div>
                              </div>
                            </div>
                          </td>

                          {/* Asset Class */}
                          <td>
                            <span className="badge badge-blue" style={{ fontSize: '10px' }}>
                              {h.assetClass}
                            </span>
                          </td>

                          {/* Live Price & 24h Change */}
                          <td>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px' }}>
                              {formatConverted(h.currentPrice)}
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', color: h.change24hPercent >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                              {h.change24hPercent >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                              {h.change24hPercent >= 0 ? '+' : ''}{h.change24hPercent}%
                            </div>
                          </td>

                          {/* Quantity & Avg Buy Price */}
                          <td>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                              {h.quantity} units
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              Avg: {formatConverted(h.avgBuyPrice)}
                            </div>
                          </td>

                          {/* Total Value */}
                          <td>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '14px' }}>
                              {formatConverted(h.currentValue)}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              Cost: {formatConverted(h.totalCost)}
                            </div>
                          </td>

                          {/* Allocation % */}
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{allocationPct}%</span>
                              <div style={{ width: '40px', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ width: `${Math.min(100, Number(allocationPct) * 2.5)}%`, height: '100%', background: 'var(--accent-primary)' }} />
                              </div>
                            </div>
                          </td>

                          {/* Unrealized P&L */}
                          <td>
                            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: isPnLPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                              {isPnLPositive ? '+' : ''}{formatConverted(h.unrealizedPnL)}
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: isPnLPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                              {isPnLPositive ? '+' : ''}{h.unrealizedPnLPercent.toFixed(2)}%
                            </div>
                          </td>

                          {/* Mini Sparkline */}
                          <td>
                            {renderSparkline(h.sparkline, isPnLPositive)}
                          </td>

                          {/* Actions */}
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => onOpenAddModal(h.symbol)}
                                title="Trade / Buy More"
                              >
                                Trade
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => setExpandedHoldingId(isExpanded ? null : h.id)}
                                title="View Tax Lots"
                              >
                                Lots ({h.lots?.length || 1})
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Tax Lots Accordion Row */}
                        {isExpanded && (
                          <tr style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                            <td colSpan={9} style={{ padding: '12px 24px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
                                Tax Lot Breakdown for {h.symbol}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                                {(h.lots || []).map(lot => (
                                  <div key={lot.id} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                                      <span>Date: {lot.date}</span>
                                      <span>{lot.quantity} shares</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px', fontWeight: 600 }}>
                                      <span>Cost: ${lot.buyPrice}</span>
                                      <span style={{ color: lot.unrealizedPnL >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                                        {lot.unrealizedPnL >= 0 ? '+' : ''}${lot.unrealizedPnL.toFixed(1)} ({lot.unrealizedPnLPercent.toFixed(1)}%)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Transaction Ledger Sub-Tab */
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Asset</th>
                <th>Shares / Units</th>
                <th>Execution Price</th>
                <th>Fee</th>
                <th>Total Value</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {activePortfolio.transactions.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No recorded transactions yet.
                  </td>
                </tr>
              ) : (
                activePortfolio.transactions.map(tx => (
                  <tr key={tx.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {tx.date}
                    </td>
                    <td>
                      <span className={`badge ${tx.type === 'BUY' ? 'badge-emerald' : tx.type === 'SELL' ? 'badge-rose' : tx.type === 'DIVIDEND' ? 'badge-blue' : 'badge-amber'}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {tx.symbol}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {tx.quantity > 0 ? tx.quantity : '-'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>
                      {tx.price > 0 ? formatConverted(tx.price) : '-'}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      ${tx.fee || 0}
                    </td>
                    <td style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: tx.type === 'BUY' ? 'var(--text-primary)' : 'var(--accent-emerald)' }}>
                      {formatConverted(tx.total)}
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.notes || '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
                        onClick={() => deleteTransaction(tx.id)}
                        title="Delete transaction entry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
