import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ChartCard, DataTable } from '../Common';
import { ChartCardSkeleton, DataTableSkeleton } from '../Skeletons';
import { useAnalytics, useCatalogAirlineSummary } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  ChartDataPoint,
  TableColumn,
  TableData
} from '../../types/dashboard';
import '../../components/LoadingStates.css';

interface AnalyticsProps extends ComponentProps {}

const Analytics: React.FC<AnalyticsProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days for API calls
  const getDaysFromPeriod = (period: string): number => {
    return parseInt(period, 10) || 30; // Default to 30 days if parsing fails
  };

  const days = getDaysFromPeriod(selectedPeriod);
  
  // Use TanStack Query hooks for real-time data
  const {
    bookingHours,
    userOrigins,
    paymentSuccess,
    anticipation,
    isLoading: apiLoading,
    isError: apiError
  } = useAnalytics(days);

  // Get airline data from API
  const { data: catalogAirlineData, isLoading: catalogLoading, isError: catalogError } = useCatalogAirlineSummary(days, 'USD');
  
  const isLoading = apiLoading || catalogLoading;
  const isError = apiError || catalogError;

  // Create airline occupancy data from API - using market_share as occupancy percentage
  const allAirlineOccupancyData: ChartDataPoint[] = useMemo(() => {
    if (!catalogAirlineData?.airlines || catalogAirlineData.airlines.length === 0) {
      return [];
    }
    return catalogAirlineData.airlines.map((airline: { airline_code: string; airline_name: string; market_share: number }) => ({
      name: `${airline.airline_name} (${airline.airline_code})`,
      value: airline.market_share * 100, // Convert to percentage
      percentage: airline.market_share * 100,
      airlineCode: airline.airline_code,
      airlineName: airline.airline_name
    }));
  }, [catalogAirlineData]);

  // Initialize selected airlines with all airlines on first render
  const [selectedAirlines, setSelectedAirlines] = useState<Set<string>>(
    () => new Set()
  );

  // Update selected airlines when data is loaded
  useEffect(() => {
    if (allAirlineOccupancyData.length > 0 && selectedAirlines.size === 0) {
      setSelectedAirlines(new Set(allAirlineOccupancyData.map(item => item.name)));
    }
  }, [allAirlineOccupancyData, selectedAirlines.size]);

  // Create booking hours data from API with proper typing
  const bookingHoursData: ChartDataPoint[] = bookingHours?.data?.histogram?.map((item: { hour_utc: number; count: number }) => ({
    name: `${item.hour_utc}:00`,
    value: item.count,
    hour: item.hour_utc,
    count: item.count
  })) || [];

  // Helper function to group small countries into "Otros"
  const groupSmallCountries = (data: Array<{ country: string; users: number }>, topN: number = 8): ChartDataPoint[] => {
    if (!data || data.length === 0) return [];
    
    // Sort by users descending
    const sorted = [...data].sort((a, b) => b.users - a.users);
    
    // Take top N countries
    const topCountries = sorted.slice(0, topN);
    const others = sorted.slice(topN);
    
    // Calculate total for "Otros"
    const othersTotal = others.reduce((sum, item) => sum + item.users, 0);
    
    // Build result array
    const result: ChartDataPoint[] = topCountries.map((origin) => ({
      name: origin.country,
      value: origin.users,
      country: origin.country,
      users: origin.users
    }));
    
    // Add "Otros" if there are countries grouped
    if (othersTotal > 0) {
      result.push({
        name: 'Otros',
        value: othersTotal,
        country: 'Otros',
        users: othersTotal
      });
    }
    
    return result;
  };

  // Create user origins data from API with proper typing and grouping
  const allUserOriginsData: ChartDataPoint[] = useMemo(() => {
    return groupSmallCountries(
      userOrigins?.data?.user_origins || [],
      8
    );
  }, [userOrigins]);

  // Initialize selected origins with all origins on first render
  const [selectedOrigins, setSelectedOrigins] = useState<Set<string>>(
    () => new Set()
  );

  // Update selected origins when data is loaded
  useEffect(() => {
    if (allUserOriginsData.length > 0 && selectedOrigins.size === 0) {
      setSelectedOrigins(new Set(allUserOriginsData.map(item => item.name)));
    }
  }, [allUserOriginsData, selectedOrigins.size]);

  // Filter user origins data based on selection
  const userOriginsData: ChartDataPoint[] = useMemo(() => {
    if (selectedOrigins.size === 0) {
      return [];
    }
    return allUserOriginsData.filter(item => selectedOrigins.has(item.name));
  }, [selectedOrigins, allUserOriginsData]);

  // Create payment success data from API with proper typing
  const paymentSuccessData: ChartDataPoint[] = [
    {
      name: "Aprobado",
      value: paymentSuccess?.data?.approved || 0,
      count: paymentSuccess?.data?.approved || 0,
      color: "#2ECC71" // Verde
    },
    {
      name: "Rechazado",
      value: paymentSuccess?.data?.rejected || 0,
      count: paymentSuccess?.data?.rejected || 0,
      color: "#ff0000" // Rojo
    }
  ];

  // Create anticipation data from API with proper typing
  const anticipationData: ChartDataPoint[] = [
    {
      name: "Anticipación Promedio",
      value: anticipation?.data?.avg_anticipation_days || 0,
      days: anticipation?.data?.avg_anticipation_days || 0
    }
  ];

  // Filter data based on selected airlines
  const airlineOccupancyData: ChartDataPoint[] = useMemo(() => {
    if (selectedAirlines.size === 0) {
      return [];
    }
    return allAirlineOccupancyData.filter(item => selectedAirlines.has(item.name));
  }, [selectedAirlines, allAirlineOccupancyData]);

  // Create table data with selection state
  const airlineOccupancyTableData: TableData[] = useMemo(() => {
    return allAirlineOccupancyData.map(item => ({
      name: item.name,
      value: item.value,
      selected: selectedAirlines.has(item.name)
    }));
  }, [selectedAirlines, allAirlineOccupancyData]);

  // Toggle airline selection (memoized to prevent recreation)
  const toggleAirline = useCallback((airlineName: string) => {
    setSelectedAirlines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(airlineName)) {
        newSet.delete(airlineName);
      } else {
        newSet.add(airlineName);
      }
      return newSet;
    });
  }, []);

  // Select all airlines (memoized)
  const selectAllAirlines = useCallback(() => {
    setSelectedAirlines(new Set(allAirlineOccupancyData.map(item => item.name)));
  }, [allAirlineOccupancyData]);

  // Deselect all airlines (memoized)
  const deselectAllAirlines = useCallback(() => {
    setSelectedAirlines(new Set());
  }, []);

  // Toggle origin selection (memoized to prevent recreation)
  const toggleOrigin = useCallback((originName: string) => {
    setSelectedOrigins(prev => {
      const newSet = new Set(prev);
      if (newSet.has(originName)) {
        newSet.delete(originName);
      } else {
        newSet.add(originName);
      }
      return newSet;
    });
  }, []);

  // Select all origins (memoized)
  const selectAllOrigins = useCallback(() => {
    setSelectedOrigins(new Set(allUserOriginsData.map(item => item.name)));
  }, [allUserOriginsData]);

  // Deselect all origins (memoized)
  const deselectAllOrigins = useCallback(() => {
    setSelectedOrigins(new Set());
  }, []);

  // Create table data with selection state for user origins
  const userOriginsTableData: TableData[] = useMemo(() => {
    return allUserOriginsData.map(item => ({
      country: item.country || item.name,
      users: item.users || item.value,
      name: item.name,
      selected: selectedOrigins.has(item.name)
    }));
  }, [selectedOrigins, allUserOriginsData]);

  // Create columns for user origins table with proper typing (with checkbox)
  const userOriginsColumns: TableColumn[] = useMemo(() => [
    { 
      key: 'selected', 
      title: '', 
      render: (value: boolean, row?: TableData) => (
        <input
          type="checkbox"
          checked={value}
          onChange={() => toggleOrigin((row?.name as string) || '')}
          style={{ cursor: 'pointer' }}
        />
      )
    },
    { key: 'country', title: 'País' },
    { key: 'users', title: 'Usuarios', render: (value: number) => value.toLocaleString() }
  ], [toggleOrigin]);

  // Create columns for airline occupancy table with proper typing (with checkbox) - memoized
  const airlineOccupancyColumns: TableColumn[] = useMemo(() => [
    { 
      key: 'selected', 
      title: '', 
      render: (value: boolean, row?: TableData) => (
        <input
          type="checkbox"
          checked={value}
          onChange={() => toggleAirline((row?.name as string) || '')}
          style={{ cursor: 'pointer' }}
        />
      )
    },
    { key: 'name', title: 'Aerolínea' },
    { key: 'value', title: 'Ocupación (%)', render: (value: number) => `${value.toFixed(1)}%` }
  ], [toggleAirline]);

  // Show loading state with skeleton
  if (isLoading) {
    return (
      <div className="tab-content">
        {/* User Activity Analysis Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Comportamiento del Usuario</h2>
          <ChartCardSkeleton height={300} type="bar" />
        </section>

        {/* Payment Success Analysis Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Éxito de Pago</h2>
          <div className="grid grid-cols-1">
            <ChartCardSkeleton height={300} type="pie" />
          </div>
        </section>

        {/* User Origins Analysis Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Orígenes del Usuario</h2>
          <div className="grid grid-cols-2">
            <ChartCardSkeleton height={400} type="barHorizontal" />
            <DataTableSkeleton rows={10} columns={3} />
          </div>
        </section>

        {/* Anticipation Analysis Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Anticipación de Reserva</h2>
          <div className="grid grid-cols-1">
            <ChartCardSkeleton height={300} type="bar" />
          </div>
        </section>

        {/* Airline Occupancy Analysis Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Porcentaje de Ocupación por Aerolínea</h2>
          <div className="grid grid-cols-2">
            <ChartCardSkeleton height={300} type="bar" />
            <DataTableSkeleton rows={6} columns={3} />
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
          <p>Error loading analytics data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {/* User Activity Analysis */}
      <section className="metrics-section">
        <h2 className="section-title">Comportamiento del Usuario</h2>
        <ChartCard 
          title="Actividad de Reserva por Hora (UTC)"
          data={bookingHoursData}
          type="bar"
          height={300}
          valueKey="value"
          color="#34D399"
        />
      </section>

      {/* Payment Success Analysis */}
      <section className="metrics-section">
        <h2 className="section-title">Éxito de Pago</h2>
        <div className="grid grid-cols-1">
          <ChartCard 
            title="Tasa de Éxito de Pago"
            data={paymentSuccessData}
            type="pie"
            height={300}
            valueKey="value"
          />
        </div>
      </section>

      {/* User Origins Analysis */}
      <section className="metrics-section">
        <h2 className="section-title">Orígenes del Usuario</h2>
        <div className="grid grid-cols-2">
          {allUserOriginsData.length === 0 ? (
            <ChartCard 
              title="Orígenes del Usuario por País"
              data={[]}
              type="barHorizontal"
              height={350}
              valueKey="value"
              nameKey="name"
              color="#507BD8"
            />
          ) : userOriginsData.length > 0 ? (
            <ChartCard 
              title="Orígenes del Usuario por País"
              data={userOriginsData}
              type="barHorizontal"
              height={Math.max(350, Math.min(600, userOriginsData.length * 45))}
              valueKey="value"
              nameKey="name"
              color="#507BD8"
            />
          ) : (
            <div className="chart-card card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Selecciona países para mostrar en el gráfico</p>
            </div>
          )}
          <DataTable 
            title="Top Orígenes del Usuario"
            data={userOriginsTableData}
            columns={userOriginsColumns}
            maxRows={10}
          />
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={selectAllOrigins}
            disabled={allUserOriginsData.length === 0}
            style={{
              padding: '0.5rem 1rem',
              background: allUserOriginsData.length === 0 ? '#D1D5DB' : '#507BD8',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: allUserOriginsData.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background 0.2s ease',
              opacity: allUserOriginsData.length === 0 ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (allUserOriginsData.length > 0) {
                e.currentTarget.style.background = '#4169c4';
              }
            }}
            onMouseOut={(e) => {
              if (allUserOriginsData.length > 0) {
                e.currentTarget.style.background = '#507BD8';
              }
            }}
          >
            Seleccionar Todos
          </button>
          <button
            onClick={deselectAllOrigins}
            disabled={allUserOriginsData.length === 0}
            style={{
              padding: '0.5rem 1rem',
              background: allUserOriginsData.length === 0 ? '#D1D5DB' : '#E5E7EB',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: allUserOriginsData.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background 0.2s ease',
              opacity: allUserOriginsData.length === 0 ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (allUserOriginsData.length > 0) {
                e.currentTarget.style.background = '#D1D5DB';
              }
            }}
            onMouseOut={(e) => {
              if (allUserOriginsData.length > 0) {
                e.currentTarget.style.background = '#E5E7EB';
              }
            }}
          >
            Deseleccionar Todos
          </button>
        </div>
      </section>

      {/* Anticipation Analysis */}
      <section className="metrics-section">
        <h2 className="section-title">Anticipación de Reserva</h2>
        <div className="grid grid-cols-1">
          <ChartCard 
            title="Anticipación Promedio de Reserva (Días)"
            data={anticipationData}
            type="bar"
            height={300}
            valueKey="value"
            color="#F59E0B"
          />
        </div>
      </section>

      {/* Airline Occupancy Analysis */}
      <section className="metrics-section">
        <h2 className="section-title">Porcentaje de Ocupación por Aerolínea</h2>
        <div className="grid grid-cols-2">
          {allAirlineOccupancyData.length === 0 ? (
            <ChartCard 
              title="Ocupación de Aviones por Aerolínea (%)"
              data={[]}
              type="bar"
              height={300}
              valueKey="value"
              color="#8B5CF6"
            />
          ) : airlineOccupancyData.length > 0 ? (
            <ChartCard 
              title="Ocupación de Aviones por Aerolínea (%)"
              data={airlineOccupancyData}
              type="bar"
              height={300}
              valueKey="value"
              color="#8B5CF6"
            />
          ) : (
            <div className="chart-card card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Selecciona aerolíneas para mostrar en el gráfico</p>
            </div>
          )}
          <DataTable 
            title="Detalle de Ocupación por Aerolínea"
            data={airlineOccupancyTableData}
            columns={airlineOccupancyColumns}
            maxRows={10}
          />
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={selectAllAirlines}
            disabled={allAirlineOccupancyData.length === 0}
            style={{
              padding: '0.5rem 1rem',
              background: allAirlineOccupancyData.length === 0 ? '#D1D5DB' : '#507BD8',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: allAirlineOccupancyData.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background 0.2s ease',
              opacity: allAirlineOccupancyData.length === 0 ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (allAirlineOccupancyData.length > 0) {
                e.currentTarget.style.background = '#4169c4';
              }
            }}
            onMouseOut={(e) => {
              if (allAirlineOccupancyData.length > 0) {
                e.currentTarget.style.background = '#507BD8';
              }
            }}
          >
            Seleccionar Todos
          </button>
          <button
            onClick={deselectAllAirlines}
            disabled={allAirlineOccupancyData.length === 0}
            style={{
              padding: '0.5rem 1rem',
              background: allAirlineOccupancyData.length === 0 ? '#D1D5DB' : '#E5E7EB',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              cursor: allAirlineOccupancyData.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background 0.2s ease',
              opacity: allAirlineOccupancyData.length === 0 ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (allAirlineOccupancyData.length > 0) {
                e.currentTarget.style.background = '#D1D5DB';
              }
            }}
            onMouseOut={(e) => {
              if (allAirlineOccupancyData.length > 0) {
                e.currentTarget.style.background = '#E5E7EB';
              }
            }}
          >
            Deseleccionar Todos
          </button>
        </div>
      </section>
    </div>
  );
};

export default Analytics;