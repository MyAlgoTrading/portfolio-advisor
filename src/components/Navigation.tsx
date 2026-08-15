import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { 
  BarChart3, 
  Briefcase, 
  Sparkles, 
  Compass, 
  Globe2, 
  Bot
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, recommendations } = usePortfolio();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard & Overview', icon: BarChart3 },
    { id: 'holdings', label: 'Holdings & Ledger', icon: Briefcase },
    { 
      id: 'recommendations', 
      label: 'AI Recommendations & Rebalancing', 
      icon: Sparkles, 
      badge: recommendations.length > 0 ? recommendations.length : null 
    },
    { id: 'scenarios', label: 'Scenario Studio & Monte Carlo', icon: Compass },
    { id: 'market', label: 'Market Pulse & News', icon: Globe2 },
    { id: 'copilot', label: 'AI Strategy Co-Pilot', icon: Bot, isSpecial: true }
  ];

  return (
    <nav className="nav-tab-bar">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab-item ${isActive ? 'active' : ''}`}
            style={tab.isSpecial && !isActive ? { border: '1px solid rgba(139, 92, 246, 0.4)', background: 'rgba(139, 92, 246, 0.08)', color: '#C4B5FD' } : {}}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span style={{ 
                background: isActive ? '#FFFFFF' : 'var(--accent-primary)', 
                color: isActive ? 'var(--accent-primary)' : '#FFFFFF', 
                fontSize: '10px', 
                fontWeight: 800, 
                padding: '1px 6px', 
                borderRadius: '999px',
                marginLeft: '4px'
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
