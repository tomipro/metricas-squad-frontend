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
  onRefresh: () => void;
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
  onPeriodChange,
  onRefresh
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
            <button
              className="refresh-button"
              onClick={onRefresh}
              title="Refrescar datos de la tab activa"
              aria-label="Refrescar datos"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.66667 2.66667V5.33333H5.33333M13.3333 13.3333V10.6667H10.6667M13.3333 6.66667C13.3333 10.3486 10.3486 13.3333 6.66667 13.3333C4.90524 13.3333 3.33333 12.5333 2.33333 11.3333M2.66667 9.33333C2.66667 5.65143 5.65143 2.66667 9.33333 2.66667C11.0948 2.66667 12.6667 3.46667 13.6667 4.66667"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Refrescar</span>
            </button>
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
