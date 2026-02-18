import { NextRequest, NextResponse } from 'next/server';

interface CryptoCompareNewsItem {
  title: string;
  body: string;
  url: string;
  published_on: number;
  source: string;
  categories?: string;
}

interface CryptoCompareNewsResponse {
  Data?: CryptoCompareNewsItem[];
}

function matchesAsset(item: CryptoCompareNewsItem, symbol?: string, name?: string): boolean {
  const haystack = `${item.title} ${item.body} ${item.categories || ''}`.toLowerCase();
  const symbolText = symbol ? symbol.toLowerCase() : '';
  const nameText = name ? name.toLowerCase() : '';

  if (symbolText && haystack.includes(symbolText)) return true;
  if (nameText && haystack.includes(nameText)) return true;
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '';
  const name = searchParams.get('name') || '';
  const apiKey = process.env.CRYPTOCOMPARE_API_KEY;

  try {
    const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN', {
      headers: apiKey ? { Authorization: `Apikey ${apiKey}` } : undefined,
      cache: 'no-store',
    });

    if (!response.ok) {
      const details = await response.text();
      return NextResponse.json({ error: 'News provider failed.', details }, { status: 502 });
    }

    const data = (await response.json()) as CryptoCompareNewsResponse;
    const items = Array.isArray(data.Data) ? data.Data : [];
    const filtered = items.filter((item) => matchesAsset(item, symbol, name));
    const selected = (filtered.length ? filtered : items).slice(0, 6);

    const headlines = selected.map((item) => {
      const time = new Date(item.published_on * 1000).toISOString().slice(0, 10);
      return `${item.title} (${item.source}, ${time})`;
    });

    return NextResponse.json({ headlines });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'News provider failed.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
