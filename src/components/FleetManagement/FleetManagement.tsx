import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MetricCard, ChartCard, DataTable } from '../Common';
import { MetricCardSkeleton, ChartCardSkeleton, DataTableSkeleton } from '../Skeletons';
import { useCatalogAirlineSummary, useFlightsAircraft } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  MetricData, 
  ChartDataPoint,
  TableColumn,
  TableData
} from '../../types/dashboard';
import airlineNames from '../../data/airlineNames.json';
import '../../components/LoadingStates.css';

interface FleetManagementProps extends ComponentProps {}

const FleetManagement: React.FC<FleetManagementProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days for API calls
  const getDaysFromPeriod = (period: string): number => {
    return parseInt(period, 10) || 30; // Default to 30 days if parsing fails
  };

  const days = getDaysFromPeriod(selectedPeriod);
  
  // Use TanStack Query hooks for real-time data
  const { data: catalogAirlineData, isLoading: catalogLoading, isError: catalogError } = useCatalogAirlineSummary(days, 'USD');
  const { data: flightsAircraftData, isLoading: aircraftLoading, isError: aircraftError } = useFlightsAircraft(days);
  
  const isLoading = catalogLoading || aircraftLoading;
  const isError = catalogError || aircraftError;

  // Helper function to get airline name from code (memoized)
  const getAirlineName = useCallback((airlineCode: string): string => {
    return (airlineNames as Record<string, string>)[airlineCode] || airlineCode;
  }, []);

  // Create fleet metrics from API data with proper typing
  const fleetMetrics: MetricData[] = [
    {
      title: "Total de Aerolíneas",
      value: catalogAirlineData?.airlines?.length?.toString() || "0",
      change: 0
    },
    {
      title: "Total de Vuelos",
      value: catalogAirlineData?.total_flights?.toLocaleString() || "0",
      change: 0
    },
    {
      title: "Ingresos Totales",
      value: `${catalogAirlineData?.currency || 'USD'} ${catalogAirlineData?.airlines?.reduce((sum: number, airline: { flights: number; avg_price: number }) => sum + (airline.flights * airline.avg_price), 0)?.toLocaleString() || "0"}`,
      change: 0
    },
    {
      title: "Aerolínea Principal",
      value: catalogAirlineData?.airlines?.[0] ? getAirlineName(catalogAirlineData.airlines[0].airline) : "N/A",
      change: 0
    }
  ];

  // Create popular airlines chart data from catalogAirlineData with proper typing
  const popularAirlinesChartData: ChartDataPoint[] = useMemo(() => {
    if (!catalogAirlineData?.airlines || catalogAirlineData.airlines.length === 0) {
      return [];
    }
    return catalogAirlineData.airlines.map((airline: { airline: string; flights: number; avg_price: number }) => ({
      name: getAirlineName(airline.airline),
      value: airline.flights,
      avgPrice: airline.avg_price,
      count: airline.flights,
      airlineCode: airline.airline
    }));
  }, [catalogAirlineData, getAirlineName]);

  // Create airline details table data from catalogAirlineData with proper typing
  const airlineDetailsData: TableData[] = useMemo(() => {
    if (!catalogAirlineData?.airlines || catalogAirlineData.airlines.length === 0) {
      return [];
    }
    return catalogAirlineData.airlines.map((airline: { airline: string; flights: number; avg_price: number }) => ({
      airlineCode: airline.airline,
      airlineName: getAirlineName(airline.airline),
      bookings: airline.flights,
      avgPrice: airline.avg_price,
      revenue: airline.flights * airline.avg_price
    }));
  }, [catalogAirlineData, getAirlineName]);

  // Create columns for airline details table with proper typing
  const airlineColumns: TableColumn[] = [
    { key: 'airlineName', title: 'Aerolínea' },
    { key: 'airlineCode', title: 'Código' },
    { key: 'bookings', title: 'Vuelos', render: (value: number) => value.toLocaleString() },
    { key: 'avgPrice', title: 'Precio Promedio', render: (value: number) => `$${value.toFixed(0)}` },
    { key: 'revenue', title: 'Ingresos', render: (value: number) => `$${value.toLocaleString()}` }
  ];

  // Create aircraft data from API
  const aircraftData: TableData[] = flightsAircraftData?.aircraft?.map((aircraft: any) => ({
    airline_brand: aircraft.airlineBrand,
    aircraft_id: aircraft.aircraftId,
    capacity: aircraft.capacity,
    updates: aircraft.updates
  })) || [];

  // Create columns for aircraft table
  const aircraftColumns: TableColumn[] = [
    { key: 'airline_brand', title: 'Aerolínea' },
    { key: 'aircraft_id', title: 'Modelo de Aeronave' },
    { key: 'capacity', title: 'Capacidad', render: (value: number) => value.toLocaleString() },
    { key: 'updates', title: 'Actualizaciones', render: (value: number) => value.toLocaleString() }
  ];

  // Create aircraft chart data by airline
  const aircraftChartData: ChartDataPoint[] = flightsAircraftData?.aircraft?.slice(0, 10).map((aircraft: any) => ({
    name: `${aircraft.airlineBrand} - ${aircraft.aircraftId}`,
    value: aircraft.capacity,
    updates: aircraft.updates
  })) || [];

  // Create airline occupancy data from API - calculate percentage based on flights
  const allAirlineOccupancyData: ChartDataPoint[] = useMemo(() => {
    if (!catalogAirlineData?.airlines || catalogAirlineData.airlines.length === 0 || !catalogAirlineData.total_flights) {
      return [];
    }
    const totalFlights = catalogAirlineData.total_flights;
    return catalogAirlineData.airlines.map((airline: { airline: string; flights: number; avg_price: number }) => {
      const percentage = totalFlights > 0 ? (airline.flights / totalFlights) * 100 : 0;
      const airlineName = getAirlineName(airline.airline);
      return {
        name: `${airlineName} (${airline.airline})`,
        value: percentage,
        percentage: percentage,
        airlineCode: airline.airline,
        airlineName: airlineName,
        flights: airline.flights,
        avgPrice: airline.avg_price
      };
    });
  }, [catalogAirlineData, getAirlineName]);

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
        {/* Fleet Performance Metrics Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Rendimiento de la Flota</h2>
          <div className="grid grid-cols-4">
            <MetricCardSkeleton count={4} />
          </div>
        </section>

        {/* Popular Airlines Distribution Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Distribución de Aerolíneas Populares</h2>
          <div className="grid grid-cols-1">
            <ChartCardSkeleton height={400} type="pie" />
          </div>
        </section>

        {/* Airline Performance Details Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Detalles de Rendimiento de Aerolíneas</h2>
          <div className="grid grid-cols-1">
            <DataTableSkeleton rows={10} columns={4} />
          </div>
        </section>

        {/* Aircraft Capacity Chart Skeleton */}
        <section className="metrics-section">
          <h2 className="section-title">Capacidad por Aeronave</h2>
          <div className="grid grid-cols-1">
            <ChartCardSkeleton height={400} type="barHorizontal" />
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
          <p>Error loading fleet data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      {/* Fleet Performance Metrics */}
      <section className="metrics-section">
        <h2 className="section-title">Rendimiento de la Flota</h2>
        <div className="grid grid-cols-4">
          {fleetMetrics.map((metric, index) => (
            <MetricCard key={`fleet-metric-${index}`} metric={metric} />
          ))}
        </div>
      </section>

      {/* Popular Airlines Distribution */}
      <section className="metrics-section">
        <h2 className="section-title">Distribución de Aerolíneas Populares</h2>
        <div className="grid grid-cols-1">
          <ChartCard 
            title="Aerolíneas por Volumen de Reservas"
            data={popularAirlinesChartData}
            type="pie"
            height={400}
            valueKey="value"
          />
        </div>
      </section>

      {/* Airline Performance Details */}
      <section className="metrics-section">
        <h2 className="section-title">Detalles de Rendimiento de Aerolíneas</h2>
        <div className="grid grid-cols-1">
          <DataTable 
            title="Métricas de Rendimiento de Aerolíneas"
            data={airlineDetailsData}
            columns={airlineColumns}
            maxRows={10}
          />
        </div>
      </section>

      {/* Average Price Analysis */}
      <section className="metrics-section">
        <h2 className="section-title">Análisis de Precios Promedio</h2>
        <div className="grid grid-cols-1">
          <ChartCard 
            title="Precios Promedio por Aerolínea"
            data={popularAirlinesChartData}
            type="bar"
            height={300}
            valueKey="avgPrice"
            color="#10B981"
          />
        </div>
      </section>

      {/* Aircraft Capacity Chart */}
      <section className="metrics-section">
        <h2 className="section-title">Capacidad por Aeronave</h2>
        <div className="grid grid-cols-1">
          <ChartCard 
            title="Capacidad de Aeronaves por Aerolínea"
            data={aircraftChartData}
            type="barHorizontal"
            height={Math.max(400, Math.min(600, aircraftChartData.length * 50))}
            valueKey="value"
            nameKey="name"
            color="#507BD8"
          />
        </div>
      </section>

      {/* Aircraft Details */}
      <section className="metrics-section">
        <h2 className="section-title">Detalles de Aeronaves</h2>
        <div className="grid grid-cols-1">
          <DataTable 
            title="Información de Aeronaves por Aerolínea"
            data={aircraftData}
            columns={aircraftColumns}
            maxRows={15}
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

export default FleetManagement;