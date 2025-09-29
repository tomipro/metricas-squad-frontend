// Tests for analytics service functions used by Executive Summary
import axios from 'axios';
import {
  getFunnelData,
  getAverageFare,
  getMonthlyRevenue,
  getLifetimeValue,
  getRevenuePerUser,
  getPaymentSuccessRate,
  getAnticipation,
} from '../../services/analyticsService';
import { mockApiResponses } from '../../__mocks__/executiveSummary/mockData';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the axiosConfig module
jest.mock('../../services/axiosConfig', () => ({
  analyticsApi: {
    request: jest.fn(),
  },
  apiRequest: jest.fn(),
}));

import { apiRequest } from '../../services/axiosConfig';
const mockedApiRequest = apiRequest as jest.MockedFunction<typeof apiRequest>;

describe('Analytics Service - Executive Summary Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFunnelData', () => {
    it('should call API with correct parameters', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.funnel);

      const result = await getFunnelData(30);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'GET',
          url: '/funnel',
          params: { days: 30 },
        })
      );
      expect(result).toEqual(mockApiResponses.funnel);
    });

    it('should use default days parameter when not provided', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.funnel);

      await getFunnelData();

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { days: 7 },
        })
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiRequest.mockRejectedValue(error);

      await expect(getFunnelData(30)).rejects.toThrow('API Error');
    });
  });

  describe('getAverageFare', () => {
    it('should call API with correct parameters', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.averageFare);

      const result = await getAverageFare(30);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'GET',
          url: '/avg-fare',
          params: { days: 30 },
        })
      );
      expect(result).toEqual(mockApiResponses.averageFare);
    });

    it('should use default days parameter when not provided', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.averageFare);

      await getAverageFare();

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { days: 7 },
        })
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiRequest.mockRejectedValue(error);

      await expect(getAverageFare(30)).rejects.toThrow('API Error');
    });
  });

  describe('getMonthlyRevenue', () => {
    it('should call API with correct parameters', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.monthlyRevenue);

      const result = await getMonthlyRevenue(6);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'GET',
          url: '/revenue-monthly',
          params: { months: 6 },
        })
      );
      expect(result).toEqual(mockApiResponses.monthlyRevenue);
    });

    it('should use default months parameter when not provided', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.monthlyRevenue);

      await getMonthlyRevenue();

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { months: 6 },
        })
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiRequest.mockRejectedValue(error);

      await expect(getMonthlyRevenue(6)).rejects.toThrow('API Error');
    });
  });

  describe('getLifetimeValue', () => {
    it('should call API with correct parameters', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.lifetimeValue);

      const result = await getLifetimeValue(10);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'GET',
          url: '/ltv',
          params: { top: 10 },
        })
      );
      expect(result).toEqual(mockApiResponses.lifetimeValue);
    });

    it('should use default top parameter when not provided', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.lifetimeValue);

      await getLifetimeValue();

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { top: 10 },
        })
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiRequest.mockRejectedValue(error);

      await expect(getLifetimeValue(10)).rejects.toThrow('API Error');
    });
  });

  describe('getRevenuePerUser', () => {
    it('should call API with correct parameters', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.revenuePerUser);

      const result = await getRevenuePerUser(30, 10);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'GET',
          url: '/revenue-per-user',
          params: { days: 30, top: 10 },
        })
      );
      expect(result).toEqual(mockApiResponses.revenuePerUser);
    });

    it('should use default parameters when not provided', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.revenuePerUser);

      await getRevenuePerUser();

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { days: 7, top: 10 },
        })
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiRequest.mockRejectedValue(error);

      await expect(getRevenuePerUser(30, 10)).rejects.toThrow('API Error');
    });
  });

  describe('getPaymentSuccessRate', () => {
    it('should call API with correct parameters', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.paymentSuccess);

      const result = await getPaymentSuccessRate(30);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'GET',
          url: '/payment-success',
          params: { days: 30 },
        })
      );
      expect(result).toEqual(mockApiResponses.paymentSuccess);
    });

    it('should use default days parameter when not provided', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.paymentSuccess);

      await getPaymentSuccessRate();

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { days: 7 },
        })
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiRequest.mockRejectedValue(error);

      await expect(getPaymentSuccessRate(30)).rejects.toThrow('API Error');
    });
  });

  describe('getAnticipation', () => {
    it('should call API with correct parameters', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.anticipation);

      const result = await getAnticipation(90);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'GET',
          url: '/anticipation',
          params: { days: 90 },
        })
      );
      expect(result).toEqual(mockApiResponses.anticipation);
    });

    it('should use default days parameter when not provided', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.anticipation);

      await getAnticipation();

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { days: 90 },
        })
      );
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiRequest.mockRejectedValue(error);

      await expect(getAnticipation(90)).rejects.toThrow('API Error');
    });
  });

  describe('Data Validation', () => {
    it('should handle malformed API responses gracefully', async () => {
      const malformedData = { invalid: 'data' };
      mockedApiRequest.mockResolvedValue(malformedData);

      const result = await getFunnelData(30);
      expect(result).toEqual(malformedData);
    });

    it('should handle null API responses', async () => {
      mockedApiRequest.mockResolvedValue(null);

      const result = await getFunnelData(30);
      expect(result).toBeNull();
    });

    it('should handle empty API responses', async () => {
      const emptyData = {};
      mockedApiRequest.mockResolvedValue(emptyData);

      const result = await getFunnelData(30);
      expect(result).toEqual(emptyData);
    });
  });

  describe('Network Error Handling', () => {
    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('timeout of 10000ms exceeded');
      mockedApiRequest.mockRejectedValue(timeoutError);

      await expect(getFunnelData(30)).rejects.toThrow('timeout of 10000ms exceeded');
    });

    it('should handle 404 errors', async () => {
      const notFoundError = new Error('Request failed with status code 404');
      mockedApiRequest.mockRejectedValue(notFoundError);

      await expect(getFunnelData(30)).rejects.toThrow('Request failed with status code 404');
    });

    it('should handle 500 errors', async () => {
      const serverError = new Error('Request failed with status code 500');
      mockedApiRequest.mockRejectedValue(serverError);

      await expect(getFunnelData(30)).rejects.toThrow('Request failed with status code 500');
    });
  });

  describe('Parameter Validation', () => {
    it('should handle negative days parameter', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.funnel);

      await getFunnelData(-1);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { days: -1 },
        })
      );
    });

    it('should handle zero days parameter', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.funnel);

      await getFunnelData(0);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { days: 0 },
        })
      );
    });

    it('should handle very large days parameter', async () => {
      mockedApiRequest.mockResolvedValue(mockApiResponses.funnel);

      await getFunnelData(999999);

      expect(mockedApiRequest).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          params: { days: 999999 },
        })
      );
    });
  });
});
