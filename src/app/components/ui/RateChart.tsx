// src/app/components/ui/RateChart.tsx

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { HistoricalRate } from '@/types/currency';
import { calculatePercentageChange } from '@/utils/helpers';

interface RateChartProps {
  data: HistoricalRate[];
  from: string;
  to: string;
  loading?: boolean;
}

export default function RateChart({ data, from, to, loading = false }: RateChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rate History ({from}/{to})
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No historical data available
        </div>
      </div>
    );
  }

  const firstRate = data[0]?.rate || 0;
  const lastRate = data[data.length - 1]?.rate || 0;
  const change = calculatePercentageChange(lastRate, firstRate);
  const isPositive = change > 0;
  const isNeutral = Math.abs(change) < 0.01;

  const formatTooltipValue = (value: number) => {
    return value.toFixed(4);
  };

  const formatXAxisLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Rate History ({from}/{to})
        </h3>
        
        <div className="flex items-center space-x-2">
          {isNeutral ? (
            <Minus className="w-4 h-4 text-gray-400" />
          ) : isPositive ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-error" />
          )}
          
          <span
            className={`text-sm font-medium ${
              isNeutral
                ? 'text-gray-400'
                : isPositive
                ? 'text-success'
                : 'text-error'
            }`}
          >
            {isPositive ? '+' : ''}
            {change.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date"
              tickFormatter={formatXAxisLabel}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              domain={['dataMin - 0.01', 'dataMax + 0.01']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => value.toFixed(4)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              }}
              formatter={(value: number) => [
                formatTooltipValue(value),
                `${from}/${to}`,
              ]}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#2563eb' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Highest: </span>
          <span className="font-mono font-semibold">
            {Math.max(...data.map(d => d.rate)).toFixed(4)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Lowest: </span>
          <span className="font-mono font-semibold">
            {Math.min(...data.map(d => d.rate)).toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
