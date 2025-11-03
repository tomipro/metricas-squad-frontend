import React from 'react';
import { MetricCard, ChartCard } from '../Common';
import { MetricCardSkeleton, ChartCardSkeleton } from '../Skeletons';
import { useExecutiveSummary } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  MetricData, 
  ChartDataPoint
} from '../../types/dashboard';
import '../../components/LoadingStates.css';

interface ExecutiveSummaryProps extends ComponentProps {}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days for API calls
  const getDaysFromPeriod = (period: string): number => {
    return parseInt(period, 10) || 30; // Default to 30 days if parsing fails
  };

  const days = getDaysFromPeriod(selectedPeriod);
  
  // Use TanStack Query hooks for real-time data
  const {
    funnelData,
    averageFare,
    monthlyRevenue,
    revenuePerUser,
    paymentSuccess,
    anticipation,
    isLoading: apiLoading,
    isError: apiError
  } = useExecutiveSummary(days);

  // Transform API data to match component expectations with proper typing
  const realTimeMetrics: MetricData[] = [
    {
      title: "Valor Promedio de Reserva",
      value: `$${averageFare?.data?.avg_fare?.toFixed(0) || "0"}`,
      change: 0
    },
    {
      title: "Ingresos Mensuales",
      value: `$${monthlyRevenue?.data?.monthly?.reduce((sum: number, month: { revenue: number }) => sum + month.revenue, 0)?.toFixed(1) || "0"}M`,
      change: 0
    },
    {
      title: "Ingresos por Usuario",
      value: `$${revenuePerUser?.data?.revenue_per_user?.[0]?.revenue?.toFixed(0) || "0"}`,
      change: 0
    }
  ];

  // Create operational metrics from API data with proper typing
  const operationalMetrics: MetricData[] = [
    {
      title: "Tasa de Éxito de Pago",
      value: paymentSuccess?.data?.success_rate_percent?.toFixed(1) || "0.0",
      unit: "%",
      change: 0
    },
    {
      title: "Anticipación Promedio",
      value: `${anticipation?.data?.avg_anticipation_days?.toFixed(0) || "0"}`,
      unit: "days",
      change: 0
    }
  ];

  // Create revenue trend data from monthly revenue with proper typing
  const revenueTrendData: ChartDataPoint[] = monthlyRevenue?.data?.monthly?.map((month: { ym: string; revenue: number; payments: number }) => ({
    name: month.ym,
    value: month.revenue / 1000000, // Convert to millions
    revenue: month.revenue,
    payments: month.payments
  })) || [];

  // Create key engagement metrics
  const engagementKeyMetrics: MetricData[] = [
    {
      title: "Total de Búsquedas",
      value: (funnelData?.data?.searches || 0).toLocaleString('es-ES'),
      change: 0
    },
    {
      title: "Total de Reservas",
      value: (funnelData?.data?.reservations || 0).toLocaleString('es-ES'),
      change: 0
    },
    {
      title: "Total de Pagos",
      value: (funnelData?.data?.payments || 0).toLocaleString('es-ES'),
      change: 0
    }
  ];

  // Create conversion metrics chart data with percentage values
  const conversionChartData: ChartDataPoint[] = [
    {
      name: "Búsqueda → Reserva",
      value: parseFloat(funnelData?.data?.conversion?.search_to_reserve?.toFixed(2) || "0")
    },
    {
      name: "Reserva → Pago",
      value: parseFloat(funnelData?.data?.conversion?.reserve_to_pay?.toFixed(2) || "0")
    }
  ];

  // Key metric card (main one)
  const keyRevenueMetric: MetricData = {
    title: "Ingresos Mensuales",
    value: `$${monthlyRevenue?.data?.monthly?.reduce((sum: number, month: { revenue: number }) => sum + month.revenue, 0)?.toFixed(1) || "0"}M`,
    change: 0
  };

  // Show loading state with skeleton
  if (apiLoading) {
    return (
      <div className="tab-content">
        {/* Financial Performance Metrics Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Rendimiento Financiero</h2>
          <div className="grid grid-asymmetric-2">
            <MetricCardSkeleton count={1} />
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <MetricCardSkeleton count={2} />
            </div>
          </div>
        </section>

        {/* Revenue Trend Skeleton */}
        <section className="metrics-section">
          <div className="grid grid-cols-1">
            <ChartCardSkeleton height={400} type="line" />
          </div>
        </section>

        {/* Operational Excellence Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Excelencia Operacional</h2>
          <div className="grid grid-asymmetric-2">
            <MetricCardSkeleton count={1} />
            <ChartCardSkeleton height={180} type="bar" />
          </div>
        </section>

        {/* User Engagement Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Experiencia del Usuario</h2>
          <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
            <MetricCardSkeleton count={3} />
          </div>
          <div className="grid grid-cols-1">
            <ChartCardSkeleton height={200} type="barHorizontal" />
          </div>
        </section>
      </div>
    );
  }

  // Show error state
  if (apiError) {
    return (
      <div className="tab-content">
        <div className="error-container">
          <p>Error loading data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {/* Financial Performance Metrics - One featured card + chart combo */}
      <section className="metrics-section">
        <h2 className="section-title">Rendimiento Financiero</h2>
        <div className="grid grid-asymmetric-2">
          <MetricCard 
            metric={keyRevenueMetric}
            variant="featured"
            size="large"
          />
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <MetricCard 
              metric={realTimeMetrics[0]}
              variant="accent"
              size="medium"
            />
            <MetricCard 
              metric={realTimeMetrics[2]}
              variant="highlighted"
              size="medium"
            />
          </div>
        </div>
      </section>

      {/* Revenue Trend */}
      <section className="metrics-section">
        <div className="grid grid-cols-1">
          <ChartCard 
            title="Tendencia de Ingresos Mensuales ($M)"
            data={revenueTrendData}
            type="line"
            height={400}
            valueKey="value"
            color="#10B981"
          />
        </div>
      </section>

      {/* Operational Excellence - One card + chart */}
      <section className="metrics-section">
        <h2 className="section-title">Excelencia Operacional</h2>
        <div className="grid grid-asymmetric-2">
          <MetricCard 
            metric={operationalMetrics[0]}
            variant="highlighted"
            size="large"
          />
          <ChartCard 
            title="Anticipación Promedio"
            data={[{ name: 'Días', value: parseFloat(anticipation?.data?.avg_anticipation_days?.toFixed(0) || "0") }]}
            type="bar"
            height={180}
            valueKey="value"
            color="#66CED6"
          />
        </div>
      </section>

      {/* User Engagement - Key metrics + conversion chart */}
      <section className="metrics-section">
        <h2 className="section-title">Experiencia del Usuario</h2>
        <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
          {engagementKeyMetrics.map((metric, index) => (
            <MetricCard 
              key={`engagement-key-${index}`}
              metric={metric}
              variant={index === 0 ? 'featured' : index === 1 ? 'highlighted' : 'accent'}
              size="medium"
            />
          ))}
        </div>
        <div className="grid grid-cols-1">
          <ChartCard 
            title="Tasas de Conversión (%)"
            data={conversionChartData}
            type="barHorizontal"
            height={200}
            valueKey="value"
            color="#507BD8"
          />
        </div>
      </section>
    </div>
  );
};

export default ExecutiveSummary;
