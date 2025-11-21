import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  AreaChart,
  Area
} from 'recharts';
import { ChartDataPoint } from '../../types/dashboard';
import './ChartCard.css';

interface ChartCardProps {
  title: string;
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'pie' | 'funnel' | 'area' | 'barHorizontal';
  height?: number;
  valueKey?: string;
  valueKey2?: string;
  nameKey?: string;
  color?: string;
  color2?: string;
}

const COLORS = [
  '#507BD8', '#66CED6', '#34D399', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#06B6D4', '#F97316', '#8797B2', '#10B981'
];

// Generate a color palette with better contrast
const generateColors = (count: number): string[] => {
  const baseColors = COLORS;
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  type,
  height = 300,
  valueKey = 'value',
  valueKey2,
  nameKey = 'name',
  color = '#507BD8',
  color2 = '#34D399'
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if data is empty or invalid
  const hasValidData = data && data.length > 0 && data.some(item => {
    const value = item[valueKey as keyof ChartDataPoint];
    return value !== undefined && value !== null && (typeof value === 'number' ? value > 0 : true);
  });

  const renderChart = () => {
    switch (type) {
      case 'bar':
        const needsRotation = data.length > 4; // Rotate labels if more than 4 items
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data} 
              margin={{ 
                top: 20, 
                right: 30, 
                left: 20, 
                bottom: needsRotation ? 80 : 40 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey={nameKey} 
                angle={needsRotation ? -45 : 0}
                textAnchor={needsRotation ? 'end' : 'middle'}
                tick={{ 
                  fontSize: isMobile ? 10 : 12,
                  height: needsRotation ? 80 : 30
                }}
                stroke="#6B7280"
                interval={0} // Show all labels
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                stroke="#6B7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey={valueKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'barHorizontal':
        const isPercentage = title.toLowerCase().includes('tasa') || title.toLowerCase().includes('conversión') || title.toLowerCase().includes('%');
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data} 
              layout="vertical"
              margin={{ 
                top: 10, 
                right: isMobile ? 10 : 30, 
                left: isMobile ? 60 : 80, 
                bottom: 10 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                type="number"
                tick={{ fontSize: isMobile ? 10 : 12 }}
                stroke="#6B7280"
                tickFormatter={(value) => isPercentage ? `${value.toFixed(2)}%` : value.toLocaleString('es-ES')}
              />
              <YAxis 
                type="category"
                dataKey={nameKey}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                stroke="#6B7280"
                width={isMobile ? 55 : 80}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  padding: '8px 12px'
                }}
                formatter={(value: any) => [
                  isPercentage ? `${value.toFixed(2)}%` : value.toLocaleString('es-ES'),
                  isPercentage ? 'Tasa' : 'Valor'
                ]}
              />
              <Bar 
                dataKey={valueKey} 
                fill={color}
                radius={[0, 8, 8, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={(typeof entry.color === 'string' ? entry.color : undefined) || generateColors(data.length)[index]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey={nameKey}
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={valueKey} 
                stroke={color} 
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        const chartColors = generateColors(data.length);
        const total = data.reduce((sum, item) => sum + (item[valueKey as keyof ChartDataPoint] as number || 0), 0);
        const renderLabel = (entry: any) => {
          const percent = ((entry[valueKey] as number || 0) / total) * 100;
          // Only show labels for slices > 5%
          if (percent > 5) {
            return `${entry[nameKey as keyof ChartDataPoint]} ${percent.toFixed(1)}%`;
          }
          return '';
        };
        
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={Math.min(100, height * 0.35)}
                fill="#8884d8"
                dataKey={valueKey}
                animationBegin={0}
                animationDuration={800}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={(typeof entry.color === 'string' ? entry.color : undefined) || chartColors[index]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  padding: '10px 14px'
                }}
                formatter={(value: any, name: string, props: any) => {
                  const percent = ((value as number) / total) * 100;
                  const label = props.payload[nameKey as keyof ChartDataPoint] || name;
                  return [
                    `${value.toLocaleString('es-ES')} (${percent.toFixed(1)}%)`,
                    label
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <FunnelChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Funnel
                dataKey={valueKey}
                data={data}
                isAnimationActive
                fill={color}
              >
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
                {valueKey2 && (
                  <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color2} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color2} stopOpacity={0.1}/>
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey={nameKey} 
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'searches') return [value.toLocaleString('es-ES'), 'Búsquedas'];
                  if (name === 'bookings') return [value.toLocaleString('es-ES'), 'Reservas'];
                  return [value, name];
                }}
                labelFormatter={(label: string) => `Mes: ${label}`}
              />
              <Area
                type="monotone"
                dataKey={valueKey}
                stroke={color}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrimary)"
              />
              {valueKey2 && (
                <Area
                  type="monotone"
                  dataKey={valueKey2}
                  stroke={color2}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSecondary)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="chart-card card">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-container">
        {hasValidData ? (
          renderChart()
        ) : (
          <div className="chart-empty-state">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="chart-empty-icon">
              <circle cx="32" cy="32" r="30" stroke="#E5E7EB" strokeWidth="2"/>
              <path d="M32 20V32M32 32L26 26M32 32L38 26" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="chart-empty-text">No hay datos disponibles</p>
            <p className="chart-empty-subtext">Los datos aparecerán aquí cuando estén disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartCard;
