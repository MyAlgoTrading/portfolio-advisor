import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Zap, 
  User
} from 'lucide-react';

export const AICoPilot: React.FC = () => {
  const { 
    aiMessages, 
    sendAIMessage, 
    activePortfolio, 
    metrics, 
    executeTrade, 
    executeAllRebalanceTrades, 
    setActiveTab 
  } = usePortfolio();

  const [inputPrompt, setInputPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "🩺 Diagnose my portfolio risk & Sharpe ratio",
    "⚖️ Recommend rebalancing trade orders",
    "💰 How can I boost dividend yield to 3.5%?",
    "📉 Scan tax-loss harvesting candidates",
    "🔮 Run 10-year Monte Carlo wealth forecast"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;
    sendAIMessage(inputPrompt);
    setInputPrompt('');
  };

  const handleActionClick = (action: any) => {
    if (action.actionType === 'SWITCH_TAB') {
      setActiveTab(action.payload.tab);
    } else if (action.actionType === 'REBALANCE') {
      executeAllRebalanceTrades(action.payload);
    } else if (action.actionType === 'EXECUTE_TRADE') {
      executeTrade(action.payload);
    }
  };

  return (
    <div className="glass-card" style={{ height: 'calc(100vh - 240px)', minHeight: '600px', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
      {/* Co-Pilot Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(14, 21, 38, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 14px rgba(59, 130, 246, 0.4)' }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Portfolio Advisor AI
              <span className="badge badge-emerald" style={{ fontSize: '9px' }}>Online</span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Context: <strong>{activePortfolio.name}</strong> (${metrics.totalValue.toLocaleString()} net worth • Health: {metrics.healthScore}/100)
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-blue">Sharpe: {metrics.sharpeRatio}</span>
          <span className="badge badge-violet">Beta: {metrics.beta}</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div style={{ padding: '10px 20px', background: 'rgba(0, 0, 0, 0.2)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendAIMessage(prompt)}
            style={{
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {aiMessages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {msg.sender === 'assistant' && (
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, marginTop: '2px' }}>
                <Sparkles size={16} />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  background: msg.sender === 'user' ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#FFFFFF',
                  padding: '14px 18px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.content}

                {/* Metrics Highlight Pills inside Assistant response */}
                {msg.metricsHighlight && msg.metricsHighlight.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                    {msg.metricsHighlight.map((m, idx) => (
                      <div key={idx} style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginRight: '6px' }}>{m.label}:</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons in AI message */}
              {msg.actions && msg.actions.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {msg.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(act)}
                      className="btn btn-emerald btn-sm"
                      style={{ fontSize: '11px', padding: '6px 12px' }}
                    >
                      <Zap size={12} /> {act.label}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ fontSize: '10px', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, marginTop: '2px' }}>
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleSend} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(14, 21, 38, 0.95)', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Ask Portfolio Advisor AI (e.g. 'How should I rebalance for lower volatility?', 'Analyze my cash drag')..."
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          className="form-input"
          style={{ flex: 1, height: '44px', fontSize: '13px' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ height: '44px', padding: '0 20px' }}
          disabled={!inputPrompt.trim()}
        >
          <Send size={16} /> Send
        </button>
      </form>
    </div>
  );
};
