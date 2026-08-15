import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MARKET_INDICES } from '../services/marketData';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Download, 
  Layers, 
  Wallet,
  ShieldCheck
} from 'lucide-react';
import type { Currency } from '../types';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenCreateModal: () => void;
  onOpenImportExportModal: () => void;
  onOpenBrokerModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenCreateModal,
  onOpenImportExportModal,
  onOpenBrokerModal
}) => {
  const { 
    portfolios, 
    activePortfolio, 
    setActivePortfolioId, 
    metrics, 
    currency, 
    setCurrency,
    formatConverted,
    connectedBrokers
  } = usePortfolio();

  const isAnyBrokerConnected = Object.values(connectedBrokers).some(b => b.connected);
  const activeBrokerName = connectedBrokers.zerodha?.connected 
    ? 'Zerodha Active' 
    : connectedBrokers.shoonya?.connected 
    ? 'Shoonya Active' 
    : connectedBrokers.blinkx?.connected 
    ? 'BlinkX Active' 
    : null;

  return (
    <header style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(10, 15, 29, 0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* 1. Live Market Ticker Tape */}
      <div style={{ background: 'rgba(0, 0, 0, 0.35)', borderBottom: '1px solid var(--border-subtle)', padding: '6px 0', overflow: 'hidden' }}>
        <div className="ticker-wrapper" style={{ display: 'flex', gap: '32px', whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite' }}>
          {MARKET_INDICES.map((idx) => {
            const isPositive = idx.change >= 0;
            return (
              <div key={idx.symbol} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-muted)' }}>{idx.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                  {idx.price.toLocaleString()}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {isPositive ? '+' : ''}{idx.changePercent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Left Brand & Portfolio Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 38, height: 38, borderRadius: '10px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)' }}>
              <Layers size={20} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Portfolio Advisor
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                🇮🇳 Indian Capital Markets & Broker OS
              </div>
            </div>
          </div>

          <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)' }} />

          {/* Portfolio Dropdown Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <select
                value={activePortfolio.id}
                onChange={(e) => setActivePortfolioId(e.target.value)}
                className="form-select"
                style={{ padding: '6px 32px 6px 12px', fontSize: '13px', fontWeight: 600, minWidth: '220px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)' }}
              >
                {portfolios.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.currency})
                  </option>
                ))}
              </select>
            </div>

            <button 
              onClick={onOpenCreateModal}
              className="btn btn-ghost btn-sm"
              title="Create new portfolio"
              style={{ padding: '6px 8px' }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Right Metric Quick-Bar & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Indian Broker Integration Status Button */}
          <button
            onClick={onOpenBrokerModal}
            className="btn btn-sm"
            style={{
              background: isAnyBrokerConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
              border: '1px solid',
              borderColor: isAnyBrokerConnected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)',
              color: isAnyBrokerConnected ? '#A7F3D0' : '#93C5FD',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <ShieldCheck size={14} style={{ color: isAnyBrokerConnected ? 'var(--accent-emerald)' : 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 700, fontSize: '11px' }}>
              {activeBrokerName ? `🇮🇳 ${activeBrokerName}` : '🔗 Connect Indian Broker'}
            </span>
          </button>

          {/* Net Worth Snapshot Pill */}
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wallet size={15} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Value:</span>
            <span style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {formatConverted(metrics.totalValue)}
            </span>
          </div>

          {/* Currency Switcher */}
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.04)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map(curr => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  background: currency === curr ? 'var(--grad-primary)' : 'transparent',
                  color: currency === curr ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {curr === 'INR' ? '₹ INR' : curr}
              </button>
            ))}
          </div>

          {/* Backup / Export Button */}
          <button 
            onClick={onOpenImportExportModal}
            className="btn btn-secondary btn-sm"
            title="Import / Export Data"
          >
            <Download size={14} /> Data
          </button>

          {/* Add Transaction Button */}
          <button 
            onClick={onOpenAddModal}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} /> Record Trade
          </button>
        </div>
      </div>
    </header>
  );
};
