'use client';

import { CryptoData } from '@/lib/types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, ComposedChart, Legend, ReferenceLine
} from 'recharts';

interface ChartsProps {
  data: CryptoData;
}

export default function Charts({ data }: ChartsProps) {
  const { prices, features } = data;
  if (!features) return null;

  // Prepare chart data
  const chartData = prices.map((p, i) => ({
    date: p.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    timestamp: p.timestamp.getTime(),
    price: p.price,
    volume: p.volume,
    sma7: features.sma7[i],
    sma30: features.sma30[i],
    logReturn: features.logReturns[i],
    cumReturn: features.cumulativeReturns[i] * 100,
    volatility7d: features.volatility7d[i],
    volatility30d: features.volatility30d[i],
    rsi: features.rsi[i],
    macd: features.macd[i],
    macdSignal: features.macdSignal[i],
    macdHist: features.macdHistogram[i],
    bbUpper: features.bbUpper[i],
    bbMiddle: features.bbMiddle[i],
    bbLower: features.bbLower[i],
  }));

  // Filter out NaN values for cleaner charts
  const validChartData = chartData.filter((_, i) => i > 30);

  const formatPrice = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    if (value >= 1) return `$${value.toFixed(0)}`;
    return `$${value.toFixed(4)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Price Chart with Moving Averages */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary-400 mb-4">📈 Price Analysis with Moving Averages</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={validChartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} tickFormatter={formatPrice} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="price" stroke="#00d4ff" fill="url(#priceGradient)" name="Price" strokeWidth={2} />
            <Line type="monotone" dataKey="sma7" stroke="#ff6b6b" name="SMA 7" dot={false} strokeWidth={1} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="sma30" stroke="#ffd93d" name="SMA 30" dot={false} strokeWidth={1} strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bollinger Bands */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary-400 mb-4">📊 Bollinger Bands</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={validChartData}>
            <defs>
              <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#764ba2" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#764ba2" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} tickFormatter={formatPrice} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="bbUpper" stroke="#ff6b6b" fill="none" name="Upper Band" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="bbLower" stroke="#ff6b6b" fill="url(#bbGradient)" name="Lower Band" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="price" stroke="#00d4ff" name="Price" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="bbMiddle" stroke="#ffd93d" name="Middle Band" dot={false} strokeWidth={1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative Returns */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary-400 mb-4">💰 Cumulative Returns (%)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={validChartData}>
            <defs>
              <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} tickFormatter={(v) => `${v.toFixed(0)}%`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="cumReturn" stroke="#00ff88" fill="url(#returnGradient)" name="Cumulative Return %" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volatility Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary-400 mb-4">🌊 Rolling Volatility</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={validChartData}>
            <defs>
              <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="volatility7d" stroke="#ff6b6b" fill="url(#volGradient)" name="7-Day Volatility" strokeWidth={2} />
            <Line type="monotone" dataKey="volatility30d" stroke="#ffd93d" name="30-Day Volatility" dot={false} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* RSI Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary-400 mb-4">📈 RSI (Relative Strength Index)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={validChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={70} stroke="#ff4757" strokeDasharray="5 5" label={{ value: 'Overbought', fill: '#ff4757', fontSize: 12 }} />
            <ReferenceLine y={30} stroke="#00ff88" strokeDasharray="5 5" label={{ value: 'Oversold', fill: '#00ff88', fontSize: 12 }} />
            <Line type="monotone" dataKey="rsi" stroke="#ffd93d" name="RSI" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MACD Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary-400 mb-4">📊 MACD</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={validChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine y={0} stroke="#666" />
            <Bar dataKey="macdHist" name="Histogram" fill="#764ba2" opacity={0.7} />
            <Line type="monotone" dataKey="macd" stroke="#00d4ff" name="MACD" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="macdSignal" stroke="#ff6b6b" name="Signal" dot={false} strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Log Returns Distribution (simplified as line chart) */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-primary-400 mb-4">📉 Daily Log Returns</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={validChartData.slice(-60)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} />
            <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#666" />
            <Bar 
              dataKey="logReturn" 
              name="Log Return"
              fill="#00d4ff"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
