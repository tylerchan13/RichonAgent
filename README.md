 # 简易商业分析 Agent (Simple Business Analysis Agent)
 
 基于 [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) 的轻量级商业分析 Agent，可以自动加载 CSV 数据、生成统计摘要、分析趋势、绘制图表并输出商业报告。
 
 ## 功能特性
 
 - 自动读取 CSV 文件并识别列结构
 - 生成数值型字段的描述性统计
 - 按产品/区域/类别聚合，识别 Top 5  performers
 - 分析时间序列趋势（起点、终点、涨幅、均值、最大/最小值）
 - 生成可视化图表（保存为 PNG）
 - 输出 Markdown 商业洞察报告
 - 支持替换为自己的数据文件进行分析
 
 ## 技术栈
 
 - Python 3.10+
 - OpenAI Agents SDK
 - pandas
 - matplotlib
 - python-dotenv
 
 ## 快速开始
 
 1. 克隆本仓库并进入目录：
 
 ```bash
 git clone <your-repo-url>.git
 cd business-analysis-agent
 ```
 
 2. 安装依赖：
 
 ```bash
 pip install -r requirements.txt
 ```
 
 3. 复制环境变量模板并填入你的 OpenAI API Key：
 
 ```bash
 cp .env.example .env
 ```
 
 4. 运行示例分析：
 
 ```bash
 python examples/run_analysis.py
 ```
 
 运行后会在 `outputs/` 目录下生成 `report.md` 和 `trend_chart.png`。
 
 ## 分析自己的数据
 
 ```bash
 python -m src.main path/to/your/data.csv
 ```
 
 Agent 会自动读取数据、生成摘要、识别 Top 5、分析趋势、绘制图表并保存报告到 `outputs/`。
 
 ## 项目结构
 
 ```
 business-analysis-agent/
 ├── README.md
 ├── requirements.txt
 ├── .env.example
 ├── .gitignore
 ├── src/
 │   ├── __init__.py
 │   ├── config.py          # 环境变量与 API Key 配置
 │   ├── tools.py           # 数据分析工具（加载、统计、趋势、图表、报告）
 │   ├── agent.py           # Agent 定义
 │   └── main.py            # 命令行入口
 ├── data/
 │   └── sample_sales.csv   # 示例销售数据
 └── examples/
     └── run_analysis.py    # 一键运行示例
 ```
 
 ## 环境变量
 
 | 变量 | 说明 | 默认值 |
 |------|------|--------|
 | `OPENAI_API_KEY` | OpenAI API Key | 必填 |
 | `OPENAI_MODEL` | 使用的模型 | `gpt-4o-mini` |
 
 ## 示例输出
 
 运行 `python examples/run_analysis.py` 后，Agent 会生成类似以下的报告：
 
 - 数据集概览：行数、列名、样例数据
 - 描述性统计：销售额、销量、利润等核心指标
 - Top 5 产品/区域分析
 - 时间序列趋势与环比变化
 - 商业建议（如高利润产品推荐、区域发力方向）
 
 ## 扩展建议
 
 - 接入 Excel 文件：在 `tools.py` 中增加 `pd.read_excel`
 - 接入数据库：增加 SQL 查询工具
 - 接入更多图表：在 `generate_chart` 中支持柱状图、饼图
 - 多 Agent 协作：用 LangGraph 拆分为“数据工程师 + 商业分析师 + 报告撰写员”
 
 ## 许可证
 
 MIT
