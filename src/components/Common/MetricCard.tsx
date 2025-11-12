import React from 'react';
import { MetricData } from '../../types/dashboard';
import './MetricCard.css';

interface MetricCardProps {
  metric: MetricData;
  variant?: 'default' | 'featured' | 'compact' | 'highlighted' | 'accent';
  size?: 'small' | 'medium' | 'large';
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, variant = 'default', size = 'medium' }) => {
  const changeColor = metric.change && metric.change > 0 ? 'positive' : 'negative';
  const changeSymbol = metric.change && metric.change > 0 ? '+' : '';
  
  // Only show change indicator if there's a meaningful change (not 0 or undefined)
  const shouldShowChange = metric.change !== undefined && metric.change !== null && metric.change !== 0;

  // Get icon based on title/keywords - using professional symbols
  const getIcon = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('ingreso') || lowerTitle.includes('revenue') || lowerTitle.includes('valor')) {
      return '$';
    } else if (lowerTitle.includes('tasa') || lowerTitle.includes('rate') || lowerTitle.includes('éxito')) {
      return '✓';
    } else if (lowerTitle.includes('usuario') || lowerTitle.includes('user')) {
      return 'Π';
    } else if (lowerTitle.includes('anticipación') || lowerTitle.includes('anticipation')) {
      return '◷';
    } else if (lowerTitle.includes('reserva') || lowerTitle.includes('booking')) {
      return '▸';
    } else if (lowerTitle.includes('vuelo') || lowerTitle.includes('flight')) {
      return '◈';
    } else if (lowerTitle.includes('tiempo') || lowerTitle.includes('time')) {
      return '◐';
    } else if (lowerTitle.includes('búsqueda') || lowerTitle.includes('search')) {
      return '◊';
    } else if (lowerTitle.includes('pago') || lowerTitle.includes('payment')) {
      return '◉';
    }
    return '■';
  };

  return (
    <div className={`metric-card metric-card-${variant} metric-card-${size}`}>
      <div className="metric-header">
        <div className="metric-title-row">
          {variant !== 'compact' && (
            <span className="metric-icon">{getIcon(metric.title)}</span>
          )}
          <h3 className="metric-title">{metric.title}</h3>
        </div>
      </div>
      
      <div className="metric-value-container">
        <div className="metric-value">
          {metric.value}
          {metric.unit && <span className="metric-unit">{metric.unit}</span>}
        </div>
        
        {shouldShowChange && (
          <div className={`metric-change ${changeColor}`}>
            <span className="change-icon">
              {metric.change! > 0 ? '↗' : '↘'}
            </span>
            {changeSymbol}{Math.abs(metric.change!)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
