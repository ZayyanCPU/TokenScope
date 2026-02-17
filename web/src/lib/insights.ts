import { CryptoData, StatsData } from './types';

export type RecommendationSignal = 'Strong Buy' | 'Buy' | 'Hold' | 'Reduce Risk';

export interface MarketRecommendation {
  signal: RecommendationSignal;
  confidence: number;
  score: number;
  summary: string;
  drivers: string[];
  risks: string[];
  newsSentiment: 'Positive' | 'Neutral' | 'Negative';
}

function safeLast(values: number[] | undefined, fallback: number = 0): number {
  if (!values || values.length === 0) return fallback;
  const value = values[values.length - 1];
  if (Number.isNaN(value) || !Number.isFinite(value)) return fallback;
  return value;
}

function evaluateNewsSentiment(newsText: string): {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
} {
  if (!newsText.trim()) {
    return { sentiment: 'Neutral', score: 0 };
  }

  const positiveWords = ['etf', 'approval', 'partnership', 'adoption', 'breakout', 'upgrade', 'growth', 'surge'];
  const negativeWords = ['hack', 'ban', 'lawsuit', 'rejection', 'crash', 'selloff', 'exploit', 'bankruptcy'];

  const text = newsText.toLowerCase();
  const positiveHits = positiveWords.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
  const negativeHits = negativeWords.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);

  const score = positiveHits - negativeHits;
  if (score > 0) return { sentiment: 'Positive', score: 1 };
  if (score < 0) return { sentiment: 'Negative', score: -1 };
  return { sentiment: 'Neutral', score: 0 };
}

export function generateMarketRecommendation(
  stats: StatsData,
  data: CryptoData,
  newsText: string
): MarketRecommendation {
  const features = data.features;
  const priceSeries = data.prices;

  const latestPrice = priceSeries[priceSeries.length - 1]?.price || stats.currentPrice;
  const sma7 = safeLast(features?.sma7, latestPrice);
  const sma30 = safeLast(features?.sma30, latestPrice);
  const macd = safeLast(features?.macd, 0);
  const macdSignal = safeLast(features?.macdSignal, 0);
  const volatility7d = safeLast(features?.volatility7d, 0);

  const news = evaluateNewsSentiment(newsText);
  const drivers: string[] = [];
  const risks: string[] = [];
  let score = 0;

  if (latestPrice > sma30) {
    score += 1;
    drivers.push('Price is trading above the 30-day average trend.');
  } else {
    score -= 1;
    risks.push('Price is below the 30-day average trend.');
  }

  if (sma7 > sma30) {
    score += 1;
    drivers.push('Short-term momentum (SMA-7) is stronger than medium-term trend (SMA-30).');
  } else {
    score -= 1;
    risks.push('Short-term momentum is weaker than the medium-term trend.');
  }

  if (macd > macdSignal) {
    score += 1;
    drivers.push('MACD is above signal line, suggesting positive momentum shift.');
  } else {
    score -= 1;
    risks.push('MACD is below signal line, signaling momentum weakness.');
  }

  if (stats.rsi < 35) {
    score += 1;
    drivers.push(`RSI is ${stats.rsi.toFixed(1)}, showing oversold recovery potential.`);
  } else if (stats.rsi > 70) {
    score -= 2;
    risks.push(`RSI is ${stats.rsi.toFixed(1)}, indicating overbought conditions.`);
  } else {
    drivers.push(`RSI is ${stats.rsi.toFixed(1)}, currently in a neutral zone.`);
  }

  if (stats.volatility30d > 0.22 || volatility7d > 0.2) {
    score -= 1;
    risks.push('Recent volatility is elevated, which increases downside risk and position sizing pressure.');
  } else {
    drivers.push('Volatility remains controlled compared to common crypto stress levels.');
  }

  if (stats.sharpeRatio > 1) {
    score += 1;
    drivers.push(`Sharpe ratio at ${stats.sharpeRatio.toFixed(2)} supports stronger risk-adjusted performance.`);
  } else if (stats.sharpeRatio < 0) {
    score -= 1;
    risks.push(`Sharpe ratio at ${stats.sharpeRatio.toFixed(2)} signals weak recent risk-adjusted returns.`);
  }

  score += news.score;
  if (news.sentiment === 'Positive') {
    drivers.push('Provided news context appears net positive.');
  }
  if (news.sentiment === 'Negative') {
    risks.push('Provided news context appears net negative.');
  }

  let signal: RecommendationSignal = 'Hold';
  if (score >= 4) signal = 'Strong Buy';
  else if (score >= 2) signal = 'Buy';
  else if (score <= -2) signal = 'Reduce Risk';

  const baseConfidence = 58 + Math.min(Math.abs(score) * 8, 28);
  const riskPenalty = stats.volatility30d > 0.22 ? 8 : 0;
  const confidence = Math.max(50, Math.min(92, baseConfidence - riskPenalty));

  const summaryBySignal: Record<RecommendationSignal, string> = {
    'Strong Buy': 'Multiple technical factors align bullishly with supportive risk-adjusted profile.',
    Buy: 'Technical setup is constructive, but risk controls and staged entries are still important.',
    Hold: 'Signals are mixed. Wait for clearer trend confirmation before increasing exposure.',
    'Reduce Risk': 'Risk factors dominate the setup. Consider reducing exposure or waiting for stabilization.',
  };

  return {
    signal,
    confidence,
    score,
    summary: summaryBySignal[signal],
    drivers,
    risks,
    newsSentiment: news.sentiment,
  };
}

export function answerWithFactors(
  question: string,
  recommendation: MarketRecommendation,
  stats: StatsData
): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('volatility')) {
    return `30D volatility is ${stats.volatility30d.toFixed(4)}. ${
      stats.volatility30d > 0.22
        ? 'This is in a high-risk zone, so tighter stop-loss and smaller position sizing are recommended.'
        : 'This is relatively controlled for crypto, so trend signals can be weighted a bit more.'
    }`;
  }

  if (lowerQuestion.includes('rsi')) {
    return `RSI is currently ${stats.rsi.toFixed(1)}. ${
      stats.rsi > 70
        ? 'The asset is overbought, so pullback risk is elevated.'
        : stats.rsi < 30
        ? 'The asset is oversold, so rebound probability improves if momentum confirms.'
        : 'The asset is in a neutral RSI range.'
    }`;
  }

  if (lowerQuestion.includes('buy') || lowerQuestion.includes('sell') || lowerQuestion.includes('entry')) {
    return `Current signal is ${recommendation.signal} with ${recommendation.confidence}% confidence. ${recommendation.summary}`;
  }

  return `Signal: ${recommendation.signal} (${recommendation.confidence}% confidence). Main read: ${recommendation.summary}`;
}
