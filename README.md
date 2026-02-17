# TokenScope

A cryptocurrency analytics platform that blends data engineering, feature engineering, and interactive visualization into a modern web dashboard.

**Live Demo:** https://tokenscope-beta.vercel.app/

## Overview

TokenScope provides on-demand market analysis for major crypto assets with:
- Real-time data ingestion from CoinGecko (free, no API key required)
- 15+ engineered technical features (RSI, MACD, volatility, Bollinger Bands, moving averages)
- Statistical risk metrics and CSV export
- Analyst chatbot that can reason over computed factors and chart summaries

## Key Features

- **Market analytics dashboard** with price, trend, volatility, and momentum signals
- **Bento-style UI** with structured panels and chart navigation
- **Volatility risk table** with selectable time ranges
- **Analyst chatbot** with optional Groq API integration
- **CSV export** for further analysis

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide
- **Data:** CoinGecko public API
- **AI (optional):** Groq API (free tier)

## Project Structure

```
TokenScope/
├── TokenScope.ipynb          # Jupyter notebook (Python analysis)
├── web/                      # Next.js application
│   ├── src/
│   │   ├── app/              # App router
│   │   ├── components/       # UI components
│   │   └── lib/              # Data + analytics utilities
│   └── package.json
└── README.md
```

## Getting Started (Web)

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Optional: Groq Chatbot Setup

To enable LLM responses:

1. Create a Groq key: https://console.groq.com/keys
2. Add to `web/.env.local`:

```bash
GROQ_API_KEY=your_key
# optional
GROQ_MODEL=llama-3.1-8b-instant
```

Restart the dev server after setting env vars.

## Deployment (Vercel)

1. Import the repo in Vercel
2. Set **Root Directory** to `web`
3. Add env vars (if using Groq):
   - `GROQ_API_KEY`
   - `GROQ_MODEL` (optional)
   - `NEXT_PUBLIC_SITE_URL` (recommended)
4. Deploy

## Data Source

- **CoinGecko** public API (free, no key required)
- Endpoint used:
  - `GET https://api.coingecko.com/api/v3/coins/{id}/market_chart`

## License

MIT License

## Contact

**Zayyan Ahmad**
- Email: zayyanahmad765@gmail.com
- GitHub: https://github.com/ZayyanCPU
- LinkedIn: https://www.linkedin.com/in/zayyan-ahmad/
