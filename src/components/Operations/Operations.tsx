import React from 'react';
import { MetricCard } from '../Common';
import { MetricCardSkeleton } from '../Skeletons';
import { useOperations } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  MetricData
} from '../../types/dashboard';
import '../../components/LoadingStates.css';

interface OperationsProps extends ComponentProps {}

const Operations: React.FC<OperationsProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days for API calls
  const getDaysFromPeriod = (period: string): number => {
    return parseInt(period, 10) || 30; // Default to 30 days if parsing fails
  };

  const days = getDaysFromPeriod(selectedPeriod);
  
  // Use TanStack Query hooks for real-time data
  const {
    funnelData,
    paymentSuccess,
    cancellationRate,
    isLoading: apiLoading,
    isError: apiError
  } = useOperations(days);

  // Transform API data to match component expectations with proper typing
  const realTimeOperationalMetrics: MetricData[] = [
    {
      title: "Búsqueda → Reserva",
      value: funnelData?.data?.conversion?.search_to_reserve?.toFixed(1) || "0.0",
      unit: "%",
      change: 0
    },
    {
      title: "Tasa de Éxito de Pago",
      value: paymentSuccess?.data?.success_rate_percent?.toFixed(1) || "0.0",
      unit: "%",
      change: 0
    }
  ];

  const realTimeFlightMetrics: MetricData[] = [
    {
      title: "Tasa de Cancelación",
      value: cancellationRate?.data?.cancellation_rate_percent?.toFixed(1) || "0.0",
      unit: "%",
      change: 0
    }
  ];


  // Show loading state with skeleton
  if (apiLoading) {
    return (
      <div className="tab-content">
        {/* Booking System Performance Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Rendimiento del Sistema</h2>
          <div className="grid grid-cols-2">
            <MetricCardSkeleton count={2} />
          </div>
        </section>

        {/* Flight Operations Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Operaciones de Vuelo</h2>
          <div className="grid grid-cols-1">
            <MetricCardSkeleton count={1} />
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
          <p>Error loading operations data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {/* Booking System Performance */}
      <section className="metrics-section">
        <h2 className="section-title">Rendimiento del Sistema</h2>
        <div className="grid grid-cols-2">
          {realTimeOperationalMetrics.map((metric, index) => (
            <MetricCard key={`operational-${index}`} metric={metric} />
          ))}
        </div>
      </section>

      {/* Flight Operations */}
      <section className="metrics-section">
        <h2 className="section-title">Operaciones de Vuelo</h2>
        <div className="grid grid-cols-1">
          {realTimeFlightMetrics.map((metric, index) => (
            <MetricCard key={`flight-${index}`} metric={metric} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Operations;
