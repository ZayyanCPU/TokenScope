<div align="center">

# 🔬 TokenScope

### Advanced Cryptocurrency Analytics Dashboard

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://tokenscope-beta.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

*A comprehensive cryptocurrency analytics platform demonstrating data engineering, feature engineering, statistical analysis, and interactive visualization skills.*

[🌐 Live Demo](https://tokenscope-beta.vercel.app) • [Features](#-key-features) • [Tech Stack](#-tech-stack) • [Deployment](#-deployment-to-vercel) • [Getting Started](#-getting-started) • [Contact](#-contact)

</div>

---

## 👨‍💻 About the Developer

<table>
<tr>
<td width="150px">
<img src="https://github.com/ZayyanCPU.png" width="100px" style="border-radius: 50%;" alt="Zayyan Ahmad"/>
</td>
<td>

**Zayyan Ahmad** - Data Analyst & Full-Stack Developer

This project demonstrates my proficiency in end-to-end data analytics and web development. From API integration and data preprocessing to feature engineering and interactive visualization.

[![Email](https://img.shields.io/badge/Email-zayyanahmad765%40gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:zayyanahmad765@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-ZayyanCPU-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/ZayyanCPU)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-zayyan--ahmad-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/zayyan-ahmad/)

</td>
</tr>
</table>

---

## 📋 Project Overview

**TokenScope** is a full-stack cryptocurrency analytics platform that showcases end-to-end data engineering and analytics capabilities:

- 🔗 **API Integration** - Real-time data fetching from CoinGecko API
- 🧹 **Data Engineering** - ETL pipelines, data cleaning, and preprocessing
- 🔧 **Feature Engineering** - Technical indicators and derived metrics
- 📊 **Statistical Analysis** - Comprehensive statistical computations
- 📈 **Data Visualization** - Interactive charts and dashboards
- 🌐 **Web Development** - Modern React/Next.js application

### 📁 Project Structure

```
TokenScope/
├── 📓 TokenScope.ipynb      # Jupyter Notebook (Python analysis)
├── 🌐 web/                   # Next.js Web Application
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities & calculations
│   ├── package.json
│   └── vercel.json          # Deployment config
├── 📄 README.md
└── 📜 LICENSE
```

## ✨ Key Features

### 🌐 Web Application (NEW!)

| Feature | Description |
|---------|-------------|
| **🔍 Real-time Analysis** | Live data from CoinGecko API (FREE - no API key required!) |
| **📊 Interactive Charts** | Price trends, Bollinger Bands, RSI, MACD, Volatility |
| **📈 Technical Indicators** | SMA, EMA, RSI, MACD, Bollinger Bands, Rolling Volatility |
| **📋 Statistical Summary** | Mean, Median, Std Dev, Skewness, Kurtosis, Sharpe Ratio |
| **💾 CSV Export** | Download all data with engineered features |
| **🎨 Modern UI** | Dark theme, responsive design, glass-morphism effects |
| **⚡ 10+ Cryptocurrencies** | BTC, ETH, XRP, SOL, ADA, DOGE, DOT, LINK, AVAX, MATIC |

### 📓 Jupyter Notebook

| Feature | Description |
|---------|-------------|
| **🔗 API Integration** | CoinAPI integration with fallback options |
| **🧹 Data Preprocessing** | Missing value handling, outlier detection |
| **📐 Feature Engineering** | 15+ engineered features |
| **📊 Statistical Analysis** | Normality tests, risk metrics |
| **🎮 Interactive Widgets** | ipywidgets-based dashboard UI |

## 🛠 Tech Stack

### Web Application
```
├── Framework           → Next.js 14 (App Router)
├── Language            → TypeScript
├── Styling             → Tailwind CSS
├── Charts              → Recharts
├── Icons               → Lucide React
├── API                 → CoinGecko (Free, No Key Required!)
└── Deployment          → Vercel
```

### Jupyter Notebook
```
├── Language            → Python 3.8+
├── Data Processing     → Pandas, NumPy
├── Visualization       → Matplotlib, Plotly
├── Statistics          → SciPy
├── Interactive UI      → ipywidgets
└── API                 → CoinAPI / CoinGecko
```

## � Engineered Features

### Price Features
| Feature | Formula |
|---------|---------|
| Simple Returns | $(P_t - P_{t-1}) / P_{t-1}$ |
| Log Returns | $\ln(P_t / P_{t-1})$ |
| Cumulative Returns | $\prod(1 + r_t) - 1$ |

### Technical Indicators
| Indicator | Description |
|-----------|-------------|
| **SMA (7, 30)** | Simple Moving Averages |
| **EMA (12, 26)** | Exponential Moving Averages |
| **RSI (14)** | Relative Strength Index |
| **MACD** | Moving Average Convergence Divergence |
| **Bollinger Bands** | 20-day with 2σ bands |
| **Rolling Volatility** | 7-day and 30-day |

### Risk Metrics
| Metric | Formula |
|--------|---------|
| Sharpe Ratio | $S = \frac{E[R_p] - R_f}{\sigma_p}$ |
| Max Drawdown | Peak-to-trough decline |
| VaR (95%) | Value at Risk |

## 🌐 Deployment to Vercel

### Quick Deploy (Recommended)

1. **Fork this repository** to your GitHub account

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
   - **Set Root Directory to `web`**
   - Click "Deploy"

3. **Your app is live!** 🎉

### Using Vercel CLI

```bash
# Navigate to web directory
cd web

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

> 💡 **No environment variables needed!** The app uses the free CoinGecko API.

## 🚀 Getting Started

### Web Application (Recommended)

```bash
# Clone the repository
git clone https://github.com/ZayyanCPU/TokenScope.git
cd TokenScope/web

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Optional: Enable Free AI Chatbot (Groq)

The analyst chatbot can use Groq's free-tier model for richer responses.

1. Create a free key at `https://console.groq.com/keys`
2. In `web`, create `.env.local`:

```bash
GROQ_API_KEY=your_groq_api_key
# optional
GROQ_MODEL=llama-3.1-8b-instant
```

If not configured, the app automatically falls back to the built-in rule-based chatbot.

### Jupyter Notebook
```bash
# Install Python dependencies
pip install pandas numpy matplotlib plotly scipy requests ipywidgets

# Run Jupyter Notebook
jupyter notebook TokenScope.ipynb
```

## 💼 Skills Demonstrated

This project showcases proficiency in:

| Category | Skills |
|----------|--------|
| **Data Engineering** | REST API Integration, ETL Pipelines, Data Cleaning |
| **Feature Engineering** | Technical Indicators, Statistical Features, Time Series |
| **Statistical Analysis** | Descriptive Stats, Risk Metrics, Distribution Analysis |
| **Data Visualization** | Interactive Dashboards, Time Series Charts, Technical Charts |
| **Web Development** | React, Next.js, TypeScript, Tailwind CSS |
| **Python** | Pandas, NumPy, SciPy, Plotly, OOP |
| **DevOps** | Vercel Deployment, Git, CI/CD |

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko](https://www.coingecko.com/) - Free cryptocurrency API
- [CoinAPI](https://www.coinapi.io/) - Premium cryptocurrency data
- [Recharts](https://recharts.org/) - React charting library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📡 Data Source & Legal Information

### CoinGecko API (Used in Web App)

| Aspect | Details |
|--------|---------|
| **Provider** | [CoinGecko](https://www.coingecko.com/) |
| **API Key Required** | ❌ **NO** - Public API, no registration needed |
| **Cost** | 🆓 **FREE** for public endpoints |
| **Rate Limit** | ~10-30 calls/minute (public tier) |
| **Legal Status** | ✅ **Fully Legal** - Public API for non-commercial use |
| **Terms of Use** | [CoinGecko Terms](https://www.coingecko.com/en/terms) |

#### Why CoinGecko?
- **No API Key Required** - Perfect for portfolio projects and demos
- **Free Tier** - Generous limits for personal/educational use
- **Reliable Data** - Trusted source used by major crypto platforms
- **Legal** - Explicitly allows public API access for non-commercial projects

#### API Endpoints Used
```
GET https://api.coingecko.com/api/v3/coins/{id}/market_chart
Parameters: vs_currency=usd, days=365
```

### Attribution
This project uses publicly available cryptocurrency market data from CoinGecko's free API. CoinGecko provides this data under their standard terms of service which permits usage in non-commercial and educational projects.

---

## 📬 Contact

I'm always open to discussing data analytics, web development opportunities, or just having a chat about tech!

| Method | Link |
|--------|------|
| 📧 Email | [zayyanahmad765@gmail.com](mailto:zayyanahmad765@gmail.com) |
| 💼 LinkedIn | [linkedin.com/in/zayyan-ahmad](https://www.linkedin.com/in/zayyan-ahmad/) |
| 🐙 GitHub | [github.com/ZayyanCPU](https://github.com/ZayyanCPU) |

---

<div align="center">

**⭐ If you found this project useful, please consider giving it a star!**

Made by [Zayyan Ahmad](https://github.com/ZayyanCPU) | [LinkedIn](https://www.linkedin.com/in/zayyan-ahmad/) | [Email](mailto:zayyanahmad765@gmail.com)

[🔝 Back to Top](#-tokenscope)

</div>
