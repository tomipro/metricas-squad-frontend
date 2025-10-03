// Mock components for Executive Summary tests
// @ts-nocheck
import React from 'react';

// Mock MetricCard component
export const MetricCard = ({ metric }: { metric: any }) => (
  <div data-testid="metric-card">
    <h3 data-testid="metric-title">{metric.title}</h3>
    <div data-testid="metric-value">{metric.value}</div>
    {metric.unit && <span data-testid="metric-unit">{metric.unit}</span>}
    <div data-testid="metric-change">{metric.change}%</div>
  </div>
);

// Mock ChartCard component
export const ChartCard = ({ title, data, type, height, valueKey, color }: any) => (
  <div data-testid="chart-card">
    <h3 data-testid="chart-title">{title}</h3>
    <div data-testid="chart-container" style={{ height: `${height}px;` }}>
      <div data-testid="chart-type">{type}</div>
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
      <div data-testid="chart-value-key">{valueKey}</div>
      {color && <div data-testid="chart-color">{color}</div>}
    </div>
  </div>
);

// Mock MetricCardSkeleton component
export const MetricCardSkeleton = () => (
  <div data-testid="metric-skeleton">Loading...</div>
);

// Mock ChartCardSkeleton component
export const ChartCardSkeleton = () => (
  <div data-testid="chart-skeleton">Loading...</div>
);
