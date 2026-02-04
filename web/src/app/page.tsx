'use client';

import { useState } from 'react';
import { CryptoData, CRYPTO_LIST } from '@/lib/types';
import { fetchCryptoData, generateSampleData } from '@/lib/api';
import { calculateStats, exportToCSV } from '@/lib/calculations';
import CryptoSelector from '@/components/CryptoSelector';
import StatsCards from '@/components/StatsCards';
import Charts from '@/components/Charts';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Search, Download, RefreshCw, Github, Sparkles, TrendingUp, 
  BarChart3, Activity, Linkedin, Mail, ExternalLink, 
  Zap, Database, LineChart, Brain, Code2, Rocket,
  ChevronDown, Star
} from 'lucide-react';

export default function Home() {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('');

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
    } catch (err) {
      const sampleData = generateSampleData(selectedCrypto);
      setCryptoData(sampleData);
      setDataSource('Sample Data (Demo)');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (cryptoData && cryptoData.features) {
      exportToCSV(cryptoData.prices, cryptoData.features, cryptoData.symbol);
    }
  };

  const stats = cryptoData?.features 
    ? calculateStats(cryptoData.prices, cryptoData.features) 
    : null;

  const cryptoInfo = CRYPTO_LIST.find(c => c.id === selectedCrypto);

  const scrollToAnalysis = () => {
    document.getElementById('analysis-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-dark-300 to-dark-300" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-dark-300/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-dark-300 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  TokenScope
                </h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Analytics Dashboard</p>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/ZayyanCPU"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/zayyan-ahmad/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </a>
              <a
                href="mailto:zayyanahmad765@gmail.com"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 transition-all duration-300 group"
              >
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-bounce delay-100">₿</div>
          <div className="absolute top-40 right-20 text-4xl opacity-10 animate-bounce delay-300">Ξ</div>
          <div className="absolute bottom-40 left-1/4 text-5xl opacity-10 animate-bounce delay-500">◎</div>
          <div className="absolute bottom-20 right-1/3 text-3xl opacity-10 animate-bounce delay-700">₳</div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-20 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8 animate-slide-up">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-400">Real-time Crypto Analytics</span>
            <span className="px-2 py-0.5 text-xs bg-primary-500/20 rounded-full text-primary-300">v2.0</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <span className="bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent">
              Cryptocurrency
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligence Hub
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            Advanced analytics platform featuring <span className="text-primary-400">feature engineering</span>, 
            {' '}<span className="text-purple-400">technical indicators</span>, and 
            {' '}<span className="text-pink-400">statistical analysis</span> for cryptocurrency markets.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up" style={{ animationDelay: '300ms' }}>
            {[
              { icon: Database, label: 'Data Engineering', color: 'from-blue-500 to-cyan-500' },
              { icon: Brain, label: 'Feature Engineering', color: 'from-purple-500 to-pink-500' },
              { icon: LineChart, label: 'Technical Analysis', color: 'from-green-500 to-emerald-500' },
              { icon: BarChart3, label: 'Statistical Insights', color: 'from-orange-500 to-yellow-500' },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className={`p-1.5 rounded-lg bg-gradient-to-r ${feature.color}`}>
                  <feature.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-300">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <button
              onClick={scrollToAnalysis}
              className="group relative px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 animate-gradient-x" />
              <div className="absolute inset-[2px] bg-dark-300 rounded-2xl" />
              <span className="relative flex items-center gap-2 bg-gradient-to-r from-primary-400 to-pink-400 bg-clip-text text-transparent">
                <Rocket className="w-5 h-5 text-primary-400 group-hover:animate-bounce" />
                Start Analysis
              </span>
            </button>
            
            <a
              href="https://github.com/ZayyanCPU/TokenScope"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-gray-300 hover:text-white"
            >
              <Github className="w-5 h-5" />
              View Source
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ChevronDown className="w-6 h-6 text-gray-500 mx-auto" />
          </div>
        </div>
      </section>

      {/* Analysis Section */}
      <section id="analysis-section" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                Analyze Any Cryptocurrency
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Select a cryptocurrency below to generate comprehensive analytics with 15+ engineered features
            </p>
          </div>

          {/* Control Panel */}
          <div className="relative mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
            <div className="relative glass-card rounded-3xl p-8 border border-white/10">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Crypto Selector */}
                <div className="flex-1 w-full lg:w-auto">
                  <label className="block text-sm text-gray-400 mb-2">Select Cryptocurrency</label>
                  <CryptoSelector
                    selectedCrypto={selectedCrypto}
                    onSelect={setSelectedCrypto}
                    disabled={loading}
                  />
                </div>
                
                {/* Buttons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="group relative px-8 py-4 rounded-xl font-bold overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-purple-600" />
                    <span className="relative flex items-center gap-2 text-white">
                      {loading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      )}
                      {loading ? 'Analyzing...' : 'Analyze Now'}
                    </span>
                  </button>

                  {cryptoData && (
                    <button
                      onClick={handleDownloadCSV}
                      className="flex items-center gap-2 px-6 py-4 rounded-xl font-semibold
                               bg-gradient-to-r from-green-500/20 to-emerald-500/20 
                               hover:from-green-500/30 hover:to-emerald-500/30 
                               text-green-400 border border-green-500/30 
                               transition-all duration-300 hover:scale-105"
                    >
                      <Download className="w-5 h-5" />
                      Export CSV
                    </button>
                  )}
                </div>
              </div>

              {/* Data Source Info */}
              {dataSource && (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400">{dataSource}</span>
                  </div>
                  {cryptoData && (
                    <>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20">
                        <Database className="w-4 h-4 text-primary-400" />
                        <span className="text-primary-400">{cryptoData.prices.length} data points</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
                        <Code2 className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400">16 engineered features</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && <LoadingSpinner message={`Analyzing ${cryptoInfo?.name || 'cryptocurrency'}...`} />}

          {/* Error State */}
          {error && (
            <div className="glass-card rounded-xl p-6 border-l-4 border-red-500 mb-8">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Results */}
          {!loading && cryptoData && stats && (
            <div className="space-y-12 animate-slide-up">
              {/* Crypto Header Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-3xl blur-xl" />
                <div className="relative glass-card rounded-3xl p-8 border border-white/10">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black shadow-2xl"
                      style={{ 
                        backgroundColor: `${cryptoInfo?.color}15`, 
                        color: cryptoInfo?.color,
                        boxShadow: `0 20px 40px ${cryptoInfo?.color}20`
                      }}
                    >
                      {cryptoInfo?.symbol.charAt(0)}
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl font-bold text-white mb-1">{cryptoInfo?.name}</h3>
                      <p className="text-gray-400">{cryptoInfo?.symbol}/USD • 365 Days Analysis</p>
                    </div>
                    <div className="md:ml-auto flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Current Price</p>
                        <p className="text-2xl font-bold text-white">
                          ${stats.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl ${stats.priceChangePercent >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {stats.priceChangePercent >= 0 ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary-500/20">
                    <BarChart3 className="w-5 h-5 text-primary-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Statistical Summary</h3>
                </div>
                <StatsCards stats={stats} symbol={cryptoData.symbol} />
              </div>

              {/* Charts */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-purple-500/20">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Technical Analysis</h3>
                </div>
                <Charts data={cryptoData} />
              </div>

              {/* Feature Engineering Summary */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl" />
                <div className="relative glass-card rounded-3xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500">
                      <Code2 className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                      Feature Engineering Pipeline
                    </span>
                  </h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/50 transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-primary-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">Price Features</h4>
                      <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-400 rounded-full" /> Simple Returns</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-400 rounded-full" /> Logarithmic Returns</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary-400 rounded-full" /> Cumulative Returns</li>
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/50 transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4">
                        <LineChart className="w-6 h-6 text-yellow-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">Moving Averages</h4>
                      <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" /> SMA (7, 30 day)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" /> EMA (12, 26 day)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" /> Bollinger Bands</li>
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6 text-red-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-3">Technical Indicators</h4>
                      <ul className="space-y-2 text-gray-400 text-sm">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> RSI (14-day)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> MACD + Signal</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> Rolling Volatility</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Initial State */}
          {!loading && !cryptoData && (
            <div className="text-center py-20">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500/20 to-purple-500/20 flex items-center justify-center animate-pulse">
                  <Search className="w-16 h-16 text-primary-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
                  <Zap className="w-4 h-4 text-black" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Analyze</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Select a cryptocurrency and click &quot;Analyze Now&quot; to generate comprehensive insights
              </p>
              
              {/* Quick Select Buttons */}
              <div className="flex flex-wrap justify-center gap-3">
                {CRYPTO_LIST.slice(0, 6).map((crypto) => (
                  <button
                    key={crypto.id}
                    onClick={() => {
                      setSelectedCrypto(crypto.id);
                      setTimeout(handleAnalyze, 100);
                    }}
                    className="group px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
                  >
                    <span className="font-bold" style={{ color: crypto.color }}>{crypto.symbol}</span>
                    <span className="text-gray-500 ml-2 text-sm">{crypto.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                About This Project
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A portfolio project demonstrating data analytics and full-stack development skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* About Card */}
            <div className="glass-card rounded-3xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary-400" />
                Project Overview
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                <span className="text-white font-semibold">TokenScope</span> is a comprehensive cryptocurrency analytics dashboard 
                that showcases end-to-end data engineering capabilities. From API integration and data cleaning 
                to feature engineering and interactive visualization.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary-400 rounded-full" />
                  <span className="text-gray-300">Real-time data from CoinGecko API</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-gray-300">15+ engineered features & technical indicators</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-pink-400 rounded-full" />
                  <span className="text-gray-300">Interactive visualizations with Recharts</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-300">CSV export for further analysis</span>
                </div>
              </div>
            </div>

            {/* Tech Stack Card */}
            <div className="glass-card rounded-3xl p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                Tech Stack
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Next.js 14', color: 'bg-white/10 text-white' },
                  { name: 'TypeScript', color: 'bg-blue-500/20 text-blue-400' },
                  { name: 'Tailwind CSS', color: 'bg-cyan-500/20 text-cyan-400' },
                  { name: 'Recharts', color: 'bg-purple-500/20 text-purple-400' },
                  { name: 'CoinGecko API', color: 'bg-green-500/20 text-green-400' },
                  { name: 'Vercel', color: 'bg-white/10 text-white' },
                ].map((tech) => (
                  <div key={tech.name} className={`px-4 py-3 rounded-xl ${tech.color} text-center font-medium text-sm`}>
                    {tech.name}
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-3">Skills Demonstrated:</p>
                <div className="flex flex-wrap gap-2">
                  {['Data Engineering', 'Feature Engineering', 'Statistics', 'React', 'API Integration'].map((skill) => (
                    <span key={skill} className="px-3 py-1 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="mt-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
            <div className="relative glass-card rounded-3xl p-8 border border-white/10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-primary-500/25">
                  ZA
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Zayyan Ahmad</h3>
                  <p className="text-gray-400 mb-4">Data Analyst & Full-Stack Developer</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <a
                      href="mailto:zayyanahmad765@gmail.com"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all duration-300"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">zayyanahmad765@gmail.com</span>
                    </a>
                    <a
                      href="https://github.com/ZayyanCPU"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">ZayyanCPU</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/zayyan-ahmad/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  </div>
                </div>
                <div className="hidden md:block">
                  <a
                    href="https://github.com/ZayyanCPU/TokenScope"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105"
                  >
                    <Star className="w-4 h-4" />
                    Star on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">TokenScope</p>
                <p className="text-xs text-gray-500">By Zayyan Ahmad</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Built with Next.js & Tailwind CSS</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Deployed on Vercel</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline text-yellow-500/80">For Educational Purpose Only</span>
            </div>

            <div className="flex items-center gap-3">
              <a href="https://github.com/ZayyanCPU" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Github className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
              <a href="https://www.linkedin.com/in/zayyan-ahmad/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400" />
              </a>
              <a href="mailto:zayyanahmad765@gmail.com" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <Mail className="w-5 h-5 text-gray-400 hover:text-red-400" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
