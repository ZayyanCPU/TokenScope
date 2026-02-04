// Cryptocurrency data types
export interface CryptoPrice {
  timestamp: Date;
  price: number;
  volume: number;
  marketCap: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  prices: CryptoPrice[];
  features?: FeatureData;
}

export interface FeatureData {
  logReturns: number[];
  simpleReturns: number[];
  cumulativeReturns: number[];
  sma7: number[];
  sma30: number[];
  ema12: number[];
  ema26: number[];
  volatility7d: number[];
  volatility30d: number[];
  rsi: number[];
  macd: number[];
  macdSignal: number[];
  macdHistogram: number[];
  bbUpper: number[];
  bbMiddle: number[];
  bbLower: number[];
}

export interface StatsData {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent: number;
  allTimeHigh: number;
  allTimeLow: number;
  meanReturn: number;
  medianReturn: number;
  stdDev: number;
  skewness: number;
  kurtosis: number;
  sharpeRatio: number;
  maxDrawdown: number;
  volatility30d: number;
  rsi: number;
}

// Available cryptocurrencies
export const CRYPTO_LIST = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#f7931a' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627eea' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', color: '#00aae4' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#00ffa3' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', color: '#0033ad' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', color: '#c2a633' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', color: '#e6007a' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', color: '#2a5ada' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', color: '#e84142' },
  { id: 'matic-network', symbol: 'MATIC', name: 'Polygon', color: '#8247e5' },
];
