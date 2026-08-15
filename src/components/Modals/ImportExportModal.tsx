import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { X, Download, Upload, Copy, Check, FileText } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    activePortfolio, 
    exportPortfolioJSON, 
    exportPortfolioCSV, 
    importPortfolioJSON
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importJsonText, setImportJsonText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(activePortfolio, null, 2);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;

    const success = importPortfolioJSON(importJsonText);
    if (success) {
      onClose();
    } else {
      alert('Invalid portfolio JSON format.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Import / Export Portfolio</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Backup your portfolio data or import existing positions
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.03)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('export')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'export' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'export' ? '#FFFFFF' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <Download size={14} style={{ display: 'inline', marginRight: '6px' }} /> Export ({activePortfolio.name})
          </button>

          <button
            onClick={() => setActiveTab('import')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'import' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'import' ? '#FFFFFF' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            <Upload size={14} style={{ display: 'inline', marginRight: '6px' }} /> Import JSON
          </button>
        </div>

        {activeTab === 'export' ? (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button className="btn btn-primary btn-sm" onClick={exportPortfolioJSON}>
                <Download size={14} /> Download JSON
              </button>
              <button className="btn btn-secondary btn-sm" onClick={exportPortfolioCSV}>
                <FileText size={14} /> Download CSV
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleCopyJSON}>
                {copied ? <Check size={14} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Portfolio JSON Representation</label>
              <textarea
                readOnly
                rows={10}
                className="form-textarea"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#93C5FD' }}
                value={jsonString}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleImportSubmit}>
            <div className="form-group">
              <label className="form-label">Paste Portfolio JSON Content</label>
              <textarea
                placeholder='Paste portfolio JSON here...'
                rows={10}
                className="form-textarea"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                value={importJsonText}
                onChange={e => setImportJsonText(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-emerald" disabled={!importJsonText.trim()}>
                <Upload size={16} /> Import Portfolio
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
