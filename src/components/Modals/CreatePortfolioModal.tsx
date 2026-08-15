import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { Currency, RiskProfile } from '../../types';
import { PRESET_PORTFOLIOS } from '../../data/presets';
import { X, Plus } from 'lucide-react';

interface CreatePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePortfolioModal: React.FC<CreatePortfolioModalProps> = ({
  isOpen,
  onClose
}) => {
  const { createPortfolio } = usePortfolio();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('moderate');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createPortfolio(name, description, currency, riskProfile, selectedTemplate || undefined);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Create New Portfolio</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Configure a new investment portfolio or start from a proven strategy template
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Portfolio Name</label>
            <input
              type="text"
              placeholder="e.g. Retirement 401(k), High Growth Tech, Crypto Stash..."
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Strategy Thesis</label>
            <input
              type="text"
              placeholder="e.g. Long term wealth building with 15% crypto and 85% index equities"
              className="form-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Base Currency</label>
              <select
                className="form-select"
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Risk Profile</label>
              <select
                className="form-select"
                value={riskProfile}
                onChange={e => setRiskProfile(e.target.value as RiskProfile)}
              >
                <option value="conservative">Conservative (Capital Preservation)</option>
                <option value="moderate">Moderate (Balanced 60/40 Growth)</option>
                <option value="aggressive">Aggressive (Maximum Alpha)</option>
              </select>
            </div>
          </div>

          {/* Starting Strategy Template */}
          <div className="form-group">
            <label className="form-label">Starting Strategy Template (Optional)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                onClick={() => setSelectedTemplate('')}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedTemplate === '' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: selectedTemplate === '' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '13px' }}>✨ Clean Slate ($10,000 Cash)</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Start empty and add your own custom assets & lots</div>
              </div>

              {PRESET_PORTFOLIOS.map(tmpl => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedTemplate === tmpl.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid',
                    borderColor: selectedTemplate === tmpl.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>{tmpl.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tmpl.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              <Plus size={16} /> Create Portfolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
