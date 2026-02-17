'use client';

import { useEffect, useMemo, useState } from 'react';
import { CryptoData, StatsData } from '@/lib/types';
import { generateMarketRecommendation } from '@/lib/insights';
import { Bot, SendHorizonal } from 'lucide-react';

interface AnalystChatbotProps {
  data: CryptoData;
  stats: StatsData;
}

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export default function AnalystChatbot({ data, stats }: AnalystChatbotProps) {
  const [question, setQuestion] = useState('');
  const [newsContext, setNewsContext] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [providerLabel, setProviderLabel] = useState('Groq');
  const [apiStatus, setApiStatus] = useState<'checking' | 'ready' | 'error'>('checking');
  const [apiStatusText, setApiStatusText] = useState('Checking Groq...');

  const recommendation = useMemo(() => {
    return generateMarketRecommendation(stats, data, newsContext);
  }, [stats, data, newsContext]);

  useEffect(() => {
    const checkGroq = async () => {
      setApiStatus('checking');
      setApiStatusText('Checking Groq...');

      try {
        const response = await fetch('/api/chat', { method: 'GET' });
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          const errorText = payload?.error || 'Groq unavailable.';
          setApiStatus('error');
          setApiStatusText(errorText);
          return;
        }

        setApiStatus('ready');
        setApiStatusText('Groq connected');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Groq unavailable.';
        setApiStatus('error');
        setApiStatusText(message);
      }
    };

    checkGroq();
  }, []);

  useEffect(() => {
    setMessages([]);
    setQuestion('');
    setNewsContext('');
    setProviderLabel('Groq');
  }, [data.symbol]);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userQuestion = question.trim();
    setMessages((previous) => [...previous, { role: 'user', text: userQuestion }]);
    setQuestion('');

    setLoading(true);
    try {
      const prices = data.prices.map((point) => point.price);
      const lastIndex = prices.length - 1;
      const firstIndex = Math.max(0, prices.length - 30);
      const lastPrices = prices.slice(firstIndex);
      const lastRsi = data.features?.rsi.slice(firstIndex) ?? [];
      const lastVol30 = data.features?.volatility30d.slice(firstIndex) ?? [];
      const lastVol7 = data.features?.volatility7d.slice(firstIndex) ?? [];
      const lastMacd = data.features?.macd.slice(firstIndex) ?? [];
      const lastSignal = data.features?.macdSignal.slice(firstIndex) ?? [];
      const lastSma7 = data.features?.sma7.slice(firstIndex) ?? [];
      const lastSma30 = data.features?.sma30.slice(firstIndex) ?? [];

      const priceStart = prices[firstIndex] ?? stats.currentPrice;
      const priceEnd = prices[lastIndex] ?? stats.currentPrice;
      const priceChange = priceStart ? ((priceEnd - priceStart) / priceStart) * 100 : 0;
      const rsiLatest = data.features?.rsi[lastIndex] ?? stats.rsi;
      const vol30Latest = data.features?.volatility30d[lastIndex] ?? stats.volatility30d;
      const vol7Latest = data.features?.volatility7d[lastIndex] ?? stats.volatility30d;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userQuestion,
          newsContext,
          context: {
            symbol: data.symbol,
            signal: recommendation.signal,
            confidence: recommendation.confidence,
            currentPrice: stats.currentPrice,
            rsi: stats.rsi,
            volatility30d: stats.volatility30d,
            sharpeRatio: stats.sharpeRatio,
            maxDrawdown: stats.maxDrawdown,
            priceChangePercent: stats.priceChangePercent,
            newsSentiment: recommendation.newsSentiment,
            drivers: recommendation.drivers,
            risks: recommendation.risks,
            chartSummary: {
              priceChange30d: Number(priceChange.toFixed(2)),
              priceStart: Number(priceStart.toFixed(2)),
              priceEnd: Number(priceEnd.toFixed(2)),
              rsiLatest: Number(rsiLatest.toFixed(2)),
              volatility30dLatest: Number(vol30Latest.toFixed(4)),
              volatility7dLatest: Number(vol7Latest.toFixed(4)),
            },
            chartSeries: {
              prices: lastPrices,
              rsi: lastRsi,
              volatility30d: lastVol30,
              volatility7d: lastVol7,
              macd: lastMacd,
              macdSignal: lastSignal,
              sma7: lastSma7,
              sma30: lastSma30,
            },
          },
        }),
      });

      let payload: any = null;

      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const errorText = payload?.error || 'Groq request failed.';
        const detailText = payload?.details ? ` Details: ${payload.details}` : '';
        setProviderLabel('Groq error');
        setMessages((previous) => [
          ...previous,
          { role: 'bot', text: `${errorText}${detailText}` },
        ]);
        return;
      }

      const botText = payload?.reply;

      if (!botText) {
        setProviderLabel('Groq error');
        setMessages((previous) => [
          ...previous,
          { role: 'bot', text: 'Groq returned an empty response.' },
        ]);
        return;
      }

      setProviderLabel(payload?.provider || 'Groq');
      setMessages((previous) => [...previous, { role: 'bot', text: botText }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error contacting Groq.';
      setProviderLabel('Groq error');
      setMessages((previous) => [...previous, { role: 'bot', text: message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lux-surface rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary-400" />
        <h3 className="text-lg font-semibold text-white">Analyst Chatbot</h3>
        <div className="ml-auto flex items-center gap-2 rounded-lg border border-dark-100 bg-dark-500 px-2.5 py-1 text-[11px] text-gray-300">
          <span className={`h-2 w-2 rounded-full ${apiStatus === 'ready' ? 'bg-green-400' : apiStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`} />
          <span>{apiStatusText}</span>
          <span className="text-gray-500">•</span>
          <span>{providerLabel}</span>
        </div>
      </div>

      <div className="lux-card lux-border mb-4 rounded-xl p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-gray-400">Recommendation</span>
          <span className="rounded-lg bg-dark-500 px-2 py-1 text-xs font-semibold text-primary-300">
            {recommendation.signal}
          </span>
          <span className="rounded-lg bg-dark-500 px-2 py-1 text-xs text-gray-300">
            Confidence {recommendation.confidence}%
          </span>
          <span className="rounded-lg bg-dark-500 px-2 py-1 text-xs text-gray-300">
            News Sentiment: {recommendation.newsSentiment}
          </span>
        </div>
        <p className="text-sm text-gray-200">{recommendation.summary}</p>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-green-400">Bullish / Supportive Factors</p>
            <ul className="space-y-1 text-xs text-gray-300">
              {recommendation.drivers.slice(0, 4).map((driver) => (
                <li key={driver}>• {driver}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-red-400">Risk Factors</p>
            <ul className="space-y-1 text-xs text-gray-300">
              {(recommendation.risks.length ? recommendation.risks : ['No major risk flags from current inputs.'])
                .slice(0, 4)
                .map((risk) => (
                  <li key={risk}>• {risk}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-xs uppercase tracking-wider text-gray-400">
          Optional News Context (paste headlines)
        </label>
        <textarea
          value={newsContext}
          onChange={(event) => setNewsContext(event.target.value)}
          rows={3}
          placeholder="Example: ETF approval rumors, exchange outage, partnership announcement..."
          className="w-full rounded-xl border border-dark-100 bg-dark-500 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
        />
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {['What does RSI say now?', 'How risky is current volatility?', 'Should I buy now or wait?'].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setQuestion(preset)}
            className="rounded-xl border border-dark-100 bg-dark-500 px-3 py-1.5 text-xs text-gray-300 transition hover:border-primary-500 hover:text-primary-300"
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about entry, RSI, volatility, or risk management..."
          className="w-full rounded-xl border border-dark-100 bg-dark-500 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-3 py-2 text-sm font-semibold text-dark-500 transition hover:bg-primary-400"
        >
          <SendHorizonal className="h-4 w-4" />
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>

      <div className="mt-4 max-h-60 space-y-2 overflow-y-auto rounded-xl border border-dark-100 bg-dark-500 p-3">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-400">Ask a question to get factor-based recommendation output.</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-md px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'ml-8 rounded-xl border border-primary-500/20 bg-primary-500/10 text-primary-100'
                  : 'mr-8 rounded-xl border border-dark-100 bg-dark-300 text-gray-200'
              }`}
            >
              {message.text}
            </div>
          ))
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Groq API responses only. Ensure your key is valid and server restarted. Educational insights only, not financial advice.
      </p>
    </div>
  );
}
