import React from 'react';
import { MetricCard, DataTable } from '../Common';
import { MetricCardSkeleton } from '../Skeletons';
import { useSummary, useRecentActivity } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  MetricData, 
  TableData,
  TableColumn
} from '../../types/dashboard';
import '../../components/LoadingStates.css';

interface SummaryProps extends ComponentProps {}

const Summary: React.FC<SummaryProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days and hours
  const getDaysFromPeriod = (period: string): number => {
    return parseInt(period, 10) || 30;
  };

  const getHoursFromPeriod = (period: string): number => {
    const days = parseInt(period, 10) || 30;
    return days * 24; // Convert days to hours
  };

  const days = getDaysFromPeriod(selectedPeriod);
  const hours = getHoursFromPeriod(selectedPeriod);

  // Use TanStack Query hooks for real-time data
  const { data: summaryData, isLoading: summaryLoading, isError: summaryError } = useSummary(days);
  const { data: recentActivityData, isLoading: activityLoading, isError: activityError } = useRecentActivity(10, hours);
  
  const isLoading = summaryLoading || activityLoading;
  const isError = summaryError || activityError;

  // Create summary metrics from API data
  const summaryMetrics: MetricData[] = [
    {
      title: "Total de Eventos",
      value: summaryData?.summary?.total_events?.toLocaleString() || "0",
      change: 0
    },
    {
      title: "Total de Reservas",
      value: summaryData?.summary?.total_bookings?.toLocaleString() || "0",
      change: 0
    },
    {
      title: "Ingresos Totales",
      value: `USD ${summaryData?.summary?.total_revenue?.toLocaleString() || "0"}`,
      change: 0
    }
  ];

  // Create recent events table data
  const recentEventsTableData: TableData[] = recentActivityData?.recent_events?.map((event: any) => ({
    eventId: event.eventId.substring(0, 8) + '...',
    type: event.type,
    timestamp: new Date(event.timestamp).toLocaleString(),
    received_at: new Date(event.received_at).toLocaleString(),
    validation_status: event.validation_status
  })) || [];

  // Create columns for recent events table
  const recentEventsColumns: TableColumn[] = [
    { key: 'eventId', title: 'Event ID' },
    { key: 'type', title: 'Tipo de Evento' },
    { key: 'timestamp', title: 'Timestamp' },
    { key: 'received_at', title: 'Recibido en' },
    { key: 'validation_status', title: 'Estado' }
  ];

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <div className="tab-content">
        {/* Summary Metrics Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Resumen General</h2>
          <div className="metrics-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <MetricCardSkeleton key={index} />
            ))}
          </div>
        </section>

        {/* Recent Events Details Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Eventos Recientes</h2>
          <div className="grid grid-cols-1">
            <div className="chart-card-skeleton" style={{ height: '300px' }}></div>
          </div>
        </section>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="tab-content">
        <div className="error-container">
          <p>Error loading summary data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {/* Summary Metrics */}
      <section className="metrics-section">
        <h2 className="section-title">Resumen General</h2>
        <div className="metrics-grid">
          {summaryMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              metric={metric}
            />
          ))}
        </div>
      </section>

      {/* Recent Events Details */}
      <section className="metrics-section">
        <h2 className="section-title">Eventos Recientes</h2>
        <div className="grid grid-cols-1">
          <DataTable 
            title="Últimos Eventos Registrados"
            data={recentEventsTableData}
            columns={recentEventsColumns}
            maxRows={10}
          />
        </div>
      </section>
    </div>
  );
};

export default Summary;
