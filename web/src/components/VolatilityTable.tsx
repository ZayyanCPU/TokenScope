'use client';

import { CryptoData } from '@/lib/types';

interface VolatilityTableProps {
  data: CryptoData;
  rangeLabel?: string;
  rangeDetail?: string;
}

function riskBadge(volatility: number): { label: string; className: string } {
  if (volatility >= 0.26) {
    return { label: 'Very High', className: 'bg-red-500/20 text-red-300 border border-red-500/40' };
  }
  if (volatility >= 0.2) {
    return { label: 'High', className: 'bg-orange-500/20 text-orange-300 border border-orange-500/40' };
  }
  if (volatility >= 0.14) {
    return { label: 'Moderate', className: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' };
  }
  return { label: 'Low', className: 'bg-green-500/20 text-green-300 border border-green-500/40' };
}

export default function VolatilityTable({ data, rangeLabel, rangeDetail }: VolatilityTableProps) {
  if (!data.features) return null;

  const badgeText = rangeLabel || 'Last 12 days in range';
  const detailText = rangeDetail ? `Range: ${rangeDetail}` : 'Range: Full history';

  const rows = data.prices
    .map((pricePoint, index) => {
      const simpleReturn = data.features?.simpleReturns[index] ?? NaN;
      const volatility7d = data.features?.volatility7d[index] ?? NaN;
      const volatility30d = data.features?.volatility30d[index] ?? NaN;

      return {
        date: pricePoint.timestamp,
        price: pricePoint.price,
        simpleReturn,
        volatility7d,
        volatility30d,
      };
    })
    .filter((row) => Number.isFinite(row.volatility7d) && Number.isFinite(row.volatility30d))
    .slice(-12)
    .reverse();

  return (
    <div className="lux-surface rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary-300">Volatility Risk Table</h3>
          <p className="text-xs text-gray-400">Highlighted view of recent 7D/30D volatility and risk state.</p>
          <p className="text-xs text-gray-500 mt-1">{detailText}</p>
        </div>
        <div className="lux-chip rounded-lg px-3 py-1 text-xs font-semibold">
          {badgeText}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-dark-100/80 text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Price (USD)</th>
              <th className="px-3 py-2">Daily Return</th>
              <th className="px-3 py-2">Vol 7D</th>
              <th className="px-3 py-2">Vol 30D</th>
              <th className="px-3 py-2">Risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const badge = riskBadge(row.volatility30d);
              const dailyReturnPct = row.simpleReturn * 100;

              return (
                <tr key={row.date.toISOString()} className="border-b border-dark-100/50 text-gray-200">
                  <td className="px-3 py-2.5">{row.date.toLocaleDateString()}</td>
                  <td className="px-3 py-2.5">${row.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className={`px-3 py-2.5 font-medium ${dailyReturnPct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {dailyReturnPct >= 0 ? '+' : ''}
                    {dailyReturnPct.toFixed(2)}%
                  </td>
                  <td className="px-3 py-2.5">{row.volatility7d.toFixed(4)}</td>
                  <td className="px-3 py-2.5">{row.volatility30d.toFixed(4)}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-semibold ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
