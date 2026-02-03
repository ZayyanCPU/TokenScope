<div align="center">

# 🔬 TokenScope

### Advanced Cryptocurrency Analytics & Visualization Platform

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Pandas](https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=pandas&logoColor=white)](https://pandas.pydata.org)
[![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)](https://numpy.org)
[![Matplotlib](https://img.shields.io/badge/Matplotlib-11557c?style=for-the-badge)](https://matplotlib.org)
[![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=jupyter&logoColor=white)](https://jupyter.org)

*A comprehensive Python-based analytics solution for cryptocurrency market data extraction, processing, and visualization.*

[Features](#-key-features) • [Tech Stack](#-tech-stack) • [Analysis Pipeline](#-analysis-pipeline) • [Results](#-results--insights) • [Getting Started](#-getting-started)

</div>

## 📋 Project Overview

**TokenScope** is a robust cryptocurrency data analysis platform that demonstrates end-to-end data engineering and analytics capabilities. The project showcases proficiency in API integration, data wrangling, statistical analysis, and data visualization—essential skills for Data Analyst and Data Scientist roles.

This project analyzes real-time market data for **Bitcoin (BTC)**, **Ethereum (ETH)**, and **Ripple (XRP)** from the CoinAPI platform, performing comprehensive statistical analysis and generating actionable insights through visualizations.

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **🔗 API Integration** | Automated data extraction from CoinAPI REST endpoints with configurable time ranges and trading pairs |
| **🧹 Data Preprocessing** | Robust data cleaning pipeline handling missing values, duplicates, and data normalization |
| **📊 Statistical Analysis** | Calculation of logarithmic returns, mean, median, standard deviation, and correlation matrices |
| **📈 Visualization Suite** | Historical price trend charts and comparative bar charts for mean returns analysis |
| **💾 Export Capabilities** | Automated CSV export of processed data for further analysis or reporting |

## 🛠 Tech Stack

```
├── Data Collection      → Requests (REST API Integration)
├── Data Processing      → Pandas, NumPy
├── Visualization        → Matplotlib
├── Development          → Jupyter Notebook, Python 3.8+
└── Data Source          → CoinAPI (OHLCV Data)
```

## 🔄 Analysis Pipeline

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Data Scraping  │───▶│  Data Cleaning  │───▶│  Transformation │
│   (CoinAPI)     │    │  & Structuring  │    │  (Log Returns)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                      │
                                                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Export (CSV)   │◀───│  Visualization  │◀───│   Statistical   │
│                 │    │                 │    │    Analysis     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Pipeline Stages:

1. **Data Extraction** — Connect to CoinAPI and retrieve OHLCV (Open, High, Low, Close, Volume) data for multiple cryptocurrencies
2. **Data Cleaning** — Remove null values, eliminate duplicates, and handle zero values in calculations
3. **Data Transformation** — Compute logarithmic returns using the formula: `log(price_open / price_close_previous)`
4. **Statistical Analysis** — Generate descriptive statistics and correlation matrices
5. **Visualization** — Create time series plots and comparative bar charts
6. **Data Export** — Save processed results to CSV format

## 📊 Results & Insights

### Statistical Analysis Results

| Metric | Bitcoin (BTC) | Ethereum (ETH) | Ripple (XRP) |
|--------|---------------|----------------|--------------|
| **Mean Return** | 7.61 × 10⁻⁵ | -1.37 × 10⁻⁵ | -8.65 × 10⁻⁵ |
| **Median Return** | -3.61 × 10⁻⁷ | -5.90 × 10⁻⁶ | -1.93 × 10⁻⁴ |
| **Std Deviation** | 5.68 × 10⁻⁴ | 2.62 × 10⁻⁴ | 4.64 × 10⁻⁴ |
| **Peak Return Date** | 2023-02-03 | 2023-02-10 | 2023-03-17 |

#### 📌 Key Findings:
- **Bitcoin** showed the highest positive mean return, indicating overall upward momentum
- **Ethereum** demonstrated the lowest volatility (standard deviation) among the three
- **Ripple** experienced the highest volatility with significant price swings

### 📈 Visualizations

#### Historical Price Trends

<div align="center">

| Bitcoin (BTC) | Ethereum (ETH) | Ripple (XRP) |
|:-------------:|:--------------:|:------------:|
| ![BTC Price](https://via.placeholder.com/250x150/1a1a2e/f5f5f5?text=BTC+%2416K→%2428K) | ![ETH Price](https://via.placeholder.com/250x150/1a1a2e/f5f5f5?text=ETH+%241.2K→%241.9K) | ![XRP Price](https://via.placeholder.com/250x150/1a1a2e/f5f5f5?text=XRP+%240.33→%240.51) |
| *Price rose from ~$16,000 to ~$28,000* | *Price increased from ~$1,200 to ~$1,900* | *Price grew from ~$0.33 to ~$0.51* |

</div>

#### Mean Returns Comparison

```
         Mean Logarithmic Returns (×10⁻⁵)
         
    8 │  ██████████
      │  ██████████  BTC: +7.61
    4 │  ██████████
      │  ██████████
    0 │──██████████──▓▓▓▓▓▓────────────────
      │              ▓▓▓▓▓▓  ETH: -1.37
   -4 │              ▓▓▓▓▓▓
      │                        ████████
   -8 │                        ████████  XRP: -8.65
      └────────────────────────────────────
              BTC      ETH      XRP
```

#### Correlation Matrix

```
         BTC    ETH    XRP
       ┌─────┬─────┬─────┐
  BTC  │ 1.0 │ 1.0 │ 1.0 │
       ├─────┼─────┼─────┤
  ETH  │ 1.0 │ 1.0 │ 1.0 │
       ├─────┼─────┼─────┤
  XRP  │ 1.0 │ 1.0 │ 1.0 │
       └─────┴─────┴─────┘
```
> **Note:** High correlation indicates cryptocurrencies tend to move together in the market

## 🚀 Getting Started

### Prerequisites

```bash
pip install pandas numpy matplotlib requests
```

### Usage

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TokenScope.git
cd TokenScope
```

2. Add your CoinAPI key in the notebook:
```python
headers = {"X-CoinAPI-Key": "YOUR_API_KEY"}
```

3. Run the Jupyter Notebook:
```bash
jupyter notebook TokenScope.ipynb
```

## 📁 Project Structure

```
TokenScope/
├── TokenScope.ipynb      # Main analysis notebook
├── README.md             # Project documentation
├── LICENSE               # License information
├── Bitcoin.csv           # Exported BTC data (generated)
├── Ethereum.csv          # Exported ETH data (generated)
└── Ripple.csv            # Exported XRP data (generated)
```

## 🎯 Skills Demonstrated

- **Data Engineering**: API integration, ETL pipeline development
- **Data Analysis**: Statistical analysis, time series analysis
- **Python Programming**: OOP principles, clean code practices
- **Data Visualization**: Effective communication of insights through charts
- **Problem Solving**: Handling edge cases in financial data

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Submit issues for bugs or feature requests
- Fork the repository and create pull requests
- Suggest improvements to the analysis methodology

<div align="center">

**Built with 💻 and ☕ by a passionate data enthusiast**

*If you found this project useful, consider giving it a ⭐*

</div>
