import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { PortfolioOverview } from './components/PortfolioOverview';
import { HoldingsTable } from './components/HoldingsTable';
import { RecommendationHub } from './components/RecommendationHub';
import { ScenarioStudio } from './components/ScenarioStudio';
import { MarketPulse } from './components/MarketPulse';
import { AICoPilot } from './components/AICoPilot';

// Modals
import { AddTransactionModal } from './components/Modals/AddTransactionModal';
import { CreatePortfolioModal } from './components/Modals/CreatePortfolioModal';
import { ImportExportModal } from './components/Modals/ImportExportModal';
import { AssetDetailModal } from './components/Modals/AssetDetailModal';
import { BrokerConnectModal } from './components/Modals/BrokerConnectModal';

const AppContent: React.FC = () => {
  const { activeTab } = usePortfolio();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<string | null>(null);
  const [initialTradeSymbol, setInitialTradeSymbol] = useState<string | undefined>(undefined);

  const handleOpenAddModal = (symbol?: string) => {
    setInitialTradeSymbol(symbol);
    setIsAddModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* 1. Header with Ticker Tape & Broker Connector */}
      <Header
        onOpenAddModal={() => handleOpenAddModal()}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenImportExportModal={() => setIsImportExportModalOpen(true)}
        onOpenBrokerModal={() => setIsBrokerModalOpen(true)}
      />

      {/* 2. Primary Navigation Bar */}
      <Navigation />

      {/* 3. Main View Router */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px' }}>
        {activeTab === 'dashboard' && (
          <PortfolioOverview />
        )}

        {activeTab === 'holdings' && (
          <HoldingsTable
            onOpenAddModal={handleOpenAddModal}
            onSelectAssetDetail={(sym: string) => setSelectedAssetDetail(sym)}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationHub />
        )}

        {activeTab === 'scenarios' && (
          <ScenarioStudio />
        )}

        {activeTab === 'market' && (
          <MarketPulse onSelectAssetDetail={(sym: string) => setSelectedAssetDetail(sym)} />
        )}

        {activeTab === 'copilot' && (
          <AICoPilot />
        )}
      </main>

      {/* 4. Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialSymbol={initialTradeSymbol}
      />

      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ImportExportModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
      />

      <AssetDetailModal
        symbol={selectedAssetDetail}
        onClose={() => setSelectedAssetDetail(null)}
        onOpenTrade={(sym: string) => {
          setSelectedAssetDetail(null);
          handleOpenAddModal(sym);
        }}
      />

      <BrokerConnectModal
        isOpen={isBrokerModalOpen}
        onClose={() => setIsBrokerModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

export default App;
