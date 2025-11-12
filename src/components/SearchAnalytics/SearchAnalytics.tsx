import React, { useMemo } from 'react';
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
import { getDaysFromPeriod } from '../../utils/periodUtils';
import '../../components/LoadingStates.css';

interface SearchAnalyticsProps extends ComponentProps {}

const SearchAnalytics: React.FC<SearchAnalyticsProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days for API calls
  // Note: SearchAnalytics uses default of 14 days, but we'll use the utility function
  const days = getDaysFromPeriod(selectedPeriod) || 14;
  
  // Use TanStack Query hooks for real-time data
  const { data: searchMetricsData, isLoading: searchLoading, isError: searchError } = useSearchMetrics(days, 10);
  const { data: cartSummaryData, isLoading: cartLoading, isError: cartError } = useSearchCartSummary(days, 10);
  
  const isLoading = searchLoading || cartLoading;
  const isError = searchError || cartError;

  // Calculate average results from routes with valid data
  const avgResults = useMemo(() => {
    if (!searchMetricsData?.routes?.length) return 0;
    const routesWithResults = searchMetricsData.routes.filter(
      (route: { avg_results: number | null }) => route.avg_results !== null
    );
    if (routesWithResults.length === 0) return 0;
    return routesWithResults.reduce(
      (sum: number, route: { avg_results: number | null }) => sum + (route.avg_results || 0),
      0
    ) / routesWithResults.length;
  }, [searchMetricsData]);

  // Create search metrics from API data
  const searchMetrics: MetricData[] = [
    {
      title: "Total de Búsquedas",
      value: searchMetricsData?.total_searches?.toLocaleString() || "0",
      change: 0
    },
    {
      title: "Rutas Únicas",
      value: searchMetricsData?.total_routes?.toLocaleString() || "0",
      change: 0
    },
    {
      title: "Promedio de Resultados",
      value: avgResults > 0 ? avgResults.toFixed(0) : "0",
      change: 0
    },
    {
      title: "Items en Carrito",
      value: cartSummaryData?.total_additions?.toLocaleString() || "0",
      change: 0
    }
  ];

  // Create search metrics chart data - filter out routes with "None" origin/destination
  const searchChartData: ChartDataPoint[] = searchMetricsData?.routes
    ?.filter((route: { origin: string; destination: string }) => route.origin !== 'None' && route.destination !== 'None')
    ?.slice(0, 10)
    ?.map((route: { origin: string; destination: string; searches: number; avg_results: number | null }) => ({
      name: `${route.origin} → ${route.destination}`,
      value: route.searches,
      avg_results: route.avg_results || 0,
      searches: route.searches
    })) || [];

  // Create cart summary table data with formatted values
  const cartTableData: TableData[] = cartSummaryData?.cart_items?.map((item: { flightId: string | number; additions: number; last_added_at: string }) => ({
    flightId: item.flightId.toString(),
    additions: item.additions,
    last_added_at: new Date(item.last_added_at).toLocaleString('es-ES')
  })) || [];

  // Define table columns for cart summary
  const cartTableColumns: TableColumn[] = [
    { key: 'flightId', title: 'ID de Vuelo' },
    { key: 'additions', title: 'Agregados', render: (value: number) => value.toLocaleString() },
    { key: 'last_added_at', title: 'Última Adición' }
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
        <h2 className="section-title">Búsquedas por Ruta</h2>
        <ChartCard
          title="Búsquedas Realizadas por Ruta"
          data={searchChartData}
          type="bar"
          height={300}
          valueKey="value"
        />
      </section>

      {/* Cart Summary Table */}
      <section className="table-section">
        <h2 className="section-title">Resumen del Carrito de Búsqueda</h2>
        <DataTable
          title="Items Agregados al Carrito"
          data={cartTableData}
          columns={cartTableColumns}
        />
      </section>
    </div>
  );
};

export default SearchAnalytics;
