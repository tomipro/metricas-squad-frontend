import React, { useState } from 'react';
import { TabNavigation, TabKey } from './Common';
import UserMenu from './Common/UserMenu';
import ExecutiveSummary from './ExecutiveSummary';
import Operations from './Operations';
import Analytics from './Analytics';
import FleetManagement from './FleetManagement';
import { Summary } from './Summary';
import { SearchAnalytics } from './SearchAnalytics';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const [selectedPeriod, setSelectedPeriod] = useState('365');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveSummary selectedPeriod={selectedPeriod} />;
      case 'operations':
        return <Operations selectedPeriod={selectedPeriod} />;
      case 'analytics':
        return <Analytics selectedPeriod={selectedPeriod} />;
      case 'fleet':
        return <FleetManagement selectedPeriod={selectedPeriod} />;
      case 'summary':
        return <Summary selectedPeriod={selectedPeriod} />;
      case 'search':
        return <SearchAnalytics selectedPeriod={selectedPeriod} />;
      default:
        return <Summary selectedPeriod={selectedPeriod} />;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1>Dashboard de Métricas</h1>
              <p className="dashboard-subtitle">Reservas de Vuelos - Análisis Integral</p>
            </div>
            <div className="header-user">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <main className="dashboard-content">
        <div className="container">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
