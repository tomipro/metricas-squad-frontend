import React from 'react';
import DateFilter, { FilterOption } from './DateFilter';
import './TabNavigation.css';

export type TabKey = 'executive' | 'analytics' | 'fleet' | 'summary' | 'search';

export interface Tab {
  key: TabKey;
  label: string;
  icon: string;
}

interface TabNavigationProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const tabs: Tab[] = [
  {
    key: 'summary',
    label: 'Vista General',
    icon: 'VG'
  },
  {
    key: 'executive',
    label: 'KPIs Ejecutivos',
    icon: 'KP'
  },
  {
    key: 'analytics',
    label: 'Análisis de Usuarios',
    icon: 'AU'
  },
  {
    key: 'fleet',
    label: 'Gestión de Flota',
    icon: 'GF'
  },
  {
    key: 'search',
    label: 'Análisis de Búsquedas',
    icon: 'AB'
  }
];

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  selectedPeriod, 
  onPeriodChange 
}) => {
  // Opciones del filtro de período (días)
  const filterOptions: FilterOption[] = [
    { value: '7', label: 'Últimos 7 días' },
    { value: '30', label: 'Últimos 30 días' },
    { value: '90', label: 'Últimos 90 días' },
    { value: '180', label: 'Últimos 6 meses' },
    { value: '365', label: 'Último año' }
  ];

  return (
    <nav className="tab-navigation">
      <div className="container">
        <div className="tab-navigation-content">
          <div className="tab-list">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => onTabChange(tab.key)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="tab-filters">
            <DateFilter 
              selectedMonth={selectedPeriod}
              onMonthChange={onPeriodChange}
              options={filterOptions}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
