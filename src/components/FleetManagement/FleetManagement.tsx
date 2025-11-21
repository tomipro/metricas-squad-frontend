import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MetricCard, ChartCard, DataTable } from '../Common';
import { MetricCardSkeleton, ChartCardSkeleton, DataTableSkeleton } from '../Skeletons';
import { useCatalogAirlineSummary, useAirlinesCapacity } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  MetricData, 
  ChartDataPoint,
  TableColumn,
  TableData
} from '../../types/dashboard';
import { resolveAirlineInfo, resolveAirlineName } from '../../utils/airlineName';
import '../../components/LoadingStates.css';

import { getDaysFromPeriod } from '../../utils/periodUtils';

interface FleetManagementProps extends ComponentProps {}

const FleetManagement: React.FC<FleetManagementProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days for API calls
  const days = getDaysFromPeriod(selectedPeriod);
  
  // Use TanStack Query hooks for real-time data
  const { data: catalogAirlineData, isLoading: catalogLoading, isError: catalogError } = useCatalogAirlineSummary(days, 'USD');
  const { data: airlinesCapacityData, isLoading: capacityLoading, isError: capacityError } = useAirlinesCapacity(days);
  
  const isLoading = catalogLoading || capacityLoading;
  const isError = catalogError || capacityError;

  // Helper function to get airline name from code (memoized)
  const getAirlineName = useCallback((airlineCode: string): string => {
    return resolveAirlineName(airlineCode);
  }, []);

  const normalizeAircraftType = (type: string): string => {
    const cleaned = type?.trim();
    if (!cleaned) return '';
    const upper = cleaned.toUpperCase();
    if (upper === 'BOEING 737') return 'B737';
    if (upper === 'E109') return 'E190';
    return upper;
  };

  // Aggregate airlines by resolved airline (prefix) to avoid duplicated rows per flight code
  const aggregatedAirlines = useMemo(() => {
    if (!airlinesCapacityData?.airlines) {
      return [];
    }

    const map = new Map<string, {
      airlineCode: string;
      airlineName: string;
      flights: number;
      totalCapacity: number;
      seatsSold: number;
      aircraftTypes: Set<string>;
    }>();

    airlinesCapacityData.airlines.forEach((airline) => {
      const { code, name } = resolveAirlineInfo(airline.airline);
      const key = code || name;

      const current = map.get(key) || {
        airlineCode: code,
        airlineName: name,
        flights: 0,
        totalCapacity: 0,
        seatsSold: 0,
        aircraftTypes: new Set<string>(),
      };

      current.flights += airline.flights ?? 0;
      current.totalCapacity += airline.total_capacity ?? 0;
      current.seatsSold += airline.seats_sold ?? 0;

      if (airline.aircraft_types) {
        airline.aircraft_types
          .split(',')
          .map(type => normalizeAircraftType(type))
          .filter(Boolean)
          .forEach(type => current.aircraftTypes.add(type));
      }

      map.set(key, current);
    });

    return Array.from(map.values()).map(item => ({
      airlineCode: item.airlineCode,
      airlineName: item.airlineName,
      flights: item.flights,
      totalCapacity: item.totalCapacity,
      seatsSold: item.seatsSold,
      occupancyPercent: item.totalCapacity > 0 ? Math.round((item.seatsSold / item.totalCapacity) * 10000) / 100 : 0,
      aircraftTypes: Array.from(item.aircraftTypes).join(', ') || 'N/D'
    }));
  }, [airlinesCapacityData]);

  // Aggregate catalog airlines by resolved name to avoid duplicate rows per flight code
  const aggregatedCatalogAirlines = useMemo(() => {
    if (!catalogAirlineData?.airlines || catalogAirlineData.airlines.length === 0) {
      return [];
    }
    const map = new Map<string, { airlineName: string; airlineCodes: Set<string>; flights: number; revenue: number; avgPrice: number }>();

    catalogAirlineData.airlines.forEach((airline: { airline: string; flights: number; avg_price: number }) => {
      const { name } = resolveAirlineInfo(airline.airline);
      const key = name || airline.airline;
      const current = map.get(key) || { airlineName: name, airlineCodes: new Set<string>(), flights: 0, revenue: 0, avgPrice: 0 };
      current.airlineCodes.add(airline.airline);
      current.flights += airline.flights || 0;
      current.revenue += (airline.flights || 0) * (airline.avg_price || 0);
      map.set(key, current);
    });

    return Array.from(map.values()).map(item => ({
      airlineName: item.airlineName,
      airlineCodes: Array.from(item.airlineCodes).join(', '),
      flights: item.flights,
      avgPrice: item.flights > 0 ? item.revenue / item.flights : 0,
      revenue: item.revenue
    }));
  }, [catalogAirlineData]);

  // Merge catalog pricing info onto capacity aggregation to keep counts consistent
  const mergedAirlineMetrics = useMemo(() => {
    const catalogMap = new Map(
      aggregatedCatalogAirlines.map(item => [item.airlineName, item])
    );

    const merged = aggregatedAirlines.map(cap => {
      const catalog = catalogMap.get(cap.airlineName);
      const flights = cap.flights || catalog?.flights || 0;
      const avgPrice = catalog?.avgPrice ?? 0;
      const revenue = avgPrice * flights;

      return {
        airlineName: cap.airlineName,
        airlineCodes: catalog?.airlineCodes || cap.airlineCode,
        flights,
        avgPrice,
        revenue,
        totalCapacity: cap.totalCapacity ?? 0,
        seatsSold: cap.seatsSold ?? 0,
        occupancyPercent: cap.occupancyPercent ?? 0,
        aircraftTypes: cap.aircraftTypes,
      };
    });

    // Include any catalog-only airlines not present in capacity (unlikely but safe)
    aggregatedCatalogAirlines.forEach(catalog => {
      if (!merged.find(item => item.airlineName === catalog.airlineName)) {
        merged.push({
          airlineName: catalog.airlineName,
          airlineCodes: catalog.airlineCodes,
          flights: catalog.flights,
          avgPrice: catalog.avgPrice,
          revenue: catalog.revenue,
          totalCapacity: 0,
          seatsSold: 0,
          occupancyPercent: 0,
          aircraftTypes: 'N/D',
        });
      }
    });

    return merged;
  }, [aggregatedAirlines, aggregatedCatalogAirlines]);

  const topAirlineByCapacity = useMemo(() => {
    if (!aggregatedAirlines.length) return null;
    return [...aggregatedAirlines].sort((a, b) => {
      const capDiff = (b.totalCapacity ?? 0) - (a.totalCapacity ?? 0);
      if (capDiff !== 0) return capDiff;
      return (b.seatsSold ?? 0) - (a.seatsSold ?? 0);
    })[0];
  }, [aggregatedAirlines]);

  // Create fleet metrics from API data with proper typing
  const fleetMetrics: MetricData[] = [
    {
      title: "Total de Aerolíneas",
      value: mergedAirlineMetrics.length.toString() || "0",
      change: 0
    },
    {
      title: "Total de Vuelos",
      value: mergedAirlineMetrics.reduce((sum, item) => sum + (item.flights || 0), 0).toLocaleString(),
      change: 0
    },
    {
      title: "Ingresos Potenciales",
      value: `${catalogAirlineData?.currency || 'USD'} ${mergedAirlineMetrics.reduce((sum, airline) => {
        return sum + (airline.totalCapacity ?? 0) * (airline.avgPrice ?? 0);
      }, 0).toLocaleString()}`,
      change: 0
    },
    {
      title: "Aerolínea Principal",
      value: topAirlineByCapacity?.airlineName || "N/A",
      change: 0
    }
  ];

  // Create popular airlines chart data from aggregated catalogAirlines
  const popularAirlinesChartData: ChartDataPoint[] = useMemo(() => {
    return mergedAirlineMetrics.map((airline) => ({
      name: airline.airlineName,
      value: airline.flights,
      avgPrice: airline.avgPrice,
      count: airline.flights
    }));
  }, [mergedAirlineMetrics]);

  // Create airline details table data from aggregated catalogAirlines
  const airlineDetailsData: TableData[] = useMemo(() => {
    return mergedAirlineMetrics.map((airline) => ({
      airlineCode: airline.airlineCodes || airline.airlineName,
      airlineName: airline.airlineName,
      bookings: airline.flights,
      avgPrice: airline.avgPrice,
      revenue: airline.revenue
    }));
  }, [mergedAirlineMetrics]);

  // Create columns for airline details table with proper typing
  const airlineColumns: TableColumn[] = [
    { key: 'airlineName', title: 'Aerolínea' },
    { key: 'airlineCode', title: 'Código' },
    { key: 'bookings', title: 'Vuelos', render: (value: number) => value.toLocaleString() },
    { key: 'avgPrice', title: 'Precio Promedio', render: (value: number) => `$${value.toFixed(0)}` },
    { key: 'revenue', title: 'Ingresos', render: (value: number) => `$${value.toLocaleString()}` }
  ];

  // Create airline capacity data from new endpoint
  const airlineCapacityChartData: ChartDataPoint[] = useMemo(() => {
    return [...aggregatedAirlines]
      .sort((a, b) => b.totalCapacity - a.totalCapacity)
      .map((airline) => ({
        name: airline.airlineName,
        value: airline.totalCapacity ?? 0,
        flights: airline.flights ?? 0,
        seatsSold: airline.seatsSold ?? 0,
        occupancy: airline.occupancyPercent ?? 0,
        aircraftTypes: airline.aircraftTypes
      }));
  }, [aggregatedAirlines]);

  const capacityChartHeight = Math.max(
    400,
    Math.min(600, Math.max(1, airlineCapacityChartData.length) * 60)
  );

  // Table for capacity and aircraft mix per airline
  const airlineCapacityTableData: TableData[] = useMemo(() => {
    return aggregatedAirlines.map((airline) => ({
      airlineName: airline.airlineName,
      airlineCode: airline.airlineCode,
      flights: airline.flights,
      totalCapacity: airline.totalCapacity ?? 0,
      aircraftTypes: airline.aircraftTypes,
      seatsSold: airline.seatsSold ?? 0,
      occupancyPercent: airline.occupancyPercent ?? 0
    }));
  }, [aggregatedAirlines]);

  // Columns for airline capacity table
  const airlineCapacityColumns: TableColumn[] = [
    { key: 'airlineName', title: 'Aerolínea' },
    { key: 'airlineCode', title: 'Código' },
    { key: 'flights', title: 'Vuelos', render: (value: number | null) => (value ?? 0).toLocaleString() },
    { key: 'totalCapacity', title: 'Capacidad Publicada', render: (value: number | null) => (value ?? 0).toLocaleString() },
    { key: 'aircraftTypes', title: 'Modelos' }
  ];

  // Create airline occupancy data from capacity endpoint (aggregated by airline)
  const allAirlineOccupancyData: ChartDataPoint[] = useMemo(() => {
    if (aggregatedAirlines.length === 0) {
      return [];
    }
    return aggregatedAirlines.map((airline) => ({
      name: airline.airlineName,
      value: airline.occupancyPercent ?? 0,
      percentage: airline.occupancyPercent ?? 0,
      airlineCode: airline.airlineCode,
      airlineName: airline.airlineName,
      flights: airline.flights ?? 0,
      seatsSold: airline.seatsSold ?? 0,
      totalCapacity: airline.totalCapacity ?? 0,
      aircraftTypes: airline.aircraftTypes
    }));
  }, [aggregatedAirlines]);

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
      value: item.value ?? 0,
      seatsSold: item.seatsSold || 0,
      totalCapacity: item.totalCapacity || 0,
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
    { key: 'value', title: 'Ocupación (%)', render: (value: number | null) => `${(value ?? 0).toFixed(2)}%` },
    { key: 'seatsSold', title: 'Asientos Vendidos', render: (value: number | null) => (value ?? 0).toLocaleString() },
    { key: 'totalCapacity', title: 'Capacidad Publicada', render: (value: number | null) => (value ?? 0).toLocaleString() }
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
            <DataTableSkeleton rows={6} columns={5} />
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
            data={airlineCapacityChartData}
            type="barHorizontal"
            height={capacityChartHeight}
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
            data={airlineCapacityTableData}
            columns={airlineCapacityColumns}
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
