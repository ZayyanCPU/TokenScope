import { CryptoPrice, FeatureData, StatsData } from './types';

// Calculate logarithmic returns
export function calculateLogReturns(prices: number[]): number[] {
  const returns: number[] = [0];
  for (let i = 1; i < prices.length; i++) {
    returns.push(Math.log(prices[i] / prices[i - 1]));
  }
  return returns;
}

// Calculate simple returns
export function calculateSimpleReturns(prices: number[]): number[] {
  const returns: number[] = [0];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
}

// Calculate cumulative returns
export function calculateCumulativeReturns(simpleReturns: number[]): number[] {
  const cumulative: number[] = [];
  let cum = 1;
  for (const r of simpleReturns) {
    cum *= (1 + r);
    cumulative.push(cum - 1);
  }
  return cumulative;
}

// Simple Moving Average
export function calculateSMA(prices: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      sma.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return sma;
}

// Exponential Moving Average
export function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // Start with SMA for first value
  let sum = 0;
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sum += prices[i];
      ema.push(NaN);
    } else if (i === period - 1) {
      sum += prices[i];
      ema.push(sum / period);
    } else {
      ema.push((prices[i] - ema[i - 1]) * multiplier + ema[i - 1]);
    }
  }
  return ema;
}

// Rolling Standard Deviation (Volatility)
export function calculateVolatility(returns: number[], period: number): number[] {
  const volatility: number[] = [];
  for (let i = 0; i < returns.length; i++) {
    if (i < period - 1) {
      volatility.push(NaN);
    } else {
      const slice = returns.slice(i - period + 1, i + 1).filter(v => !isNaN(v));
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / slice.length;
      volatility.push(Math.sqrt(variance) * Math.sqrt(period));
    }
  }
  return volatility;
}

// RSI (Relative Strength Index)
export function calculateRSI(prices: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      rsi.push(NaN);
      continue;
    }
    
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
    
    if (i < period) {
      rsi.push(NaN);
    } else {
      const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }
  return rsi;
}

// MACD
export function calculateMACD(prices: number[]): { macd: number[], signal: number[], histogram: number[] } {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  const macd: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    macd.push(ema12[i] - ema26[i]);
  }
  
  const signal = calculateEMA(macd.filter(v => !isNaN(v)), 9);
  // Pad signal to match length
  const paddedSignal: number[] = new Array(macd.length - signal.length).fill(NaN).concat(signal);
  
  const histogram: number[] = [];
  for (let i = 0; i < macd.length; i++) {
    histogram.push(macd[i] - (paddedSignal[i] || 0));
  }
  
  return { macd, signal: paddedSignal, histogram };
}

// Bollinger Bands
export function calculateBollingerBands(prices: number[], period: number = 20): { upper: number[], middle: number[], lower: number[] } {
  const middle = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = middle[i];
      const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      upper.push(mean + 2 * std);
      lower.push(mean - 2 * std);
    }
  }
  
  return { upper, middle, lower };
}

// Calculate all features
export function calculateAllFeatures(priceData: CryptoPrice[]): FeatureData {
  const prices = priceData.map(p => p.price);
  
  const simpleReturns = calculateSimpleReturns(prices);
  const logReturns = calculateLogReturns(prices);
  const cumulativeReturns = calculateCumulativeReturns(simpleReturns);
  
  const sma7 = calculateSMA(prices, 7);
  const sma30 = calculateSMA(prices, 30);
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  const volatility7d = calculateVolatility(logReturns, 7);
  const volatility30d = calculateVolatility(logReturns, 30);
  
  const rsi = calculateRSI(prices);
  const { macd, signal: macdSignal, histogram: macdHistogram } = calculateMACD(prices);
  const { upper: bbUpper, middle: bbMiddle, lower: bbLower } = calculateBollingerBands(prices);
  
  return {
    logReturns,
    simpleReturns,
    cumulativeReturns,
    sma7,
    sma30,
    ema12,
    ema26,
    volatility7d,
    volatility30d,
    rsi,
    macd,
    macdSignal,
    macdHistogram,
    bbUpper,
    bbMiddle,
    bbLower,
  };
}

// Statistical calculations
export function mean(arr: number[]): number {
  const valid = arr.filter(v => !isNaN(v) && isFinite(v));
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

export function median(arr: number[]): number {
  const valid = arr.filter(v => !isNaN(v) && isFinite(v)).sort((a, b) => a - b);
  const mid = Math.floor(valid.length / 2);
  return valid.length % 2 !== 0 ? valid[mid] : (valid[mid - 1] + valid[mid]) / 2;
}

export function stdDev(arr: number[]): number {
  const valid = arr.filter(v => !isNaN(v) && isFinite(v));
  const m = mean(valid);
  const variance = valid.reduce((a, b) => a + Math.pow(b - m, 2), 0) / valid.length;
  return Math.sqrt(variance);
}

export function skewness(arr: number[]): number {
  const valid = arr.filter(v => !isNaN(v) && isFinite(v));
  const n = valid.length;
  const m = mean(valid);
  const s = stdDev(valid);
  const sum = valid.reduce((a, b) => a + Math.pow((b - m) / s, 3), 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

export function kurtosis(arr: number[]): number {
  const valid = arr.filter(v => !isNaN(v) && isFinite(v));
  const n = valid.length;
  const m = mean(valid);
  const s = stdDev(valid);
  const sum = valid.reduce((a, b) => a + Math.pow((b - m) / s, 4), 0);
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
}

// Calculate max drawdown
export function calculateMaxDrawdown(prices: number[]): number {
  let maxDrawdown = 0;
  let peak = prices[0];
  
  for (const price of prices) {
    if (price > peak) {
      peak = price;
    }
    const drawdown = (peak - price) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return -maxDrawdown * 100;
}

// Calculate comprehensive stats
export function calculateStats(priceData: CryptoPrice[], features: FeatureData): StatsData {
  const prices = priceData.map(p => p.price);
  const logReturns = features.logReturns.filter(v => !isNaN(v) && isFinite(v));
  
  const currentPrice = prices[prices.length - 1];
  const previousPrice = prices[prices.length - 2] || currentPrice;
  const firstPrice = prices[0];
  
  const meanReturn = mean(logReturns);
  const stdDevReturn = stdDev(logReturns);
  
  // Annualized Sharpe Ratio (assuming 0 risk-free rate)
  const sharpeRatio = (meanReturn / stdDevReturn) * Math.sqrt(365);
  
  return {
    currentPrice,
    priceChange24h: currentPrice - previousPrice,
    priceChangePercent: ((currentPrice - firstPrice) / firstPrice) * 100,
    allTimeHigh: Math.max(...prices),
    allTimeLow: Math.min(...prices),
    meanReturn,
    medianReturn: median(logReturns),
    stdDev: stdDevReturn,
    skewness: skewness(logReturns),
    kurtosis: kurtosis(logReturns),
    sharpeRatio: isFinite(sharpeRatio) ? sharpeRatio : 0,
    maxDrawdown: calculateMaxDrawdown(prices),
    volatility30d: features.volatility30d[features.volatility30d.length - 1] || 0,
    rsi: features.rsi[features.rsi.length - 1] || 50,
  };
}

// Export to CSV
export function exportToCSV(priceData: CryptoPrice[], features: FeatureData, symbol: string): void {
  const headers = [
    'Timestamp', 'Price', 'Volume', 'Market_Cap',
    'Log_Return', 'Simple_Return', 'Cumulative_Return',
    'SMA_7', 'SMA_30', 'EMA_12', 'EMA_26',
    'Volatility_7d', 'Volatility_30d',
    'RSI', 'MACD', 'MACD_Signal', 'MACD_Histogram',
    'BB_Upper', 'BB_Middle', 'BB_Lower'
  ];
  
  const rows = priceData.map((p, i) => [
    p.timestamp.toISOString(),
    p.price,
    p.volume,
    p.marketCap,
    features.logReturns[i],
    features.simpleReturns[i],
    features.cumulativeReturns[i],
    features.sma7[i],
    features.sma30[i],
    features.ema12[i],
    features.ema26[i],
    features.volatility7d[i],
    features.volatility30d[i],
    features.rsi[i],
    features.macd[i],
    features.macdSignal[i],
    features.macdHistogram[i],
    features.bbUpper[i],
    features.bbMiddle[i],
    features.bbLower[i],
  ]);
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `TokenScope_${symbol}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
