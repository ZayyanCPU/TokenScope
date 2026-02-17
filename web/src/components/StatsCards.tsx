'use client';

import { StatsData } from '@/lib/types';
import { TrendingUp, TrendingDown, Activity, BarChart3, Gauge, AlertTriangle } from 'lucide-react';

interface StatsCardsProps {
  stats: StatsData;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(6)}`;
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatNumber = (value: number, decimals: number = 4) => {
    if (isNaN(value) || !isFinite(value)) return 'N/A';
    return value.toFixed(decimals);
  };

  const cards = [
    {
      label: 'Current Price',
      value: formatPrice(stats.currentPrice),
      icon: stats.priceChange24h >= 0 ? TrendingUp : TrendingDown,
      color: stats.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'Total Return',
      value: formatPercent(stats.priceChangePercent),
      icon: stats.priceChangePercent >= 0 ? TrendingUp : TrendingDown,
      color: stats.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'All-Time High',
      value: formatPrice(stats.allTimeHigh),
      icon: TrendingUp,
      color: 'text-primary-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'All-Time Low',
      value: formatPrice(stats.allTimeLow),
      icon: TrendingDown,
      color: 'text-yellow-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'Mean Log Return',
      value: formatNumber(stats.meanReturn, 6),
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'Volatility (30d)',
      value: formatNumber(stats.volatility30d, 4),
      icon: BarChart3,
      color: 'text-purple-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'Sharpe Ratio',
      value: formatNumber(stats.sharpeRatio, 2),
      icon: Gauge,
      color: stats.sharpeRatio >= 1 ? 'text-green-400' : stats.sharpeRatio >= 0 ? 'text-yellow-400' : 'text-red-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'Max Drawdown',
      value: formatPercent(stats.maxDrawdown),
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'RSI (14)',
      value: formatNumber(stats.rsi, 1),
      icon: Activity,
      color: stats.rsi > 70 ? 'text-red-400' : stats.rsi < 30 ? 'text-green-400' : 'text-yellow-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'Skewness',
      value: formatNumber(stats.skewness, 4),
      icon: BarChart3,
      color: 'text-cyan-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'Kurtosis',
      value: formatNumber(stats.kurtosis, 4),
      icon: BarChart3,
      color: 'text-orange-400',
      bgColor: 'border-dark-100',
    },
    {
      label: 'Std Deviation',
      value: formatNumber(stats.stdDev, 6),
      icon: Activity,
      color: 'text-pink-400',
      bgColor: 'border-dark-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`lux-surface rounded-2xl p-4 border ${card.bgColor} transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-500/30`}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-[10px] uppercase tracking-[0.12em] text-gray-400">{card.label}</span>
            </div>
            <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
          </div>
        );
      })}
    </div>
  );
}
