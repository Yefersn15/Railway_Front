import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useTheme } from '../../shared/context/ThemeContext';

const COLORS = ['#3b82f6', '#60a5fa', '#93bbfc', '#bfdbfe', '#dbeafe'];

const ProductChart = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const tickColor = isDark ? '#9ca3af' : '#374151';

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-8">
        No hay datos disponibles
      </div>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.nombre?.length > 15 ? item.nombre.substring(0, 15) + '...' : item.nombre,
    ventas: parseInt(item.total_vendido),
    fullName: item.nombre,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: tickColor }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fill: tickColor }} />
          <Tooltip
            formatter={(value, name) => [`${value} unidades`, 'Ventas']}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullName || label;
              }
              return label;
            }}
            contentStyle={isDark ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' } : undefined}
            labelStyle={isDark ? { color: '#f3f4f6' } : undefined}
          />
          <Bar dataKey="ventas" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductChart;