import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { TransactionType } from '../../types';
import { X, Check } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSymbol?: string;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  initialSymbol = 'RELIANCE'
}) => {
  const { assets, addTransaction, activePortfolio } = usePortfolio();

  const [type, setType] = useState<TransactionType>('BUY');
  const [symbol, setSymbol] = useState<string>(initialSymbol || 'RELIANCE');
  const [quantity, setQuantity] = useState<number>(10);
  const [price, setPrice] = useState<number>(100);
  const [fee, setFee] = useState<number>(0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  const allAssets = Object.values(assets);

  useEffect(() => {
    if (symbol && assets[symbol]) {
      setPrice(assets[symbol].currentPrice);
    }
  }, [symbol, assets]);

  useEffect(() => {
    if (initialSymbol) {
      setSymbol(initialSymbol);
    }
  }, [initialSymbol]);

  if (!isOpen) return null;

  const totalAmount = type === 'DEPOSIT' || type === 'WITHDRAWAL' || type === 'DIVIDEND'
    ? quantity
    : +(quantity * price).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'BUY' || type === 'SELL') {
      if (quantity <= 0 || price <= 0) {
        alert('Please enter valid quantity and price');
        return;
      }
    }

    addTransaction({
      portfolioId: activePortfolio.id,
      symbol: (type === 'DEPOSIT' || type === 'WITHDRAWAL') ? 'LIQUIDBEES' : symbol.toUpperCase(),
      type,
      quantity: (type === 'DEPOSIT' || type === 'WITHDRAWAL' || type === 'DIVIDEND') ? 1 : quantity,
      price: (type === 'DEPOSIT' || type === 'WITHDRAWAL' || type === 'DIVIDEND') ? totalAmount : price,
      fee,
      total: totalAmount,
      date,
      notes
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Record Transaction</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Add to <strong>{activePortfolio.name}</strong>
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Transaction Type Tabs */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {(['BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL'] as TransactionType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                background: type === t 
                  ? (t === 'BUY' ? 'var(--accent-emerald)' : t === 'SELL' ? 'var(--accent-rose)' : 'var(--accent-primary)') 
                  : 'transparent',
                color: type === t ? '#FFFFFF' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Asset Selection (for BUY/SELL/DIVIDEND) */}
          {type !== 'DEPOSIT' && type !== 'WITHDRAWAL' && (
            <div className="form-group">
              <label className="form-label">Select Asset / Ticker</label>
              <select
                className="form-select"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
              >
                {allAssets.map(a => (
                  <option key={a.symbol} value={a.symbol}>
                    {a.symbol} - {a.name} (₹{a.currentPrice.toLocaleString()}) [{a.assetClass.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity and Price */}
          {(type === 'BUY' || type === 'SELL') ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Shares / Quantity</label>
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  className="form-input"
                  value={quantity}
                  onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price Per Share (₹)</label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  className="form-input"
                  value={price}
                  onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Amount (₹ INR)</label>
              <input
                type="number"
                step="any"
                min="0.01"
                className="form-input"
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          )}

          {/* Date & Fee */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Transaction Date</label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Trading / Brokerage Fee (₹)</label>
              <input
                type="number"
                step="any"
                min="0"
                className="form-input"
                value={fee}
                onChange={e => setFee(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Notes / Thesis (Optional)</label>
            <input
              type="text"
              placeholder="e.g. SIP installment, quarterly earnings breakout..."
              className="form-input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Total Calculation Display */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Order Value
            </span>
            <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={16} /> Confirm & Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
