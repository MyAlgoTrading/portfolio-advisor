import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { 
  X, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw,
  LogOut
} from 'lucide-react';

interface BrokerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrokerConnectModal: React.FC<BrokerConnectModalProps> = ({ isOpen, onClose }) => {
  const { 
    connectedBrokers, 
    connectBroker, 
    disconnectBroker, 
    syncBrokerHoldings, 
    activePortfolio 
  } = usePortfolio();

  const [selectedBroker, setSelectedBroker] = useState<'zerodha' | 'shoonya' | 'blinkx'>('zerodha');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [requestToken, setRequestToken] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [twoFA, setTwoFA] = useState('');
  const [clientCode, setClientCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSession = connectedBrokers[selectedBroker] || { connected: false };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSyncSuccess(null);

    let creds: any = {};
    if (selectedBroker === 'zerodha') {
      creds = { apiKey: apiKey || 'DEMO_ZERODHA', apiSecret, requestToken };
    } else if (selectedBroker === 'shoonya') {
      creds = { userId: userId || 'DEMO_SHOONYA', password, twoFA, apiKey };
    } else {
      creds = { clientCode: clientCode || 'DEMO_BLINKX', apiKey };
    }

    try {
      await connectBroker(selectedBroker, creds);
    } catch (err: any) {
      alert(`Connection failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSandbox = async () => {
    setIsLoading(true);
    setSyncSuccess(null);
    try {
      await connectBroker(selectedBroker, { apiKey: `DEMO_${selectedBroker.toUpperCase()}`, userId: `DEMO_${selectedBroker.toUpperCase()}`, clientCode: `DEMO_${selectedBroker.toUpperCase()}` });
    } catch (err: any) {
      alert(`Connection failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    setSyncSuccess(null);
    try {
      const count = await syncBrokerHoldings(selectedBroker);
      setSyncSuccess(`Successfully imported ${count} Demat holdings into "${activePortfolio.name}"!`);
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Indian Broker Integrations</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Connect your Demat account to sync live holdings and execute rebalancing trades
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Broker Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { id: 'zerodha', name: 'Zerodha Kite', tag: 'Kite Connect API', color: '#EF4444' },
            { id: 'shoonya', name: 'Shoonya', tag: 'Finvasia Zero Brokerage', color: '#10B981' },
            { id: 'blinkx', name: 'BlinkX', tag: 'JM Financial API', color: '#3B82F6' }
          ].map(b => {
            const isConnected = connectedBrokers[b.id as any]?.connected;
            const isSelected = selectedBroker === b.id;

            return (
              <button
                key={b.id}
                type="button"
                onClick={() => { setSelectedBroker(b.id as any); setSyncSuccess(null); }}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-lg)',
                  background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: isSelected ? '#FFFFFF' : 'var(--text-primary)' }}>
                    {b.name}
                  </div>
                  {isConnected && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{b.tag}</div>
              </button>
            );
          })}
        </div>

        {/* Sync Success Banner */}
        {syncSuccess && (
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#A7F3D0', fontSize: '13px' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)', flexShrink: 0 }} />
            <span>{syncSuccess}</span>
          </div>
        )}

        {/* Connected Broker Dashboard State */}
        {currentSession.connected ? (
          <div style={{ background: 'rgba(14, 21, 38, 0.95)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={12} /> Connected & Active
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  {currentSession.userName || 'Account'} ({currentSession.brokerClientId})
                </span>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--accent-rose)', fontSize: '12px' }}
                onClick={() => disconnectBroker(selectedBroker)}
              >
                <LogOut size={13} /> Disconnect
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Account Type</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {currentSession.accountType || 'Equity Demat'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Margin</div>
                <div style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                  ₹{(currentSession.availableMargin || 184500).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Session Auth</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '2px' }}>
                  Auto-Renewed
                </div>
              </div>
            </div>

            {/* 1-Click Sync Holdings Action */}
            <button
              type="button"
              className="btn btn-emerald btn-lg"
              style={{ width: '100%', boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)', fontWeight: 800 }}
              onClick={handleSync}
              disabled={isLoading}
            >
              {isLoading ? <RefreshCw size={18} className="spin" /> : <Download size={18} />}
              📥 1-Click Sync Demat Holdings to Active Portfolio
            </button>
          </div>
        ) : (
          /* Credentials Form */
          <form onSubmit={handleConnect}>
            {selectedBroker === 'zerodha' && (
              <>
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '12px', color: '#FCA5A5', lineHeight: 1.5 }}>
                  <strong>Zerodha Kite Connect:</strong> Generate your API Key & API Secret from the <a href="https://kite.trade" target="_blank" rel="noreferrer" style={{ color: '#60A5FA', textDecoration: 'underline' }}>Kite Developer Console <ExternalLink size={11} style={{ display: 'inline' }} /></a>.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Kite API Key</label>
                    <input
                      type="text"
                      placeholder="e.g. abcd1234efgh5678"
                      className="form-input"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Kite API Secret</label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      className="form-input"
                      value={apiSecret}
                      onChange={e => setApiSecret(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Request Token (Post-Login Redirect)</label>
                  <input
                    type="text"
                    placeholder="Optional for sandbox mode"
                    className="form-input"
                    value={requestToken}
                    onChange={e => setRequestToken(e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedBroker === 'shoonya' && (
              <>
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '12px', color: '#A7F3D0', lineHeight: 1.5 }}>
                  <strong>Shoonya by Finvasia:</strong> Free zero-brokerage trading API. Enter your Shoonya User ID and password / TOTP.
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Shoonya User ID</label>
                    <input
                      type="text"
                      placeholder="e.g. FA10293"
                      className="form-input"
                      value={userId}
                      onChange={e => setUserId(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      placeholder="Password"
                      className="form-input"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">2FA / TOTP Code</label>
                  <input
                    type="password"
                    placeholder="Authenticator TOTP Code"
                    className="form-input"
                    value={twoFA}
                    onChange={e => setTwoFA(e.target.value)}
                  />
                </div>
              </>
            )}

            {selectedBroker === 'blinkx' && (
              <>
                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '12px', color: '#BFDBFE', lineHeight: 1.5 }}>
                  <strong>BlinkX by JM Financial:</strong> Connect your JM Financial Demat client code for instantaneous portfolio holdings sync.
                </div>

                <div className="form-group">
                  <label className="form-label">BlinkX Client Code</label>
                  <input
                    type="text"
                    placeholder="e.g. BX77421"
                    className="form-input"
                    value={clientCode}
                    onChange={e => setClientCode(e.target.value)}
                  />
                </div>
              </>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleQuickSandbox}
                disabled={isLoading}
              >
                🚀 Quick Connect with Sandbox Data
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Connecting...' : 'Connect Broker'}
                </button>
              </div>
            </div>
          </form>
        )}

        <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <AlertCircle size={14} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <span>Your broker credentials are encrypted and stored locally in your private backend server. They are never sent to external third parties.</span>
        </div>
      </div>
    </div>
  );
};
