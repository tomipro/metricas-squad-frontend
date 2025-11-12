import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabNavigation, TabKey } from './Common';
import UserMenu from './Common/UserMenu';
import ExecutiveSummary from './ExecutiveSummary';
import Analytics from './Analytics';
import FleetManagement from './FleetManagement';
import { Summary } from './Summary';
import { SearchAnalytics } from './SearchAnalytics';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Helper function to validate and get tab from query param
  const getTabFromParams = (params: URLSearchParams): TabKey => {
    const tabParam = params.get('tab');
    const validTabs: TabKey[] = ['executive', 'analytics', 'fleet', 'summary', 'search'];
    return (tabParam && validTabs.includes(tabParam as TabKey)) ? (tabParam as TabKey) : 'summary';
  };

  // Read current values from URL query params
  const activeTab = getTabFromParams(searchParams);
  const selectedPeriod = searchParams.get('period') || '365';

  // Handler to update tab and sync with URL
  const handleTabChange = (tab: TabKey) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    setSearchParams(params, { replace: true });
  };

  // Handler to update period and sync with URL
  const handlePeriodChange = (period: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('period', period);
    setSearchParams(params, { replace: true });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'executive':
        return <ExecutiveSummary selectedPeriod={selectedPeriod} />;
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
        onTabChange={handleTabChange}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
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
