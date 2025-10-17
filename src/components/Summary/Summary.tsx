import React from 'react';
import { MetricCard, ChartCard, DataTable } from '../Common';
import { MetricCardSkeleton, ChartCardSkeleton } from '../Skeletons';
import { useSummary, useRecentActivity } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  MetricData, 
  ChartDataPoint,
  TableData,
  TableColumn
} from '../../types/dashboard';
import '../../components/LoadingStates.css';

interface SummaryProps extends ComponentProps {}

const Summary: React.FC<SummaryProps> = ({ selectedPeriod }) => {
  // Use TanStack Query hooks for real-time data
  const { data: summaryData, isLoading: summaryLoading, isError: summaryError } = useSummary();
  const { data: recentActivityData, isLoading: activityLoading, isError: activityError } = useRecentActivity(10, 24);
  
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
    },
    {
      title: "Tasa de Validación",
      value: `${summaryData?.summary?.validation_rate?.toFixed(1) || "0"}%`,
      change: 0
    }
  ];

  // Create recent activity chart data from the recent events
  const activityChartData: ChartDataPoint[] = recentActivityData?.recent_events?.slice(0, 10).map((event: any) => ({
    name: event.type.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || event.type,
    value: 1,
    timestamp: event.timestamp,
    eventId: event.eventId,
    validation_status: event.validation_status
  })) || [];

  // Create events by type chart data
  const eventsByTypeChartData: ChartDataPoint[] = summaryData?.events_by_type?.slice(0, 10).map((event: any) => ({
    name: event.type.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || event.type,
    value: event.count,
    avg_price: event.avg_price
  })) || [];

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
            {Array.from({ length: 4 }).map((_, index) => (
              <MetricCardSkeleton key={index} />
            ))}
          </div>
        </section>

        {/* Recent Activity Skeleton */}
        <section className="chart-section">
          <h2 className="section-title">Actividad Reciente</h2>
          <ChartCardSkeleton />
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

      {/* Events by Type */}
      <section className="chart-section">
        <h2 className="section-title">Eventos por Tipo</h2>
        <ChartCard
          title="Distribución de Eventos"
          data={eventsByTypeChartData}
          type="bar"
          height={400}
        />
      </section>

      {/* Recent Activity */}
      <section className="chart-section">
        <h2 className="section-title">Actividad Reciente (Últimas 24 horas)</h2>
        <ChartCard
          title={`Eventos Recientes - ${recentActivityData?.count || 0} eventos`}
          data={activityChartData}
          type="bar"
          height={300}
        />
      </section>

      {/* Recent Events Details */}
      <section className="metrics-section">
        <h2 className="section-title">Detalles de Eventos Recientes</h2>
        <div className="grid grid-cols-1">
          <DataTable 
            title="Últimos Eventos Registrados"
            data={recentEventsTableData}
            columns={recentEventsColumns}
            maxRows={10}
          />
        </div>
      </section>

      {/* System Info */}
      <section className="info-section">
        <div className="info-card">
          <h3>Información del Sistema</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Período de Datos:</span>
              <span className="info-value">{summaryData?.period_days} días</span>
            </div>
            <div className="info-item">
              <span className="info-label">Período de Actividad Reciente:</span>
              <span className="info-value">{recentActivityData?.period_hours} horas</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total de Eventos Recientes:</span>
              <span className="info-value">{recentActivityData?.count || 0}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Summary;
