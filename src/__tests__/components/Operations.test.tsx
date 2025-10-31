import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Operations from '../../components/Operations/Operations';
import { useOperations } from '../../hooks/useAnalytics';
import { 
  mockUseOperationsLoading, 
  mockUseOperationsSuccess, 
  mockUseOperationsError, 
  mockUseOperationsEmpty,
  mockUseOperationsPartialError 
} from '../../__mocks__/operations/mockOperationsHooks';

// Mock the Common components
jest.mock('../../components/Common', () => ({
  MetricCard: ({ metric }: { metric: any }) => (
    <div data-testid="metric-card">
      <h3 data-testid="metric-title">{metric.title}</h3>
      <div data-testid="metric-value">{metric.value}</div>
      {metric.unit && <span data-testid="metric-unit">{metric.unit}</span>}
      <div data-testid="metric-change">{metric.change}%</div>
    </div>
  ),
  ChartCard: ({ title, data, type, height, valueKey, color }: any) => (
    <div data-testid="chart-card">
      <h3 data-testid="chart-title">{title}</h3>
      <div data-testid="chart-container" style={{ height: `${height}px;` }}>
        <div data-testid="chart-type">{type}</div>
        <div data-testid="chart-data">{JSON.stringify(data)}</div>
        <div data-testid="chart-value-key">{valueKey}</div>
        {color && <div data-testid="chart-color">{color}</div>}
      </div>
    </div>
  ),
}));

// Mock the Skeletons components
jest.mock('../../components/Skeletons', () => ({
  MetricCardSkeleton: () => <div data-testid="metric-skeleton">Loading...</div>,
  ChartCardSkeleton: () => <div data-testid="chart-skeleton">Loading...</div>,
}));

// Mock the useOperations hook
jest.mock('../../hooks/useAnalytics', () => ({
  useOperations: jest.fn(),
}));

const mockedUseOperations = useOperations as jest.MockedFunction<typeof useOperations>;

// Create a wrapper for React Query
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

describe('Operations Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should render loading skeletons when data is loading', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsLoading());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check for skeleton components
      expect(screen.getAllByTestId('metric-skeleton')).toHaveLength(2);
      expect(screen.getAllByTestId('chart-skeleton')).toHaveLength(2);
      
      // Check section titles are present
      expect(screen.getByText('Rendimiento del Sistema de Reservas')).toBeInTheDocument();
      expect(screen.getByText('Operaciones de Vuelo y Disponibilidad')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should render operational metrics correctly', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check operational metrics
      expect(screen.getByText('Búsqueda → Reserva')).toBeInTheDocument();
      expect(screen.getByText('30.0')).toBeInTheDocument();
      expect(screen.getAllByText('%')).toHaveLength(3);
      
      expect(screen.getByText('Tasa de Éxito de Pago')).toBeInTheDocument();
      expect(screen.getByText('91.4')).toBeInTheDocument();
    });

    it('should render flight metrics correctly', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check flight metrics
      expect(screen.getByText('Tasa de Cancelación')).toBeInTheDocument();
      expect(screen.getByText('12.5')).toBeInTheDocument();
    });

    it('should render charts correctly', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check chart cards
      expect(screen.getByText('Distribución de Aerolíneas Populares')).toBeInTheDocument();
      expect(screen.getByText('Análisis de Tasa de Cancelación')).toBeInTheDocument();
      
      // Check chart data
      expect(screen.getAllByTestId('chart-type')).toHaveLength(2);
      expect(screen.getAllByTestId('chart-type')[0]).toHaveTextContent('pie');
      expect(screen.getAllByTestId('chart-value-key')[0]).toHaveTextContent('value');
    });

    it('should render all metric cards', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getAllByTestId('metric-card')).toHaveLength(3);
      expect(screen.getAllByTestId('chart-card')).toHaveLength(2);
    });
  });

  describe('Error State', () => {
    it('should render error message when API calls fail', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsError());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Error loading operations data. Please try again later.')).toBeInTheDocument();
    });

    it('should render error message when partial API calls fail', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsPartialError());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Error loading operations data. Please try again later.')).toBeInTheDocument();
    });
  });

  describe('Empty Data State', () => {
    it('should handle empty data gracefully', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsEmpty());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Should render with default values
      expect(screen.getByText('Búsqueda → Reserva')).toBeInTheDocument();
      expect(screen.getAllByText('0.0')).toHaveLength(3);
      expect(screen.getAllByText('%')).toHaveLength(3);
    });
  });

  describe('Period Parameter Handling', () => {
    it('should handle different period values correctly', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="7" />,
        { wrapper: createWrapper() }
      );

      expect(mockedUseOperations).toHaveBeenCalledWith(7);
    });

    it('should default to 30 days when period parsing fails', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="invalid" />,
        { wrapper: createWrapper() }
      );

      expect(mockedUseOperations).toHaveBeenCalledWith(30);
    });

    it('should handle empty period parameter', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="" />,
        { wrapper: createWrapper() }
      );

      expect(mockedUseOperations).toHaveBeenCalledWith(30);
    });
  });

  describe('Data Transformation', () => {
    it('should correctly transform funnel data', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check that conversion rate is properly formatted
      expect(screen.getByText('30.0')).toBeInTheDocument();
    });

    it('should correctly transform cancellation rate', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check that cancellation rate is properly formatted
      expect(screen.getByText('12.5')).toBeInTheDocument();
    });

    it('should correctly transform percentage data', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check that percentage values are properly formatted
      expect(screen.getByText('91.4')).toBeInTheDocument();
      expect(screen.getByText('12.5')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings).toHaveLength(2);
      
      expect(headings[0]).toHaveTextContent('Rendimiento del Sistema de Reservas');
      expect(headings[1]).toHaveTextContent('Operaciones de Vuelo y Disponibilidad');
    });

    it('should have proper test ids for testing', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getAllByTestId('metric-card')).toHaveLength(3);
      expect(screen.getAllByTestId('chart-card')).toHaveLength(2);
      expect(screen.getAllByTestId('metric-title')).toHaveLength(3);
      expect(screen.getAllByTestId('metric-value')).toHaveLength(3);
    });
  });

  describe('Component Structure', () => {
    it('should render all sections in correct order', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      const sections = screen.getAllByRole('heading', { level: 2 });
      expect(sections).toHaveLength(2); // 2 section headings
    });

    it('should have proper CSS classes', () => {
      mockedUseOperations.mockReturnValue(mockUseOperationsSuccess());

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Rendimiento del Sistema de Reservas')).toHaveClass('section-title');
      expect(screen.getByText('Operaciones de Vuelo y Disponibilidad')).toHaveClass('section-title');
    });
  });
});
