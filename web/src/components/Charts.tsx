'use client';

import { useState } from 'react';
import { CryptoData } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Legend,
  ReferenceLine,
} from 'recharts';

interface ChartsProps {
  data: CryptoData;
  rangeLabel?: string;
}

type ChartTab =
  | 'overview'
  | 'price'
  | 'bollinger'
  | 'returns'
  | 'volatility'
  | 'rsi'
  | 'macd'
  | 'log';

const chartTabs: { id: ChartTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'price', label: 'Price + MAs' },
  { id: 'bollinger', label: 'Bollinger' },
  { id: 'returns', label: 'Returns' },
  { id: 'volatility', label: 'Volatility' },
  { id: 'rsi', label: 'RSI' },
  { id: 'macd', label: 'MACD' },
  { id: 'log', label: 'Log Returns' },
];

export default function Charts({ data, rangeLabel }: ChartsProps) {
  const { prices, features } = data;
  const [activeTab, setActiveTab] = useState<ChartTab>('overview');

  if (!features) return null;

  const chartData = prices.map((point, index) => ({
    date: point.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: point.price,
    volume: point.volume,
    sma7: features.sma7[index],
    sma30: features.sma30[index],
    logReturn: features.logReturns[index],
    cumReturn: features.cumulativeReturns[index] * 100,
    volatility7d: features.volatility7d[index],
    volatility30d: features.volatility30d[index],
    rsi: features.rsi[index],
    macd: features.macd[index],
    macdSignal: features.macdSignal[index],
    macdHist: features.macdHistogram[index],
    bbUpper: features.bbUpper[index],
    bbMiddle: features.bbMiddle[index],
    bbLower: features.bbLower[index],
  }));

  const validChartData = chartData.filter((_, index) => index > 30);

  const formatPrice = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    if (value >= 1) return `$${value.toFixed(0)}`;
    return `$${value.toFixed(4)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="lux-surface rounded-xl p-3 shadow-lg">
        <p className="mb-1 text-xs text-gray-400">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-xs">
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
          </p>
        ))}
      </div>
    );
  };

  const axisStyle = { fill: '#9aa4b2', fontSize: 11 };
  const panelClass = 'lux-surface rounded-2xl p-5';

  const panelHeader = (title: string) => (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-semibold text-primary-300">{title}</h3>
      {rangeLabel && <span className="lux-chip rounded-full px-2.5 py-1 text-[10px]">{rangeLabel}</span>}
    </div>
  );

  const pricePanel = (
    <div className={panelClass}>
      {panelHeader('Price + Moving Averages')}
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={validChartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.24} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2730" />
          <XAxis dataKey="date" tick={axisStyle} stroke="#1f2730" />
          <YAxis tick={axisStyle} stroke="#1f2730" tickFormatter={formatPrice} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          <Area type="monotone" dataKey="price" stroke="#22d3ee" fill="url(#priceGradient)" name="Price" strokeWidth={2} />
          <Line type="monotone" dataKey="sma7" stroke="#a855f7" name="SMA 7" dot={false} strokeWidth={1.5} />
          <Line type="monotone" dataKey="sma30" stroke="#f59e0b" name="SMA 30" dot={false} strokeWidth={1.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const bollingerPanel = (
    <div className={panelClass}>
      {panelHeader('Bollinger Bands')}
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={validChartData}>
          <defs>
            <linearGradient id="bbBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2730" />
          <XAxis dataKey="date" tick={axisStyle} stroke="#1f2730" />
          <YAxis tick={axisStyle} stroke="#1f2730" tickFormatter={formatPrice} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          <Area type="monotone" dataKey="bbUpper" stroke="#a855f7" fill="none" name="Upper" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="bbLower" stroke="#a855f7" fill="url(#bbBand)" name="Lower" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="bbMiddle" stroke="#f59e0b" name="Middle" dot={false} strokeWidth={1.2} />
          <Line type="monotone" dataKey="price" stroke="#22d3ee" name="Price" dot={false} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const returnsPanel = (
    <div className={panelClass}>
      {panelHeader('Cumulative Returns (%)')}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={validChartData}>
          <defs>
            <linearGradient id="returnGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2730" />
          <XAxis dataKey="date" tick={axisStyle} stroke="#1f2730" />
          <YAxis tick={axisStyle} stroke="#1f2730" tickFormatter={(value) => `${value.toFixed(0)}%`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#4b5563" strokeDasharray="4 4" />
          <Area type="monotone" dataKey="cumReturn" stroke="#22d3ee" fill="url(#returnGradient)" name="Cum Return" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const volatilityPanel = (
    <div className={panelClass}>
      {panelHeader('Rolling Volatility')}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={validChartData}>
          <defs>
            <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2730" />
          <XAxis dataKey="date" tick={axisStyle} stroke="#1f2730" />
          <YAxis tick={axisStyle} stroke="#1f2730" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          <Area type="monotone" dataKey="volatility7d" stroke="#f43f5e" fill="url(#volGradient)" name="Volatility 7D" strokeWidth={1.8} />
          <Line type="monotone" dataKey="volatility30d" stroke="#22d3ee" name="Volatility 30D" dot={false} strokeWidth={1.8} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const rsiPanel = (
    <div className={panelClass}>
      {panelHeader('RSI (14)')}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={validChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2730" />
          <XAxis dataKey="date" tick={axisStyle} stroke="#1f2730" />
          <YAxis tick={axisStyle} stroke="#1f2730" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '70', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={30} stroke="#22d3ee" strokeDasharray="5 5" label={{ value: '30', fill: '#22d3ee', fontSize: 10 }} />
          <Line type="monotone" dataKey="rsi" stroke="#22d3ee" name="RSI" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const macdPanel = (
    <div className={panelClass}>
      {panelHeader('MACD')}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={validChartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2730" />
          <XAxis dataKey="date" tick={axisStyle} stroke="#1f2730" />
          <YAxis tick={axisStyle} stroke="#1f2730" />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
          <ReferenceLine y={0} stroke="#4b5563" />
          <Bar dataKey="macdHist" name="Histogram" fill="#22d3ee" opacity={0.25} />
          <Line type="monotone" dataKey="macd" stroke="#a855f7" name="MACD" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="macdSignal" stroke="#f43f5e" name="Signal" dot={false} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );

  const logPanel = (
    <div className={panelClass}>
      {panelHeader('Daily Log Returns')}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={validChartData.slice(-60)}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2730" />
          <XAxis dataKey="date" tick={axisStyle} stroke="#1f2730" />
          <YAxis tick={axisStyle} stroke="#1f2730" />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#4b5563" />
          <Bar dataKey="logReturn" name="Log Return" fill="#22d3ee" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const singlePanels: Record<Exclude<ChartTab, 'overview'>, JSX.Element> = {
    price: pricePanel,
    bollinger: bollingerPanel,
    returns: returnsPanel,
    volatility: volatilityPanel,
    rsi: rsiPanel,
    macd: macdPanel,
    log: logPanel,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {chartTabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-1.5 text-xs transition ${
                active
                  ? 'bg-primary-500/20 text-primary-200 border border-primary-500/50'
                  : 'bg-dark-400 text-gray-400 border border-dark-100/70 hover:border-primary-500/50 hover:text-primary-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">{pricePanel}</div>
          <div>{volatilityPanel}</div>
          <div>{rsiPanel}</div>
          <div className="lg:col-span-2">{returnsPanel}</div>
        </div>
      ) : (
        singlePanels[activeTab]
      )}
    </div>
  );
}
