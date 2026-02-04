import { CryptoPrice, CryptoData, CRYPTO_LIST } from './types';
import { calculateAllFeatures } from './calculations';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Fetch crypto data from CoinGecko
export async function fetchCryptoData(cryptoId: string, days: number = 365): Promise<CryptoData | null> {
  try {
    const crypto = CRYPTO_LIST.find(c => c.id === cryptoId);
    if (!crypto) return null;

    const response = await fetch(
      `${COINGECKO_API}/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}&interval=daily`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const prices: CryptoPrice[] = data.prices.map((p: [number, number], i: number) => ({
      timestamp: new Date(p[0]),
      price: p[1],
      volume: data.total_volumes[i]?.[1] || 0,
      marketCap: data.market_caps[i]?.[1] || 0,
    }));

    const features = calculateAllFeatures(prices);

    return {
      id: cryptoId,
      symbol: crypto.symbol,
      name: crypto.name,
      prices,
      features,
    };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return null;
  }
}

// Fetch multiple cryptos for comparison
export async function fetchMultipleCryptos(cryptoIds: string[]): Promise<CryptoData[]> {
  const results = await Promise.all(cryptoIds.map(id => fetchCryptoData(id, 365)));
  return results.filter((r): r is CryptoData => r !== null);
}

// Generate sample data as fallback
export function generateSampleData(cryptoId: string): CryptoData {
  const crypto = CRYPTO_LIST.find(c => c.id === cryptoId) || CRYPTO_LIST[0];
  
  const basePrices: Record<string, number> = {
    'bitcoin': 45000,
    'ethereum': 2500,
    'ripple': 0.55,
    'solana': 100,
    'cardano': 0.45,
    'dogecoin': 0.08,
    'polkadot': 7,
    'chainlink': 15,
    'avalanche-2': 35,
    'matic-network': 0.85,
  };

  const basePrice = basePrices[cryptoId] || 100;
  const prices: CryptoPrice[] = [];
  
  // Generate 365 days of realistic price data
  let currentPrice = basePrice;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);

  for (let i = 0; i < 365; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Random walk with trend
    const change = (Math.random() - 0.48) * 0.05; // Slight upward bias
    currentPrice *= (1 + change);
    
    prices.push({
      timestamp: date,
      price: currentPrice,
      volume: Math.random() * 1e10 + 1e9,
      marketCap: currentPrice * (Math.random() * 1e8 + 1e7),
    });
  }

  const features = calculateAllFeatures(prices);

  return {
    id: cryptoId,
    symbol: crypto.symbol,
    name: crypto.name,
    prices,
    features,
  };
}
