import { NextRequest, NextResponse } from 'next/server';

interface ChatContext {
  symbol: string;
  signal: string;
  confidence: number;
  currentPrice: number;
  rsi: number;
  volatility30d: number;
  sharpeRatio: number;
  maxDrawdown: number;
  priceChangePercent: number;
  newsSentiment: string;
  drivers: string[];
  risks: string[];
  chartSummary?: {
    priceChange30d: number;
    priceStart: number;
    priceEnd: number;
    rsiLatest: number;
    volatility30dLatest: number;
    volatility7dLatest: number;
  };
  chartSeries?: {
    prices: number[];
    rsi: number[];
    volatility30d: number[];
    volatility7d: number[];
    macd: number[];
    macdSignal: number[];
    sma7: number[];
    sma30: number[];
  };
}

interface ChatRequestBody {
  question: string;
  newsContext?: string;
  context: ChatContext;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const { question, context, newsContext = '' } = body;

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required.' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing GROQ_API_KEY.' }, { status: 503 });
    }

    const systemPrompt = [
      'You are TokenScope Analyst, a concise crypto market assistant.',
      'Use ONLY the provided metrics and news context.',
      'Always mention risk management and uncertainty.',
      'Do not promise profits or certainty.',
      'Keep the answer under 120 words and practical.',
      'End with: "Educational only, not financial advice."',
    ].join(' ');

    const userPrompt = `Market Context:\n- Symbol: ${context.symbol}\n- Recommendation Signal: ${context.signal} (${context.confidence}% confidence)\n- Current Price: ${context.currentPrice}\n- RSI: ${context.rsi}\n- Volatility30d: ${context.volatility30d}\n- Sharpe Ratio: ${context.sharpeRatio}\n- Max Drawdown: ${context.maxDrawdown}%\n- 365d Price Change: ${context.priceChangePercent}%\n- News Sentiment: ${context.newsSentiment}\n- Bullish Drivers: ${context.drivers.join('; ') || 'N/A'}\n- Risk Factors: ${context.risks.join('; ') || 'N/A'}\n- Chart Summary (last 30d): ${context.chartSummary ? JSON.stringify(context.chartSummary) : 'N/A'}\n- Chart Series (last 30d arrays): ${context.chartSeries ? JSON.stringify(context.chartSeries) : 'N/A'}\n- News Headlines Context: ${newsContext || 'N/A'}\n\nUser Question: ${question}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 220,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json({ error: 'Chat provider failed.', details }, { status: 502 });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return NextResponse.json({ error: 'No response from chatbot provider.' }, { status: 502 });
    }

    return NextResponse.json({
      reply: answer,
      provider: 'Groq (free tier)',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unexpected chatbot error.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'Missing GROQ_API_KEY.' }, { status: 503 });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json(
        { ok: false, error: 'Groq connection failed.', details },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Groq connection failed.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
