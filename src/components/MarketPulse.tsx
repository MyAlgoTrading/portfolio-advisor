import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { MARKET_INDICES, NEWS_FEED } from '../services/marketData';
import { 
  Globe2, 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Newspaper, 
  Activity
} from 'lucide-react';

interface MarketPulseProps {
  onSelectAssetDetail: (symbol: string) => void;
}

export const MarketPulse: React.FC<MarketPulseProps> = ({ onSelectAssetDetail }) => {
  const { assets, formatConverted } = usePortfolio();

  const fearGreedScore = 68;
  const fearGreedLabel = 'Greed';

  const allAssetsList = Object.values(assets);
  const trendingMovers = [...allAssetsList]
    .filter(a => a.symbol !== 'CASH')
    .sort((a, b) => Math.abs(b.change24hPercent) - Math.abs(a.change24hPercent))
    .slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Global Indices Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Globe2 size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Global Benchmark Indices</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {MARKET_INDICES.map(idx => (
            <div key={idx.symbol} className="glass-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{idx.name}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: idx.changePercent >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {idx.changePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent}%
                </span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#FFFFFF' }}>
                ${idx.price.toLocaleString()}
              </div>
              <div style={{ fontSize: '11px', color: idx.change >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {idx.change >= 0 ? '+' : ''}{idx.change.toLocaleString()} pts
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sentiment Gauge & Top Trending Movers */}
      <div className="grid-3col">
        {/* Fear & Greed Index Gauge */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Activity size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Market Fear & Greed Index</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Multi-factor market momentum, volume, and volatility indicator
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)' }}>
              {fearGreedScore}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-emerald)' }}>
              {fearGreedLabel}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Last updated: 15m ago • Previous Close: 64 (Greed)
            </div>

            {/* Gauge visual slider */}
            <div style={{ width: '80%', height: '8px', margin: '16px auto 8px', background: 'linear-gradient(90deg, #EF4444 0%, #F59E0B 35%, #10B981 70%, #06B6D4 100%)', borderRadius: '999px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-4px', left: `${fearGreedScore}%`, width: '16px', height: '16px', borderRadius: '50%', background: '#FFFFFF', border: '3px solid #0E1526', transform: 'translateX(-50%)', boxShadow: '0 0 8px rgba(0,0,0,0.5)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', margin: '0 auto', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              <span>Extreme Fear (0)</span>
              <span>Neutral (50)</span>
              <span>Extreme Greed (100)</span>
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.03)', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            💡 <strong>Advisor Note:</strong> During elevated Greed periods, avoid chasing parabolic rallies. Rebalancing helps take systematic profits into defensive assets.
          </div>
        </div>

        {/* Top Trending Market Movers */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Flame size={18} style={{ color: 'var(--accent-amber)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Top Trending Movers</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Highest momentum & volume in watchlist</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {trendingMovers.map(a => (
              <div
                key={a.symbol}
                onClick={() => onSelectAssetDetail(a.symbol)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>
                    {a.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{a.symbol}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.name}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                    {formatConverted(a.currentPrice)}
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: a.change24hPercent >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    {a.change24hPercent >= 0 ? '+' : ''}{a.change24hPercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Live News Feed with AI Sentiment */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Newspaper size={18} style={{ color: 'var(--accent-primary)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Real-Time Financial News & Sentiment Feed</h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px' }}>
          Curated market headlines with algorithmic bullish/bearish scoring and portfolio impact tags
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {NEWS_FEED.map(news => (
            <div 
              key={news.id} 
              style={{ 
                background: 'rgba(255, 255, 255, 0.02)', 
                padding: '16px', 
                borderRadius: 'var(--radius-lg)', 
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className={`badge ${news.sentiment === 'bullish' ? 'badge-emerald' : news.sentiment === 'bearish' ? 'badge-rose' : 'badge-blue'}`}>
                    {news.sentiment.toUpperCase()} • {news.impactTag}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {news.source} • {news.timeAgo}
                  </span>
                </div>

                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.4, marginBottom: '8px' }}>
                  {news.title}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {news.summary}
                </p>
              </div>

              <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>
                  Portfolio Actionable Insight:
                </div>
                <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: 1.4 }}>
                  {news.actionableInsight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
