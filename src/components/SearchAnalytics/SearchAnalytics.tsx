import React from 'react';
import { MetricCard, ChartCard, DataTable } from '../Common';
import { MetricCardSkeleton, ChartCardSkeleton, DataTableSkeleton } from '../Skeletons';
import { useSearchMetrics, useSearchCartSummary } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  MetricData, 
  ChartDataPoint,
  TableColumn,
  TableData
} from '../../types/dashboard';
import '../../components/LoadingStates.css';

interface SearchAnalyticsProps extends ComponentProps {}

const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days for API calls
  const getDaysFromPeriod = (period: string): number => {
    return parseInt(period, 10) || 14; // Default to 14 days for search metrics
  };

  const days = getDaysFromPeriod(selectedPeriod);
  
  // Use TanStack Query hooks for real-time data
  const { data: searchMetricsData, isLoading: searchLoading, isError: searchError } = useSearchMetrics(days, 10);
  const { data: cartSummaryData, isLoading: cartLoading, isError: cartError } = useSearchCartSummary(days, 10);
  
  const isLoading = searchLoading || cartLoading;
  const isError = searchError || cartError;

  // Create search metrics from API data
  const searchMetrics: MetricData[] = [
    {
      title: "Total de Búsquedas",
      value: searchMetricsData?.search_metrics?.length?.toString() || "0",
      change: 0
    },
    {
      title: "Promedio de Resultados",
      value: searchMetricsData?.search_metrics?.length ? 
        (searchMetricsData.search_metrics.reduce((sum: number, metric: { results_count: number }) => sum + metric.results_count, 0) / searchMetricsData.search_metrics.length).toFixed(0) : "0",
      change: 0
    },
    {
      title: "Tasa de Conversión",
      value: searchMetricsData?.search_metrics?.length ? 
        `${(searchMetricsData.search_metrics.reduce((sum: number, metric: { conversion_rate: number }) => sum + metric.conversion_rate, 0) / searchMetricsData.search_metrics.length * 100).toFixed(1)}%` : "0%",
      change: 0
    },
    {
      title: "Items en Carrito",
      value: cartSummaryData?.cart_summary?.reduce((sum: number, cart: { cart_items: number }) => sum + cart.cart_items, 0)?.toString() || "0",
      change: 0
    }
  ];

  // Create search metrics chart data
  const searchChartData: ChartDataPoint[] = searchMetricsData?.search_metrics?.slice(0, 8).map((metric: any) => ({
    name: `${metric.origin} → ${metric.destination}`,
    value: metric.search_count,
    conversion_rate: metric.conversion_rate,
    results_count: metric.results_count
  })) || [];

  // Create cart summary table data with formatted values
  const cartTableData: TableData[] = cartSummaryData?.cart_summary?.map((cart: any) => ({
    user_id: cart.user_id,
    cart_items: cart.cart_items,
    total_value: `${cart.currency} ${cart.total_value.toLocaleString()}`,
    conversion_rate: `${(cart.conversion_rate * 100).toFixed(1)}%`,
    avg_time_in_cart: `${cart.avg_time_in_cart.toFixed(1)} min`
  })) || [];

  // Define table columns for cart summary
  const cartTableColumns: TableColumn[] = [
    { key: 'user_id', title: 'Usuario' },
    { key: 'cart_items', title: 'Items' },
    { key: 'total_value', title: 'Valor Total' },
    { key: 'conversion_rate', title: 'Conversión' },
    { key: 'avg_time_in_cart', title: 'Tiempo Promedio' }
  ];

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <div className="tab-content">
        {/* Search Metrics Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Métricas de Búsqueda</h2>
          <div className="metrics-grid">
            {Array.from({ length: 4 }).map((_, index) => (
              <MetricCardSkeleton key={index} />
            ))}
          </div>
        </section>

        {/* Search Chart Skeleton */}
        <section className="chart-section">
          <h2 className="section-title">Búsquedas por Ruta</h2>
          <ChartCardSkeleton />
        </section>

        {/* Cart Summary Skeleton */}
        <section className="table-section">
          <h2 className="section-title">Resumen del Carrito</h2>
          <DataTableSkeleton />
        </section>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="tab-content">
        <div className="error-container">
          <p>Error loading search analytics data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {/* Search Metrics */}
      <section className="metrics-section">
        <h2 className="section-title">Métricas de Búsqueda</h2>
        <div className="metrics-grid">
          {searchMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              metric={metric}
            />
          ))}
        </div>
      </section>

      {/* Search Chart */}
      <section className="chart-section">
        <h2 className="section-title">Búsquedas por Ruta (Top {searchChartData.length})</h2>
        <ChartCard
          title="Búsquedas Realizadas"
          data={searchChartData}
          type="bar"
          height={300}
        />
      </section>

      {/* Cart Summary Table */}
      <section className="table-section">
        <h2 className="section-title">Resumen del Carrito de Búsqueda</h2>
        <DataTable
          data={cartTableData}
          columns={cartTableColumns}
          title="Actividad del Carrito"
        />
      </section>
    </div>
  );
};

export default SearchAnalytics;
