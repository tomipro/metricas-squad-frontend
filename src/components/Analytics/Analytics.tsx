import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ChartCard, DataTable } from '../Common';
import { ChartCardSkeleton, DataTableSkeleton } from '../Skeletons';
import { useAnalytics } from '../../hooks/useAnalytics';
import { 
  ComponentProps, 
  ChartDataPoint,
  TableColumn,
  TableData
} from '../../types/dashboard';
import { getDaysFromPeriod } from '../../utils/periodUtils';
import '../../components/LoadingStates.css';

interface AnalyticsProps extends ComponentProps {}

const Analytics: React.FC<AnalyticsProps> = ({ selectedPeriod }) => {
  // Convert selectedPeriod to days for API calls
  const days = getDaysFromPeriod(selectedPeriod);
  
  // Use TanStack Query hooks for real-time data
  const {
    bookingHours,
    userOrigins,
    paymentSuccess,
    isLoading: apiLoading,
    isError: apiError
  } = useAnalytics(days);

  const isLoading = apiLoading;
  const isError = apiError;

  // Create booking hours data from API with proper typing
  const bookingHoursData: ChartDataPoint[] = bookingHours?.data?.histogram?.map((item: { hour_utc: number; count: number }) => ({
    name: `${item.hour_utc}:00`,
    value: item.count,
    hour: item.hour_utc,
    count: item.count
  })) || [];

  const normalizeCountryKey = (country: string): string => {
    return (country || '')
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  const aggregatedUserOrigins = useMemo(() => {
    const raw = userOrigins?.data?.user_origins || [];
    const map = new Map<string, { country: string; users: number }>();

    raw.forEach((item: { country: string; users: number }) => {
      const name = item?.country?.trim() || 'N/D';
      const key = normalizeCountryKey(name);
      const users = item?.users || 0;
      const current = map.get(key);

      if (current) {
        current.users += users;
        // Prefer the longest (often accented/proper) name as display
        if (name.length > current.country.length) {
          current.country = name;
        }
        map.set(key, current);
      } else {
        map.set(key, { country: name, users });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.users - a.users);
  }, [userOrigins]);

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
    return groupSmallCountries(aggregatedUserOrigins, 8);
  }, [aggregatedUserOrigins]);

  // Initialize selected origins with all origins on first render
  const [selectedOrigins, setSelectedOrigins] = useState<Set<string>>(
    () => new Set()
  );

  // Update selected origins when data is loaded
  useEffect(() => {
    if (aggregatedUserOrigins.length > 0 && selectedOrigins.size === 0) {
      setSelectedOrigins(new Set(aggregatedUserOrigins.map(item => item.country)));
    }
  }, [aggregatedUserOrigins, selectedOrigins.size]);

  // Filter user origins data based on selection
  const filteredOrigins = useMemo(() => {
    if (selectedOrigins.size === 0) {
      return [];
    }
    return aggregatedUserOrigins.filter(item => selectedOrigins.has(item.country));
  }, [selectedOrigins, aggregatedUserOrigins]);

  const userOriginsData: ChartDataPoint[] = useMemo(() => {
    return groupSmallCountries(filteredOrigins, 8);
  }, [filteredOrigins]);

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
    },
    {
      name: "Reembolso",
      value: paymentSuccess?.data?.refunded || 0,
      count: paymentSuccess?.data?.refunded || 0,
      color: "#F39C12" // Naranja
    }
  ];




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
    setSelectedOrigins(new Set(aggregatedUserOrigins.map(item => item.country)));
  }, [aggregatedUserOrigins]);

  // Deselect all origins (memoized)
  const deselectAllOrigins = useCallback(() => {
    setSelectedOrigins(new Set());
  }, []);

  // Create table data with selection state for user origins
  const userOriginsTableData: TableData[] = useMemo(() => {
    return aggregatedUserOrigins.map(item => ({
      country: item.country,
      users: item.users,
      name: item.country,
      selected: selectedOrigins.has(item.country)
    }));
  }, [selectedOrigins, aggregatedUserOrigins]);

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

    </div>
  );
};

export default Analytics;
