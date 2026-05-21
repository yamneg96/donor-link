import React from 'react';
import { MaterialIcon } from '../shared/MaterialIcon';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ForecastPoint {
  day: number;
  predicted_demand: number;
  lower_bound: number;
  upper_bound: number;
}

interface InventoryForecastChartProps {
  data: ForecastPoint[];
  currentInventory: number;
  className?: string;
}

export const InventoryForecastChart: React.FC<InventoryForecastChartProps> = ({
  data,
  currentInventory,
  className,
}) => {
  // Defensive check: handle both array and object structures
  const points = Array.isArray(data) ? data : (data as any)?.forecast || [];

  if (!points || points.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-m3-surface-container-low rounded-xl border border-dashed border-m3-outline-variant">
        <MaterialIcon icon="show_chart" size={48} className="text-m3-on-surface-variant/20 mb-3" />
        <p className="text-sm text-m3-on-surface-variant font-medium">No projection data available for this selection.</p>
      </div>
    );
  }

  // Add dates to the data
  const chartData = points.map((point: ForecastPoint) => {
    const date = new Date();
    date.setDate(date.getDate() + point.day);
    return {
      ...point,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      currentStock: currentInventory, // Placeholder for simplicity
    };
  });


  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#af101a" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#af101a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e2e2" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10 }} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e2e2e2',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          
          {/* Confidence Interval Area */}
          <Area
            type="monotone"
            dataKey="upper_bound"
            stroke="none"
            fill="#af101a"
            fillOpacity={0.05}
            name="Confidence (Upper)"
          />
          <Area
            type="monotone"
            dataKey="lower_bound"
            stroke="none"
            fill="#af101a"
            fillOpacity={0.05}
            name="Confidence (Lower)"
          />

          {/* Predicted Demand Line */}
          <Area
            type="monotone"
            dataKey="predicted_demand"
            stroke="#af101a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDemand)"
            name="Predicted Demand"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
