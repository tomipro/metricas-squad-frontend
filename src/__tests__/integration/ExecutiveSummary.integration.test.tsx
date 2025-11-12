// Integration tests for Executive Summary complete flow
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ExecutiveSummary from '../../components/ExecutiveSummary/ExecutiveSummary';
import * as analyticsService from '../../services/analyticsService';
import { mockApiResponses } from '../../__mocks__/executiveSummary/mockData';

// Mock the analytics service
jest.mock('../../services/analyticsService');
const mockedAnalyticsService = analyticsService as jest.Mocked<typeof analyticsService>;

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
        staleTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ExecutiveSummary Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock all the individual service functions
    mockedAnalyticsService.getFunnelData.mockResolvedValue(mockApiResponses.funnel);
    mockedAnalyticsService.getAverageFare.mockResolvedValue(mockApiResponses.averageFare);
    mockedAnalyticsService.getMonthlyRevenue.mockResolvedValue(mockApiResponses.monthlyRevenue);
    mockedAnalyticsService.getLifetimeValue.mockResolvedValue(mockApiResponses.lifetimeValue);
    mockedAnalyticsService.getRevenuePerUser.mockResolvedValue(mockApiResponses.revenuePerUser);
    mockedAnalyticsService.getPaymentSuccessRate.mockResolvedValue(mockApiResponses.paymentSuccess);
    mockedAnalyticsService.getAnticipation.mockResolvedValue(mockApiResponses.anticipation);
  });

  describe('Complete Data Flow', () => {
    it('should load data from API and render complete dashboard', async () => {
      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // Initially should show loading state
      expect(screen.getAllByTestId('metric-card-skeleton')).toHaveLength(11); // 3 + 2 + 3 + 3
      expect(screen.getAllByTestId('chart-card-skeleton')).toHaveLength(2); // Revenue trend + Conversion chart

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(11); // 1 + 2 + 2 + 3 + 3
      });

      // Verify all API calls were made
      expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(30);
      expect(mockedAnalyticsService.getAverageFare).toHaveBeenCalledWith(30);
      // For 30 days, months = Math.ceil(30/30) = 1
      expect(mockedAnalyticsService.getMonthlyRevenue).toHaveBeenCalledWith(1);
      // getLifetimeValue is not used in useExecutiveSummary hook
      expect(mockedAnalyticsService.getRevenuePerUser).toHaveBeenCalledWith(30, 10);
      expect(mockedAnalyticsService.getPaymentSuccessRate).toHaveBeenCalledWith(30);
      // Anticipation now uses the same days parameter (30) instead of hardcoded 90
      expect(mockedAnalyticsService.getAnticipation).toHaveBeenCalledWith(30);

      // Verify all sections are rendered
      expect(screen.getByText('Rendimiento Financiero')).toBeInTheDocument();
      expect(screen.getByText('Excelencia Operacional')).toBeInTheDocument();
      expect(screen.getByText('Tendencia de Ingresos Mensuales ($M)')).toBeInTheDocument();
      expect(screen.getByText('Experiencia del Usuario')).toBeInTheDocument();

      // Verify charts are rendered (2 charts: revenue trend + conversion)
      expect(screen.getAllByTestId('chart-card')).toHaveLength(2);
    });

    it('should handle different period values correctly', async () => {
      const { rerender } = render(
        <ExecutiveSummary selectedPeriod="7" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(7);
      });

      // Change period
      rerender(<ExecutiveSummary selectedPeriod="90" />);

      await waitFor(() => {
        expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(90);
      });
    });

    it('should handle invalid period gracefully', async () => {
      render(
        <ExecutiveSummary selectedPeriod="invalid" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(30);
      });
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API errors gracefully', async () => {
      mockedAnalyticsService.getFunnelData.mockRejectedValue(new Error('API Error'));

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
      });

      expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
    });

    it('should handle partial API failures', async () => {
      mockedAnalyticsService.getFunnelData.mockRejectedValue(new Error('API Error'));
      mockedAnalyticsService.getAverageFare.mockResolvedValue(mockApiResponses.averageFare);

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
      });
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      mockedAnalyticsService.getFunnelData.mockRejectedValue(timeoutError);

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByText('Error loading data. Please try again later.')).toBeInTheDocument();
      });
    });
  });

  describe('Data Transformation Integration', () => {
    it('should correctly transform and display all metrics', async () => {
      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(11);
      });

      // Verify financial metrics are correctly transformed
      expect(screen.getByText('Tasa de Conversión')).toBeInTheDocument();
      expect(screen.getByText('21.3')).toBeInTheDocument();
      expect(screen.getAllByText('%')).toHaveLength(4);
      
      expect(screen.getByText('Valor Promedio de Reserva')).toBeInTheDocument();
      expect(screen.getByText('$451')).toBeInTheDocument();
      
      expect(screen.getByText('Ingresos Mensuales')).toBeInTheDocument();
      expect(screen.getByText('$8300000.0M')).toBeInTheDocument();

      // Verify operational metrics
      expect(screen.getByText('Tasa de Éxito de Pago')).toBeInTheDocument();
      expect(screen.getByText('91.4')).toBeInTheDocument();
      
      expect(screen.getByText('Anticipación Promedio')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('days')).toBeInTheDocument();

      // Verify engagement metrics
      expect(screen.getByText('Total de Búsquedas')).toBeInTheDocument();
      // Format depends on locale - could be "15.000" or "15,000" depending on environment
      expect(screen.getByText(/15[.,]000/)).toBeInTheDocument();
      
      expect(screen.getByText('Total de Reservas')).toBeInTheDocument();
      expect(screen.getByText(/4[.,]500/)).toBeInTheDocument();
    });

    it('should handle empty data responses', async () => {
      const emptyData = {
        period_days: 30,
        searches: 0,
        reservations: 0,
        payments: 0,
        conversion: { search_to_reserve: 0, reserve_to_pay: 0, search_to_pay: 0 },
      };

      mockedAnalyticsService.getFunnelData.mockResolvedValue(emptyData);

      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(11);
      });

      // Should show default values
      expect(screen.getAllByText('0.0')).toHaveLength(4); // Payment success + 3 conversion rates
      expect(screen.getAllByText('%')).toHaveLength(4);
      expect(screen.getAllByText('0')).toHaveLength(3);
    });

    it('should correctly transform chart data', async () => {
      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getByTestId('chart-card')).toBeInTheDocument();
      });

      const chartData = screen.getByTestId('chart-data');
      const parsedData = JSON.parse(chartData.textContent || '[]');
      
      // Verify chart data structure
      expect(parsedData).toHaveLength(6); // 6 months of data
      expect(parsedData[0]).toHaveProperty('name', '2024-01');
      expect(parsedData[0]).toHaveProperty('value', 1.2); // 1200000 / 1000000
      expect(parsedData[0]).toHaveProperty('revenue', 1200000);
      expect(parsedData[0]).toHaveProperty('payments', 850);
    });
  });

  describe('Performance Integration', () => {
    it('should handle multiple rapid period changes', async () => {
      const { rerender } = render(
        <ExecutiveSummary selectedPeriod="7" />,
        { wrapper: createWrapper() }
      );

      // Rapidly change periods
      rerender(<ExecutiveSummary selectedPeriod="30" />);
      rerender(<ExecutiveSummary selectedPeriod="90" />);
      rerender(<ExecutiveSummary selectedPeriod="180" />);

      await waitFor(() => {
        expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledWith(180);
      });

      // Should have made multiple API calls
      expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledTimes(4);
    });

    it('should handle concurrent API calls efficiently', async () => {
      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(11); // 1 + 2 + 2 + 3 + 3
      });

      // All API calls should have been made
      expect(mockedAnalyticsService.getFunnelData).toHaveBeenCalledTimes(1);
      expect(mockedAnalyticsService.getAverageFare).toHaveBeenCalledTimes(1);
      expect(mockedAnalyticsService.getMonthlyRevenue).toHaveBeenCalledTimes(1);
      expect(mockedAnalyticsService.getLifetimeValue).toHaveBeenCalledTimes(1);
      expect(mockedAnalyticsService.getRevenuePerUser).toHaveBeenCalledTimes(1);
      expect(mockedAnalyticsService.getPaymentSuccessRate).toHaveBeenCalledTimes(1);
      expect(mockedAnalyticsService.getAnticipation).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility Integration', () => {
    it('should maintain proper heading hierarchy throughout loading and success states', async () => {
      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      // During loading
      const loadingHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(loadingHeadings).toHaveLength(4); // Rendimiento Financiero + Excelencia Operacional + Tasas de Conversión + Experiencia del Usuario

      // After loading
      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(11);
      });

      const successHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(successHeadings).toHaveLength(4); // Rendimiento Financiero + Excelencia Operacional + Tasas de Conversión + Experiencia del Usuario
    });

    it('should provide proper test ids for all interactive elements', async () => {
      render(
        <ExecutiveSummary selectedPeriod="30" />,
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('metric-card')).toHaveLength(11);
      });

      // Verify all metric cards have proper test ids
      const metricCards = screen.getAllByTestId('metric-card');
      metricCards.forEach(card => {
        expect(card).toBeInTheDocument();
        expect(card.querySelector('[data-testid="metric-title"]')).toBeInTheDocument();
        expect(card.querySelector('[data-testid="metric-value"]')).toBeInTheDocument();
      });

      // Verify chart has proper test ids
      expect(screen.getByTestId('chart-card')).toBeInTheDocument();
      expect(screen.getByTestId('chart-title')).toBeInTheDocument();
      expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    });
  });
});
