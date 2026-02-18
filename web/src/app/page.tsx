'use client';

import { useMemo, useState } from 'react';
import { CryptoData, CRYPTO_LIST } from '@/lib/types';
import { fetchCryptoData, generateSampleData } from '@/lib/api';
import { calculateStats, exportToCSV } from '@/lib/calculations';
import CryptoSelector from '@/components/CryptoSelector';
import StatsCards from '@/components/StatsCards';
import Charts from '@/components/Charts';
import LoadingSpinner from '@/components/LoadingSpinner';
import VolatilityTable from '@/components/VolatilityTable';
import AnalystChatbot from '@/components/AnalystChatbot';
import {
  Search,
  Download,
  RefreshCw,
  BarChart3,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

type RangePreset = '30d' | '90d' | '180d' | '365d' | 'custom';

const RANGE_OPTIONS = [
  { label: '30D', value: '30d', days: 30 },
  { label: '90D', value: '90d', days: 90 },
  { label: '180D', value: '180d', days: 180 },
  { label: '1Y', value: '365d', days: 365 },
  { label: 'Custom', value: 'custom' },
] as const;

export default function Home() {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [rangePreset, setRangePreset] = useState<RangePreset>('365d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCryptoData(selectedCrypto);

      if (data) {
        setCryptoData(data);
        setDataSource('CoinGecko API (Live)');
      } else {
        const sampleData = generateSampleData(selectedCrypto);
        setCryptoData(sampleData);
        setDataSource('Sample Data (Demo)');
      }
    } catch {
      const sampleData = generateSampleData(selectedCrypto);
      setCryptoData(sampleData);
      setDataSource('Sample Data (Demo)');
    } finally {
      setLoading(false);
    }
  };

  const dateBounds = useMemo(() => {
    if (!cryptoData?.prices.length) return null;
    return {
      start: cryptoData.prices[0].timestamp,
      end: cryptoData.prices[cryptoData.prices.length - 1].timestamp,
    };
  }, [cryptoData]);

  const resolvedRange = useMemo(() => {
    if (!dateBounds) return null;

    if (rangePreset === 'custom') {
      const startCandidate = customStart ? new Date(customStart) : dateBounds.start;
      const endCandidate = customEnd ? new Date(customEnd) : dateBounds.end;
      const start = Number.isNaN(startCandidate.getTime()) ? dateBounds.start : startCandidate;
      const end = Number.isNaN(endCandidate.getTime()) ? dateBounds.end : endCandidate;
      return { start, end, label: 'Custom' };
    }

    const option = RANGE_OPTIONS.find((entry) => entry.value === rangePreset);
    const days = option && 'days' in option ? option.days : 365;
    const end = dateBounds.end;
    const start = new Date(end);
    start.setDate(end.getDate() - days + 1);
    return { start, end, label: option?.label ?? '1Y' };
  }, [customEnd, customStart, dateBounds, rangePreset]);

  const activeData = useMemo(() => {
    if (!cryptoData || !resolvedRange) return cryptoData;

    const startTime = Math.min(resolvedRange.start.getTime(), resolvedRange.end.getTime());
    const endTime = Math.max(resolvedRange.start.getTime(), resolvedRange.end.getTime());
    const indices: number[] = [];
    const prices = cryptoData.prices.filter((pricePoint, index) => {
      const time = pricePoint.timestamp.getTime();
      if (time >= startTime && time <= endTime) {
        indices.push(index);
        return true;
      }
      return false;
    });

    if (!prices.length) return cryptoData;

    const features = cryptoData.features
      ? (Object.fromEntries(
          Object.entries(cryptoData.features).map(([key, values]) => [
            key,
            indices.map((i) => values[i]),
          ])
        ) as unknown as typeof cryptoData.features)
      : undefined;

    return {
      ...cryptoData,
      prices,
      features,
    };
  }, [cryptoData, resolvedRange]);

  const stats = activeData?.features
    ? calculateStats(activeData.prices, activeData.features)
    : null;

  const rangeDetail = useMemo(() => {
    if (!resolvedRange) return 'Full history';
    const startLabel = resolvedRange.start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const endLabel = resolvedRange.end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${startLabel} - ${endLabel}`;
  }, [resolvedRange]);

  const inputMin = dateBounds ? dateBounds.start.toISOString().slice(0, 10) : '';
  const inputMax = dateBounds ? dateBounds.end.toISOString().slice(0, 10) : '';

  const handleDownloadCSV = () => {
    if (activeData && activeData.features) {
      exportToCSV(activeData.prices, activeData.features, activeData.symbol);
    }
  };

  const cryptoInfo = CRYPTO_LIST.find((crypto) => crypto.id === selectedCrypto);

  return (
    <main className="min-h-screen bg-dark-500 text-gray-100">
      <header className="sticky top-0 z-50 border-b border-dark-100/70 bg-dark-500/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <img
              src="/icon.svg"
              alt="TokenScope"
              className="h-10 w-10 rounded-xl border border-primary-500/30"
            />
            <div>
              <h1 className="text-base font-semibold text-white">TokenScope</h1>
              <p className="text-xs text-gray-400">Luxury Crypto Intelligence Suite</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pt-10 pb-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <h2 className="lux-heading text-4xl font-semibold text-white md:text-6xl">
              The <span className="lux-text-gradient">TokenScope</span> intelligence grid for
              <br />
              multi-factor crypto decisions.
            </h2>
            <p className="max-w-2xl text-sm text-gray-300 md:text-base">
              Combine momentum, volatility, RSI, and engineered indicators in a structured bento workspace.
              Get instant recommendations with a premium, high-clarity layout.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Engineered Signals', 'Volatility Heat', 'Chatbot Analyst', 'Exportable Data'].map((label) => (
                <div key={label} className="lux-surface rounded-full px-4 py-2 text-xs text-gray-300">
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="lux-surface rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Market Pulse</p>
              <div className="lux-chip rounded-full px-3 py-1 text-[11px]">
                {loading ? 'Live Scan' : 'Ready'}
              </div>
            </div>
            <div className="mt-4 flex items-end gap-3">
              <h3 className="text-3xl font-semibold text-white">{cryptoInfo?.symbol}/USDT</h3>
              <span className="text-sm text-gray-400">{cryptoInfo?.name}</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="lux-card rounded-xl p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Source</p>
                <p className="mt-2 text-sm font-semibold text-white">{dataSource || 'Awaiting analysis'}</p>
              </div>
              <div className="lux-card rounded-xl p-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Status</p>
                <p className={`mt-2 text-sm font-semibold ${loading ? 'text-primary-300' : 'text-green-400'}`}>
                  {loading ? 'Analyzing market...' : 'Standing by'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="h-4 w-4 text-primary-300" />
              Data refreshed on demand. Signals are informational only.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="lux-surface rounded-3xl p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto]">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-400">Trading Pair</label>
                <CryptoSelector
                  selectedCrypto={selectedCrypto}
                  onSelect={setSelectedCrypto}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-400">Date Range</label>
                <div className="flex flex-wrap gap-2">
                  {RANGE_OPTIONS.map((option) => {
                    const active = rangePreset === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRangePreset(option.value)}
                        className={`rounded-full px-3 py-1.5 text-xs transition ${
                          active
                            ? 'bg-primary-500/20 text-primary-200 border border-primary-500/50'
                            : 'bg-dark-400 text-gray-400 border border-dark-100/70 hover:border-primary-500/50 hover:text-primary-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {rangePreset === 'custom' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <input
                      type="date"
                      value={customStart}
                      min={inputMin}
                      max={inputMax}
                      onChange={(event) => setCustomStart(event.target.value)}
                      className="rounded-xl border border-dark-100 bg-dark-400 px-3 py-2 text-xs text-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="date"
                      value={customEnd}
                      min={inputMin}
                      max={inputMax}
                      onChange={(event) => setCustomEnd(event.target.value)}
                      className="rounded-xl border border-dark-100 bg-dark-400 px-3 py-2 text-xs text-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-end gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary-500 px-5 py-3 text-sm font-semibold text-dark-500 shadow-lg shadow-primary-500/30 transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  {loading ? 'Analyzing' : 'Run Analysis'}
                </button>

                {activeData && (
                  <button
                    onClick={handleDownloadCSV}
                    className="inline-flex items-center gap-2 rounded-2xl border border-primary-500/30 bg-primary-500/10 px-5 py-3 text-sm font-semibold text-primary-200 transition hover:bg-primary-500/20"
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lux-surface rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Snapshot</p>
            {stats ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-400">Current Price</p>
                  <p className="text-2xl font-semibold text-white">
                    ${stats.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${
                  stats.priceChangePercent >= 0
                    ? 'bg-green-500/15 text-green-300'
                    : 'bg-red-500/15 text-red-300'
                }`}>
                  365D Change {stats.priceChangePercent >= 0 ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500">Range: {rangeDetail}</p>
              </div>
            ) : (
              <div className="mt-4 text-sm text-gray-400">
                Run analysis to reveal live metrics and confidence indicators.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        {loading && <LoadingSpinner message={`Analyzing ${cryptoInfo?.name || 'market'}...`} />}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {!loading && activeData && stats && (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lux-surface lg:col-span-12 rounded-3xl p-6">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary-300" />
                <h3 className="text-lg font-semibold text-white">Market Statistics</h3>
              </div>
              <StatsCards stats={stats} />
            </div>

            <div className="lg:col-span-7">
              <VolatilityTable
                data={activeData}
                rangeLabel="Last 12 days in range"
                rangeDetail={rangeDetail}
              />
            </div>

            <div className="lg:col-span-5">
              <AnalystChatbot data={activeData} stats={stats} />
            </div>

            <div className="lg:col-span-12">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-300" />
                <h3 className="text-lg font-semibold text-white">Technical Charts</h3>
              </div>
              <Charts data={activeData} rangeLabel={rangeDetail} />
            </div>
          </div>
        )}

        {!loading && !activeData && (
          <div className="lux-surface rounded-3xl px-6 py-14 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-400">No active analysis</p>
            <h3 className="lux-heading mt-4 text-3xl font-semibold text-white">Start with a trading pair</h3>
            <p className="mt-2 text-sm text-gray-400">
              Choose an asset and run analysis to unlock volatility tables, signals, and recommendations.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {CRYPTO_LIST.slice(0, 6).map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => {
                    setSelectedCrypto(crypto.id);
                    setTimeout(handleAnalyze, 100);
                  }}
                  className="rounded-2xl border border-dark-100 bg-dark-400 px-4 py-2 text-sm text-gray-300 transition hover:border-primary-500 hover:text-primary-200"
                >
                  {crypto.symbol}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-dark-100/70 bg-dark-400/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 text-xs text-gray-500 md:flex-row">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-200">Zayyan Ahmad</p>
              <p className="text-xs text-gray-500">Aspring ML Engineeri</p>
            </div>
          </div>
            
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="mailto:zayyanahmad765@gmail.com"
              className="rounded-full border border-dark-100 px-3 py-1 text-gray-300 transition hover:border-primary-500 hover:text-primary-200"
            >
              Email
            </a>
            <a
              href="https://github.com/ZayyanCPU"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-dark-100 px-3 py-1 text-gray-300 transition hover:border-primary-500 hover:text-primary-200"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/zayyan-ahmad/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-dark-100 px-3 py-1 text-gray-300 transition hover:border-primary-500 hover:text-primary-200"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
