import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Operations from '../../components/Operations/Operations';
import * as analyticsService from '../../services/analyticsService';
import { mockOperationsApiResponses, mockOperationsEmptyData } from '../../__mocks__/operations/mockOperationsData';

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

// Mock the analytics service
jest.mock('../../services/analyticsService', () => ({
  getFunnelData: jest.fn(),
  getPaymentSuccessRate: jest.fn(),
  getTimeToComplete: jest.fn(),
  getCancellationRate: jest.fn(),
  getPopularAirlines: jest.fn(),
}));

const mockedAnalyticsService = analyticsService as jest.Mocked<typeof analyticsService>;

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

describe('Operations Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Full Data Flow Integration', () => {
    it('should render data correctly after successful API calls', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsApiResponses.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
      });

      // Verify operational metrics
      expect(screen.getByText('Búsqueda → Reserva')).toBeInTheDocument();
      expect(screen.getByText('30.0')).toBeInTheDocument();
      expect(screen.getAllByText('%')).toHaveLength(3);
      
      expect(screen.getByText('Tasa de Éxito de Pago')).toBeInTheDocument();
      expect(screen.getByText('91.4')).toBeInTheDocument();
      
      expect(screen.getByText('Tiempo de Reserva')).toBeInTheDocument();
      expect(screen.getByText('8.5')).toBeInTheDocument();
      expect(screen.getAllByText('min')).toHaveLength(3);

      // Verify flight metrics
      expect(screen.getByText('Tasa de Cancelación')).toBeInTheDocument();
      expect(screen.getByText('12.5')).toBeInTheDocument();
      
      expect(screen.getByText('Tiempo de Pago a Reserva')).toBeInTheDocument();
      expect(screen.getByText('3.2')).toBeInTheDocument();
      
      expect(screen.getByText('Tiempo Total de Reserva')).toBeInTheDocument();
      expect(screen.getByText('11.7')).toBeInTheDocument();

      // Verify charts
      expect(screen.getByText('Distribución de Aerolíneas Populares')).toBeInTheDocument();
      expect(screen.getByText('Análisis de Tasa de Cancelación')).toBeInTheDocument();
    });

    it('should show loading state during API calls', () => {
      mockedAnalyticsService.getFunnelData.mockImplementation(() => new Promise(() => {}));
      mockedAnalyticsService.getPaymentSuccessRate.mockImplementation(() => new Promise(() => {}));
      mockedAnalyticsService.getTimeToComplete.mockImplementation(() => new Promise(() => {}));
      mockedAnalyticsService.getCancellationRate.mockImplementation(() => new Promise(() => {}));
      mockedAnalyticsService.getPopularAirlines.mockImplementation(() => new Promise(() => {}));

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Check for loading skeletons
      expect(screen.getAllByTestId('metric-skeleton')).toHaveLength(2);
      expect(screen.getAllByTestId('chart-skeleton')).toHaveLength(2);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      mockedAnalyticsService.getFunnelData.mockRejectedValue(new Error('API Error'));
      mockedAnalyticsService.getPaymentSuccessRate.mockRejectedValue(new Error('API Error'));
      mockedAnalyticsService.getTimeToComplete.mockRejectedValue(new Error('API Error'));
      mockedAnalyticsService.getCancellationRate.mockRejectedValue(new Error('API Error'));
      mockedAnalyticsService.getPopularAirlines.mockRejectedValue(new Error('API Error'));

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading operations data. Please try again later.')).toBeInTheDocument();
      });
    });

    it('should handle partial API failures', async () => {
      mockedAnalyticsService.getFunnelData.mockRejectedValue(new Error('API Error'));
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading operations data. Please try again later.')).toBeInTheDocument();
      });
    });
  });

  describe('Data Transformation Integration', () => {
    it('should correctly transform and display all metrics', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsApiResponses.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
      });

      // Verify all metrics are correctly transformed
      expect(screen.getByText('Búsqueda → Reserva')).toBeInTheDocument();
      expect(screen.getByText('30.0')).toBeInTheDocument();
      
      expect(screen.getByText('Tasa de Éxito de Pago')).toBeInTheDocument();
      expect(screen.getByText('91.4')).toBeInTheDocument();
      
      expect(screen.getByText('Tiempo de Reserva')).toBeInTheDocument();
      expect(screen.getByText('8.5')).toBeInTheDocument();
      
      expect(screen.getByText('Tasa de Cancelación')).toBeInTheDocument();
      expect(screen.getByText('12.5')).toBeInTheDocument();
      
      expect(screen.getByText('Tiempo de Pago a Reserva')).toBeInTheDocument();
      expect(screen.getByText('3.2')).toBeInTheDocument();
      
      expect(screen.getByText('Tiempo Total de Reserva')).toBeInTheDocument();
      expect(screen.getByText('11.7')).toBeInTheDocument();
    });

    it('should handle empty data responses', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsEmptyData.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsEmptyData.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsEmptyData.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsEmptyData.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsEmptyData.popularAirlines);

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
      });

      // Should show default values
      expect(screen.getAllByText('0.0')).toHaveLength(6);
      expect(screen.getAllByText('%')).toHaveLength(3);
      expect(screen.getAllByText('min')).toHaveLength(3);
    });

    it('should correctly transform chart data', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsApiResponses.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('chart-card')).toHaveLength(2);
      });

      // Verify chart data is correctly transformed
      expect(screen.getByText('Distribución de Aerolíneas Populares')).toBeInTheDocument();
      expect(screen.getByText('Análisis de Tasa de Cancelación')).toBeInTheDocument();
      
          // Check chart properties
          expect(screen.getAllByTestId('chart-type')).toHaveLength(2);
          expect(screen.getAllByTestId('chart-type')[0]).toHaveTextContent('pie');
          expect(screen.getAllByTestId('chart-value-key')[0]).toHaveTextContent('value');
    });
  });

  describe('Period Parameter Integration', () => {
    it('should call APIs with correct period parameters', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsApiResponses.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      render(
        <Operations selectedPeriod="90" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
      });

      expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(90);
      expect(mockedAnalyticsService.getPaymentSuccessRate).toHaveBeenCalledWith(90);
      expect(mockedAnalyticsService.getTimeToComplete).toHaveBeenCalledWith(90);
      expect(mockedAnalyticsService.getCancellationRate).toHaveBeenCalledWith(90);
      expect(mockedAnalyticsService.getPopularAirlines).toHaveBeenCalledWith(90, 5);
    });

    it('should handle invalid period parameters', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsApiResponses.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      render(
        <Operations selectedPeriod="invalid" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
      });

      expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(30);
      expect(mockedAnalyticsService.getPaymentSuccessRate).toHaveBeenCalledWith(30);
      expect(mockedAnalyticsService.getTimeToComplete).toHaveBeenCalledWith(30);
      expect(mockedAnalyticsService.getCancellationRate).toHaveBeenCalledWith(30);
      expect(mockedAnalyticsService.getPopularAirlines).toHaveBeenCalledWith(30, 5);
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain proper heading hierarchy throughout loading and success states', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsApiResponses.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // During loading
      const loadingHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(loadingHeadings).toHaveLength(2);

      // After loading
      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
      });

      const successHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(successHeadings).toHaveLength(2);
    });

    it('should provide proper test ids for all interactive elements', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsApiResponses.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
      });

      expect(screen.getAllByTestId('metric-title')).toHaveLength(6);
      expect(screen.getAllByTestId('metric-value')).toHaveLength(6);
      expect(screen.getAllByTestId('chart-card')).toHaveLength(2);
    });
  });

  describe('Performance Integration', () => {
    it('should handle multiple rapid period changes', async () => {
      mockedAnalyticsService.getFunnelData.mockResolvedValue(mockOperationsApiResponses.funnelData);
      mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockOperationsApiResponses.paymentSuccess);
      mockedAnalyticsService.getTimeToComplete.mockResolvedValue(mockOperationsApiResponses.timeToComplete);
      mockedAnalyticsService.getCancellationRate.mockResolvedValue(mockOperationsApiResponses.cancellationRate);
      mockedAnalyticsService.getPopularAirlines.mockResolvedValue(mockOperationsApiResponses.popularAirlines);

      const { rerender } = render(
        <Operations selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
      });

      // Change period
      rerender(<Operations selectedPeriod="7" />);

      await waitFor(() => {
        expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(7);
      });

      // Change period again
      rerender(<Operations selectedPeriod="90" />);

      await waitFor(() => {
        expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(90);
      });
    });
  });
});
