# 🤖 RichonAgent — AI Business Intelligence Analyst Agent

An autonomous AI-powered business analysis agent that transforms raw business data into actionable insights, visualizations, and executive-level reports.

**Status:** v1.0 MVP | **Framework:** OpenAI Agents SDK | **License:** MIT

---

## 🇨🇳 中文简介

RichonAgent 是一款基于 **OpenAI Agents SDK** 构建的自主式 AI 商业智能分析师 Copilot。它能够自动化处理传统的商业分析全流程——从加载原始数据集、探索发现关键 KPI、识别时序趋势，到自动绘制可视化图表并生成高管级商业诊断报告（Executive Report）。

项目旨在解决企业中重度依赖人工清洗 Excel、算指标、做 Dashboard 和写总结报告的效率痛点，实现从“原始数据”到“商业决策洞察”的自动化跃迁。

---

## 🇬🇧 English Overview

RichonAgent is an autonomous AI-powered Business Intelligence Analyst Copilot built with the **OpenAI Agents SDK**. It automates the end-to-end business analytics workflow — from ingesting raw datasets, uncovering key performance indicators (KPIs), identifying market trends, generating charts, and producing structured executive management reports.

Designed to eliminate manual data wrangling, repetitive metrics calculation, and report generation in enterprise environments.

---

## 📌 当前项目阶段 | Current Project Stage

> **当前版本：v1.0 MVP (Minimum Viable Product)**

本项目已成功跑通从“非结构化/半结构化原始数据”到“确定性数据计算 + 商业决策报告”的全自动化闭环链路。设计上坚持 **“确定性计算交给代码 (Pandas/Python Tools)，模糊性总结交给大模型 (LLM Agent)”** 的工业级可靠架构。

为了方便轻量化测试与快速验证，项目内提供 **0 Token API 依赖** 的极简跑通闭环（支持一键跑通 90 天 TikTok 真实业务仿真案例）。

---

## 🚀 v1.0 MVP 实战案例展示 | Case Study & Visuals

在 v1.0 MVP 中，我们以 **TikTok 海外业务（90 天每日真实业务数据波形模拟）** 为典型实战案例，演示从 CSV 导入到自动捕获客诉异常点并生成高管诊断报告的全过程。

### 📊 自动化健康度看板 (Auto-Generated Dashboard)
系统自动解析时序趋势、绘制 7 日移动平均线（7-day MA），并通过 **3 倍标准差算法** 自动标红捕获业务异常点（如系统 Bug 导致的客诉量骤增事件）。  
*(生成图表存放在：`./output/tiktok_health_dashboard.png`)*

### 📄 高管级诊断报告示例 (Executive Diagnostic Report Preview)
输出标准的 Markdown 格式，具备“字节跳动 / 数据驱动”式的归因分析逻辑（报告源文件存放在 `./output/TikTok_Executive_Diagnostic_Report.md`）：

```markdown
# 📊 TikTok 海外业务健康度高管诊断报告 (Q1 总结)

## 1. 核心 KPI 概览 (Executive Summary)
| 指标名称 (Metric) | 统计数值 (Value) | 说明/单位 |
| :--- | :--- | :--- |
| **Total GMV** | $ 12,450,890 | 全周期电商销售额 |
| **Average DAU** | 10,240,500 | 日均活跃用户数 |
| **ARPU** | $ 1.22 | 整体单用户平均收入 |
| **D7 Retention** | 42.5% | 平均 7 日留存率 |

## 2. 异常点检测与归因分析 (Anomaly Diagnosis)
- 🚨 **第 45-47 天客诉突增异常 (User Complaints Anomaly):** 检测到 user_complaints 连续 3 天超过 3 倍标准差安全阈值（峰值达正常水平的 320%）。
- 📉 **下穿效应分析:** 故障期间导致当天 D7 留存率骤降 8.5%，同时造成约 $180,000 的潜在 GMV 转化损失。

## 3. 业务行动建议 (Actionable Insights)
1. **技术稳定性治理:** 建立对 Day 45 类系统 Bug 的实时监控熔断机制。
2. **变现效率优化:** SEA 市场 DAU 占比较高但 ARPU 较低，建议下季度优化本地化供应链。
```

---

## 🏗️ 系统架构与技术亮点 | Architecture & Technical Highlights

```text
Business Data (CSV)
       │
       ▼
┌───────────────────────────┐
│ Data Understanding Agent  │ ──> Schema & Profile Detection
└──────────────┬────────────┘
               │
               ▼
┌───────────────────────────┐
│     KPI Engine (Code)     │ ──> Aggregate Revenue, Growth, Margins
└──────────────┬────────────┘
               │
               ▼
┌───────────────────────────┐
│ Chart Generator (Code)    │ ──> Auto-generate PNG Visualizations
└──────────────┬────────────┘
               │
               ▼
┌───────────────────────────┐
│ Business Insight Agent    │ ──> Contextual Synthesis & Recommendations
└──────────────┬────────────┘
               │
               ▼
Executive Business Report (.md)
```

### 1. 技术选型 (Tech Stack)
- **AI Agent Framework:** OpenAI Agents SDK
- **Data Engine:** Python 3.10+, pandas, NumPy
- **Visualization:** Matplotlib, Seaborn
- **Environment:** python-dotenv

### 2. 代码设计亮点 (面试官/HR 查看看点)
- **Code & LLM Decoupling (算解分离/零幻觉保证):** 所有数值计算与异常高亮点均在底层的 Python/Pandas 代码中确定性跑出，Agent 仅负责分析逻辑调度与归纳提炼，彻底避免大模型在算数时的数值幻觉（Hallucination）。
- **Standardized Tool Interfaces (标准化工具接口):** 按照 OpenAI Tool Definition 标准进行入参与出参约束，代码易维护，后续可无缝接入 MCP (Model Context Protocol) 协议。
- **Zero-API Cost Lightweight Mode (轻量化单文件验证):** 内置 `run_tiktok_mvp_lite.py` 测试流程，无需依赖任何 API Key 即可本地跑通数据闭环，极具可移植性与测试效率。

---

## 📂 项目目录结构 | Project Structure

```text
RichonAgent/
├── README.md                 # Project Overview & Documentation
├── requirements.txt          # Python Dependencies
├── .env.example              # Environment Variable Template
├── run_tiktok_mvp_lite.py    # 🚀 Lightweight Single-File MVP Pipeline
│
├── src/
│   ├── config.py             # Global Config & Env Management
│   ├── tools.py              # Deterministic Analytics & Viz Tools (Pandas/Matplotlib)
│   ├── agent.py              # OpenAI Agent Definition & System Prompts
│   └── main.py               # Application Entry Point
│
├── data/
│   └── tiktok_daily_metrics.csv # Auto-generated 90-day Simulation Dataset
│
├── examples/
│   └── run_analysis.py       # Execution Example Script with OpenAI Agent
│
└── output/                   # Auto-generated Artifacts
    ├── TikTok_Executive_Diagnostic_Report.md # Generated Markdown Report
    └── tiktok_health_dashboard.png          # Generated Visualization Dashboard
```

---

## ⚡ 快速开始 | Quick Start

### 1. 克隆项目与安装依赖 | Clone & Installation
```bash
git clone https://github.com/tylerchan13/RichonAgent.git
cd RichonAgent
pip install -r requirements.txt
```

### 2. 一键跑通轻量化 MVP (无需 API Key) | Quick MVP Run
如果你想快速测试 MVP 分析闭环并查看图表与报告输出，可直接运行单文件 Pipeline：
```bash
python run_tiktok_mvp_lite.py
```
运行完成后，可在 `./output/` 文件夹下直接找到生成的图表 PNG 和诊断报告 `.md`！

### 3. 使用完整 AI Agent 模式 | Full Agent Run (Optional)
若要体验完整的 OpenAI Agent 调度模式，需先配置环境变量：
```bash
cp .env.example .env
```
在 `.env` 中填入你的 OpenAI API Key：
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```
运行 Agent 主程序：
```bash
python examples/run_analysis.py
```

---

## 🗺️ 发展路线图 | Roadmap

| 版本 (Version) | 核心能力 (Core Focus) | 状态 (Status) |
| :--- | :--- | :--- |
| **v1.0 MVP** | CSV 单文件解析、KPI 引擎计算、趋势挖掘、自动画图、Markdown 诊断报告生成。 | ✅ 已完成 (Completed) |
| **v2.0 Enhancement** | 支持 Excel/SQL 数据库接入、集成 Streamlit 可视化 UI 交互界面、异常检测 (Anomaly Detection)。 | 🔄 进行中 (In Progress) |
| **v3.0 Multi-Agent** | 重构为多智能体架构 (Planner, Data Analyst, Viz Expert, Strategy Consultant) & 集成 MCP 协议。 | 🔮 规划中 (Planned) |

---

## 📄 许可协议 | License

This project is licensed under the MIT License.
