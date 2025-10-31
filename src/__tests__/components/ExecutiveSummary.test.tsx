// Tests for ExecutiveSummary component
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExecutiveSummary from '../../components/ExecutiveSummary/ExecutiveSummary';
import { useExecutiveSummary } from '../../hooks/useAnalytics';
import { mockApiResponses, mockEmptyApiResponses } from '../../__mocks__/executiveSummary/mockData';
import {
  mockUseExecutiveSummaryLoading,
  mockUseExecutiveSummarySuccess,
  mockUseExecutiveSummaryError,
  mockUseExecutiveSummaryEmpty,
  mockUseExecutiveSummaryPartialLoading,
  mockUseExecutiveSummaryPartialError,
} from '../../__mocks__/executiveSummary/mockHooks';

// Mock the useExecutiveSummary hook
jest.mock('../../hooks/useAnalytics');
const mockedUseExecutiveSummary = useExecutiveSummary as jest.MockedFunction<typeof useExecutiveSummary>;

// Mock the Common components
jest.mock('../../components/Common', () => ({
  MetricCard: ({ metric }: { metric: any }) => (
    <div data-testid="metric-card">
      <h3 data-testid="metric-title">{metric.title}</h3>
      <div data-testid="metric-value">{metric.value}</div>
      {metric.unit && <span data-testid="metric-unit">{metric.unit}</span>}
      {metric.change !== undefined && (
        <div data-testid="metric-change">{metric.change}%</div>
      )}
    </div>
  ),
  ChartCard: ({ title, data, type, height, valueKey, color }: any) => (
    <div data-testid="chart-card">
      <h3 data-testid="chart-title">{title}</h3>
      <div data-testid="chart-container" style={{ height: `${height}px` }}>
        <div data-testid="chart-type">{type}</div>
        <div data-testid="chart-data">{JSON.stringify(data)}</div>
        <div data-testid="chart-value-key">{valueKey}</div>
        <div data-testid="chart-color">{color}</div>
      </div>
    </div>
  ),
}));

// Mock the Skeleton components
jest.mock('../../components/Skeletons', () => ({
  MetricCardSkeleton: ({ count = 1 }: { count?: number }) => (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} data-testid="metric-card-skeleton">
          <div data-testid="skeleton-title"></div>
          <div data-testid="skeleton-value"></div>
          <div data-testid="skeleton-unit"></div>
        </div>
      ))}
    </>
  ),
  ChartCardSkeleton: ({ height = 300, type = 'bar' }: { height?: number; type?: string }) => (
    <div data-testid="chart-card-skeleton" style={{ height: `${height}px` }}>
      <div data-testid="skeleton-chart-title"></div>
      <div data-testid="skeleton-chart-content">
        <div data-testid="skeleton-chart-type">{type}</div>
      </div>
    </div>
  ),
}));

// Helper function to create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ExecutiveSummary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should render loading skeletons when data is loading', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummaryLoading());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check for section titles
      expect(screen.getByText('Rendimiento Financiero del Sistema de Reservas')).toBeInTheDocument();
      expect(screen.getByText('Excelencia Operacional')).toBeInTheDocument();
      expect(screen.getByText('Experiencia del Usuario y Retención')).toBeInTheDocument();

      // Check for skeleton components
      expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(10); // 3 + 2 + 5
      expect(screen.getByTestId('chart-card-skeleton')).toBeInTheDocument();
    });

    it('should render partial loading state correctly', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummaryLoading());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Should still show loading skeletons
      expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(10);
    });
  });

  describe('Error State', () => {
    it('should render error message when API calls fail', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummaryError());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
      expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
    });

    it('should render error message when partial API calls fail', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummaryPartialError());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should render all sections with data when API calls succeed', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check for section titles
      expect(screen.getByText('Rendimiento Financiero del Sistema de Reservas')).toBeInTheDocument();
      expect(screen.getByText('Excelencia Operacional')).toBeInTheDocument();
      expect(screen.getByText('Tendencia de Ingresos Mensuales ($M)')).toBeInTheDocument();
      expect(screen.getByText('Experiencia del Usuario y Retención')).toBeInTheDocument();

      // Check for metric cards
      expect(screen.getAllByTestId('metric-card')).toHaveLength(10); // 3 + 2 + 5
      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
    });

    it('should render financial performance metrics correctly', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check financial metrics (3 total)
      expect(screen.getByText('Valor Promedio de Reserva')).toBeInTheDocument();
      expect(screen.getByText('$451')).toBeInTheDocument();
      
      expect(screen.getByText('Ingresos Mensuales')).toBeInTheDocument();
      expect(screen.getByText('$8300000.0M')).toBeInTheDocument();
      
      expect(screen.getByText('Ingresos por Usuario')).toBeInTheDocument();
      expect(screen.getByText('$850')).toBeInTheDocument();
    });

    it('should render operational metrics correctly', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check operational metrics (2 total)
      expect(screen.getByText('Tasa de Éxito de Pago')).toBeInTheDocument();
      expect(screen.getByText('91.4')).toBeInTheDocument();
      
      expect(screen.getByText('Anticipación Promedio')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('days')).toBeInTheDocument();
    });

    it('should render user engagement metrics correctly', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check engagement metrics (5 total)
      expect(screen.getByText('Total de Búsquedas')).toBeInTheDocument();
      expect(screen.getByText('15,000')).toBeInTheDocument();
      
      expect(screen.getByText('Total de Reservas')).toBeInTheDocument();
      expect(screen.getByText('4,500')).toBeInTheDocument();
      
      expect(screen.getByText('Total de Pagos')).toBeInTheDocument();
      expect(screen.getByText('3,200')).toBeInTheDocument();
      
      expect(screen.getByText('Búsqueda a Reserva')).toBeInTheDocument();
      expect(screen.getByText('30.0')).toBeInTheDocument();
      
      expect(screen.getByText('Reserva a Pago')).toBeInTheDocument();
      expect(screen.getByText('71.1')).toBeInTheDocument();
    });

    it('should render revenue trend chart correctly', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      const chartCard = screen.getByTestId('chart-card');
      expect(chartCard).toBeInTheDocument();
      
      expect(screen.getByTestId('chart-title')).toHaveTextContent('Tendencia de Ingresos Mensuales ($M)');
      expect(screen.getByTestId('chart-type')).toHaveTextContent('line');
      expect(screen.getByTestId('chart-color')).toHaveTextContent('#10B981');
    });
  });

  describe('Empty Data State', () => {
    it('should handle empty data gracefully', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummaryEmpty());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Should render with default values
      expect(screen.getByText('Valor Promedio de Reserva')).toBeInTheDocument();
      expect(screen.getAllByText('$0')).toHaveLength(3); // 3 financial metrics
      
      expect(screen.getByText('Tasa de Éxito de Pago')).toBeInTheDocument();
      expect(screen.getAllByText('0.0')).toHaveLength(3); // Payment success + 2 conversion rates
    });
  });

  describe('Period Parameter Handling', () => {
    it('should handle different period values correctly', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      const { rerender } = render(
        <ExecutiveSummary selectedPeriod="7" />,
        { wrapper: createWrapper() }
      );

      expect(mockedUseExecutiveSummary).toHaveBeenCalledWith(7);

      rerender(<ExecutiveSummary selectedPeriod="90" />);
      expect(mockedUseExecutiveSummary).toHaveBeenCalledWith(90);

      rerender(<ExecutiveSummary selectedPeriod="invalid" />);
      expect(mockedUseExecutiveSummary).toHaveBeenCalledWith(30); // Default value
    });

    it('should use default period when invalid value provided', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="invalid" />,
        { wrapper: createWrapper() }
      );

      expect(mockedUseExecutiveSummary).toHaveBeenCalledWith(30);
    });
  });

  describe('Data Transformation', () => {
    it('should transform API data correctly for financial metrics', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Verify the transformed financial data
      const avgFareMetric = screen.getByText('$451');
      expect(avgFareMetric).toBeInTheDocument();

      const monthlyRevenueMetric = screen.getByText('$8300000.0M');
      expect(monthlyRevenueMetric).toBeInTheDocument();
      
      const revenuePerUserMetric = screen.getByText('$850');
      expect(revenuePerUserMetric).toBeInTheDocument();
    });

    it('should handle missing data gracefully', () => {
      // Create a custom mock with some missing data
      const successMock = mockUseExecutiveSummarySuccess();
      const mockDataWithMissingFields = {
        ...successMock,
        funnelData: {
          ...successMock.funnelData,
          data: null,
        },
        averageFare: {
          ...successMock.averageFare,
          data: null,
        },
      };

      mockedUseExecutiveSummary.mockReturnValue(mockDataWithMissingFields);

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Should show default values for missing data
      expect(screen.getAllByText('0')).toHaveLength(3); // Total searches, reservations, payments
      expect(screen.getByText('$0')).toBeInTheDocument(); // Average fare
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(3);
      
      expect(headings[0]).toHaveTextContent('Rendimiento Financiero del Sistema de Reservas');
      expect(headings[1]).toHaveTextContent('Excelencia Operacional');
      expect(headings[2]).toHaveTextContent('Experiencia del Usuario y Retención');
    });

    it('should have proper test ids for testing', () => {
      mockedUseExecutiveSummary.mockReturnValue(mockUseExecutiveSummarySuccess());

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
      expect(screen.getAllByTestId('metric-card')).toHaveLength(10); // 3 + 2 + 5
    });
  });
});
