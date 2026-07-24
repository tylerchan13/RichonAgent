# 🤖 RichonAgent — AI Business Intelligence Analyst Agent

> An autonomous AI-powered business analysis agent that transforms raw business data into actionable insights, visualizations, and executive-level reports.

![Status](https://img.shields.io/badge/Status-v1.0_MVP-blue)
![Framework](https://img.shields.io/badge/Framework-OpenAI_Agents_SDK-purple)
![License](https://img.shields.io/badge/License-MIT-green)

---

### 💡 语言切换 / Language
[中文说明](#-中文简介) | [English Version](#-english-overview)

---

## 🇨🇳 中文简介

**RichonAgent** 是一款基于 **OpenAI Agents SDK** 构建的自主式 AI 商业智能分析师 Copilot。它能够自动化处理传统的商业分析全流程——从加载原始数据集、探索发现关键 KPI、识别时序趋势，到自动绘制可视化图表并生成高管级商业诊断报告（Executive Report）。

项目旨在解决企业中重度依赖人工清洗 Excel、算指标、做 Dashboard 和写总结报告的效率痛点，实现从“原始数据”到“商业决策洞察”的自动化跃迁。

## 🇬🇧 English Overview

**RichonAgent** is an autonomous AI-powered Business Intelligence Analyst Copilot built with the **OpenAI Agents SDK**. It automates the end-to-end business analytics workflow — from ingesting raw datasets, uncovering key performance indicators (KPIs), identifying market trends, generating charts, and producing structured executive management reports.

Designed to eliminate manual data wrangling, repetitive metrics calculation, and report generation in enterprise environments.

---

## 📌 当前项目阶段 | Current Project Stage

**当前版本：`v1.0 MVP (Minimum Viable Product)`**

本项目已成功跑通从“非结构化/半结构化原始数据”到“确定性数据计算 + 商业决策报告”的全自动化闭环链路。设计上坚持 **“确定性计算交给代码 (Pandas/Python Tools)，模糊性总结交给大模型 (LLM Agent)”** 的工业级可靠架构。

---

## 🚀 为什么选择 RichonAgent？| Why RichonAgent?

商业与运营团队在日常分析工作中往往消耗大量重复劳动：
- 数据清洗与类型推断 (Data Wrangling & Schema Detection)
- 多维度 KPI 计算与聚类 (KPI & Grouping Calculation)
- 时序趋势与极值挖掘 (Trend & Anomaly Identification)
- 图表绘制与可视化展示 (Data Visualization)
- 管理层汇报 Markdown/PPT 撰写 (Executive Reporting)

RichonAgent 将上述流程式工作抽象为标准的 AI Agent Pipeline：

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

---

## ✨ 核心功能 | Key Features

| 功能模块 (Feature) | 中文功能描述 (Chinese) | 英文功能描述 (English) |
| :--- | :--- | :--- |
| **Automated Data Understanding** | 自动加载 CSV 数据集，识别数据规模（行列数），自动推断数值型与分类变量，输出数据健康度概览。 | Automatically loads CSV datasets, infers column schemas (numerical vs. categorical), and produces structural overviews. |
| **KPI Analysis Engine** | 精确计算核心商业指标（总收入、利润率、AOV 客单价、区域/产品维度贡献度），拒绝大模型数值幻觉。 | Calculates core metrics (Revenue, Profit, AOV, Contribution Share) using deterministic code execution. |
| **Trend & Pattern Detection** | 自动挖掘时间序列数据中的环比/同比变化、峰值谷值及季节性趋势。 | Analyzes time-series data to detect period-over-period growth/decline, peak/trough points, and trend patterns. |
| **Visualization Generation** | 基于分析结果自动生成专业可视化图表（趋势图、柱状对比图）并输出为 PNG 文件。 | Automatically generates Matplotlib visual charts (Line & Bar Charts) and saves them into clean PNG output paths. |
| **Executive Reporting** | 合成结构化高管报告，包含业务总览、核心发现、风险提示以及基于 MECE 原则的战略建议。 | Synthesizes executive reports (.md) covering business overview, key findings, risk alerts, and strategic actions. |

---

## 🏗️ 系统架构与技术亮点 | Architecture & Technical Highlights

### 1. 技术选型 (Tech Stack)
* **AI Agent Framework:** OpenAI Agents SDK
* **Data Engine:** Python 3.10+, pandas, NumPy
* **Visualization:** Matplotlib
* **Environment:** python-dotenv

### 2. 代码设计亮点 (面试官/HR 查看看点)
* **Code & LLM Decoupling (算解分离/零幻觉保证):** 所有数值计算均在 `tools.py` 中通过原生 Python/Pandas 代码跑出，Agent 仅负责分析逻辑调度与归档提炼，彻底避免大模型在算数时的幻觉（Hallucination）。
* **Standardized Tool Interfaces (标准化工具接口):** 按照 OpenAI Tool Definition 标准进行入参与出参约束，代码易维护，后续可无缝接入 MCP (Model Context Protocol) 协议。
* **Structured Artifact Output (结构化交付物):** 规范化的自动化输出管理，生成可直接投喂给上级的标准 Markdown 报告与高清晰度图片资产。

---

## 📂 项目目录结构 | Project Structure

```text
RichonAgent/
├── README.md                 # Project Overview & Documentation
├── requirements.txt          # Python Dependencies
├── .env.example              # Environment Variable Template
│
├── src/
│   ├── config.py             # Global Config & Env Management
│   ├── tools.py              # Deterministic Analytics & Viz Tools (Pandas/Matplotlib)
│   ├── agent.py              # OpenAI Agent Definition & System Prompts
│   └── main.py               # Application Entry Point
│
├── data/
│   └── sample_sales.csv      # Sample Business Dataset
│
├── examples/
│   └── run_analysis.py       # Execution Example Script
│
└── outputs/                  # Auto-generated Artifacts
    ├── report.md             # Markdown Executive Report
    └── charts/               # Generated Visualizations (.png)
```

---

## ⚡ 快速开始 | Quick Start

### 1. 克隆项目与安装依赖 | Clone & Installation
```bash
git clone https://github.com/tylerchan13/RichonAgent.git
cd RichonAgent
pip install -r requirements.txt
```

### 2. 环境配置 | Environment Setup
拷贝环境变量模板并配置 API Key：
```bash
cp .env.example .env
```
编辑 `.env` 文件：
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

### 3. 运行分析演示 | Run Analysis Demo
```bash
python examples/run_analysis.py
```
运行完成后，请在 `outputs/` 目录查看自动生成的 `report.md` 及图表文件。

---

## 🗺️ 发展路线图 | Roadmap

| 版本 (Version) | 核心能力 (Core Focus) | 状态 (Status) |
| :--- | :--- | :--- |
| **v1.0 MVP** | CSV 单文件解析、KPI 引擎计算、趋势挖掘、自动画图、Markdown 诊断报告生成。 | **✅ 已完成 (Completed)** |
| **v2.0 Enhancement** | 支持 Excel/SQL 数据库接入、集成 Streamlit 可视化 UI 交互界面、异常检测 (Anomaly Detection)。 | **🔄 进行中 (In Progress)** |
| **v3.0 Multi-Agent** | 重构为多智能体架构 (Planner, Data Analyst, Viz Expert, Strategy Consultant) & 集成 MCP 协议。 | **🔮 规划中 (Planned)** |

---

## 📄 许可协议 | License

This project is licensed under the MIT License.
