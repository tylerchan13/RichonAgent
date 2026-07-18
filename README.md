# 🤖 RichonAgent — AI Business Intelligence Analyst Agent

> An autonomous AI-powered business analysis agent that transforms raw business data into actionable insights, visualizations, and executive-level reports.

RichonAgent is an AI Business Analyst Copilot built with the **OpenAI Agents SDK**. It automates the traditional business analytics workflow — from loading datasets, discovering KPIs, identifying trends, generating visualizations, and producing structured business reports.

Instead of manually exploring Excel files and creating dashboards, users can simply provide business data and let the agent generate analytical insights automatically.

---

# 🚀 Why RichonAgent?

Business teams spend significant time on repetitive analytical tasks:

- Cleaning raw datasets
- Calculating KPIs
- Identifying business trends
- Creating charts
- Writing management reports

RichonAgent automates this workflow through an AI Agent pipeline:

```
Business Data
(CSV / Excel / Database)

        ↓

Data Understanding Agent

        ↓

KPI & Trend Analysis

        ↓

Visualization Generation

        ↓

Business Insight Generation

        ↓

Executive Report
```

The goal is to build an AI-powered business analyst that can support decision-making across sales, operations, finance, and strategy teams.

---

# ✨ Key Features

## 📂 Automated Data Understanding

- Automatically loads CSV datasets
- Detects dataset structure
- Identifies numerical and categorical variables
- Generates dataset overview

Example:

```
Dataset:
- Rows: 10,000
- Columns: 12
- Key Metrics:
  Revenue
  Profit
  Quantity
  Region
```

---

## 📊 KPI Analysis Engine

Automatically calculates business metrics:

- Revenue performance
- Sales growth
- Profit analysis
- Average order value
- Product performance
- Regional contribution

---

## 📈 Trend Detection

The agent analyzes time-series data and identifies:

- Growth / decline patterns
- Period-over-period changes
- Maximum and minimum points
- Seasonal trends

Example output:

```
Revenue increased by 18% over the analyzed period.

The Northeast region contributed 42% of total revenue.

Product A showed continuous decline for 3 months.
```

---

## 🏆 Business Ranking Analysis

Automatically discovers top performers:

- Top 5 products
- Top regions
- Best-performing categories
- High-value segments

---

## 📉 AI Visualization Generation

Automatically generates business charts:

Supported:

- Line charts
- Bar charts
- Trend charts
- Performance comparisons

Generated outputs:

```
outputs/

├── trend_chart.png
└── report.md
```

---

## 📝 Executive Business Report Generation

Creates structured management reports:

Including:

- Business overview
- Key findings
- Performance analysis
- Risks
- Strategic recommendations

Example:

```
Executive Summary

Revenue increased by 15%.

Main growth driver:
Online channel (+23%).

Recommendation:
Increase inventory allocation
for high-growth categories.
```

---

# 🏗️ System Architecture

```
                 User

                  │

                  ▼

        Business Analysis Agent

                  │

     ┌────────────┼────────────┐

     ▼            ▼            ▼

 Data Loader   KPI Engine   Chart Generator

     │            │            │

     └────────────┼────────────┘

                  ▼

        Insight Generation

                  │

                  ▼

        Executive Report
```

---

# 🛠️ Technology Stack

## AI Framework

- OpenAI Agents SDK

## Data Processing

- Python
- pandas
- NumPy

## Visualization

- matplotlib

## Environment

- python-dotenv

---

# 📂 Project Structure

```
RichonAgent/

├── README.md

├── requirements.txt

├── .env.example

│

├── src/

│   ├── config.py
│   │      # Environment configuration
│
│   ├── tools.py
│   │      # Data analysis tools
│
│   ├── agent.py
│   │      # AI Agent definition
│
│   └── main.py
│          # Application entry point
│

├── data/

│   └── sample_sales.csv

│

├── examples/

│   └── run_analysis.py

│

└── outputs/

    ├── report.md

    └── charts/
```

---

# ⚡ Quick Start

## 1. Clone Repository

```bash
git clone https://github.com/tylerchan13/RichonAgent.git

cd RichonAgent
```

---

## 2. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 3. Configure API Key

Create `.env`

```bash
OPENAI_API_KEY=your_api_key

OPENAI_MODEL=gpt-4o-mini
```

---

## 4. Run Demo

```bash
python examples/run_analysis.py
```

Generated files:

```
outputs/

├── report.md

└── trend_chart.png
```

---

# 📌 Example Use Case

## Input

Sales dataset:

```
sales.csv

Columns:

Date
Product
Region
Revenue
Profit
Quantity
```

---

## Agent Output

```
Business Insights:

1.
Revenue increased 12% compared with previous period.

2.
Product A generated the highest revenue contribution.

3.
Region South shows the strongest growth potential.

Recommendations:

- Increase inventory for Product A.
- Investigate declining products.
- Expand marketing investment in South region.
```

---

# 💼 Business Applications

RichonAgent can support:

### Sales Analytics

- Revenue monitoring
- Product performance
- Regional analysis


### Business Operations

- Efficiency analysis
- Inventory insights
- Process optimization


### Marketing Analytics

- Customer segmentation
- Campaign performance


### Finance Analytics

- Profitability analysis
- Cost analysis
- Performance reporting

---

# 🗺️ Roadmap

## ✅ Version 1.0

- CSV data analysis
- KPI generation
- Trend analysis
- Visualization
- Markdown reports


## 🔄 Version 2.0

- Excel support
- SQL database integration
- Automated anomaly detection
- Root cause analysis


## 🔄 Version 3.0

Multi-Agent Architecture:

```
Planner Agent

      ↓

Data Analyst Agent

      ↓

Visualization Agent

      ↓

Business Consultant Agent

      ↓

Report Agent
```


## 🔮 Future Development

- RAG for financial reports and industry research
- Memory system
- MCP tool integration
- Streamlit dashboard
- API deployment
- Real-time business monitoring
- Stock research capability

---

# 🎯 Vision

RichonAgent aims to evolve into an **Enterprise AI Business Analyst** that combines data analytics, artificial intelligence, and business strategy to help organizations make faster and smarter decisions.

---

# 👨‍💻 Author

Tyler Chen

GitHub:
https://github.com/tylerchan13

---

# 📄 License

MIT License
