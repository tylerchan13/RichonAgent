 """Analysis tools for the Business Analyst Agent."""
 from typing import Optional
 
 import pandas as pd
 import matplotlib.pyplot as plt
 from agents import function_tool
 
 
 @function_tool
 def load_csv(path: str) -> str:
     """Load a CSV file and return a concise overview of its contents."""
     try:
         df = pd.read_csv(path)
         columns = list(df.columns)
         preview = df.head().to_string(index=False)
         return (
             f"Loaded CSV: {path}\n"
             f"Shape: {df.shape[0]} rows x {df.shape[1]} columns\n"
             f"Columns: {columns}\n"
             f"First 5 rows:\n{preview}"
         )
     except Exception as e:
         return f"Error loading CSV: {e}"
 
 
 @function_tool
 def summarize_data(path: str) -> str:
     """Return descriptive statistics for numeric columns in a CSV file."""
     try:
         df = pd.read_csv(path)
         numeric_cols = df.select_dtypes(include="number").columns.tolist()
         if not numeric_cols:
             return "No numeric columns found."
         summary = df[numeric_cols].describe().to_string()
         return f"Descriptive statistics for numeric columns ({numeric_cols}):\n{summary}"
     except Exception as e:
         return f"Error summarizing data: {e}"
 
 
 @function_tool
 def analyze_trend(path: str, date_column: str, value_column: str) -> str:
     """Analyze the trend of a value column over a date column."""
     try:
         df = pd.read_csv(path)
         if date_column not in df.columns or value_column not in df.columns:
             return f"Columns {date_column} or {value_column} not found."
 
         df[date_column] = pd.to_datetime(df[date_column], errors="coerce")
         df = df.dropna(subset=[date_column, value_column]).sort_values(date_column)
 
         if df.empty:
             return "No valid data after dropping missing values."
 
         first = df[value_column].iloc[0]
         last = df[value_column].iloc[-1]
         change = last - first
         pct = (change / first * 100) if first != 0 else 0.0
         avg = df[value_column].mean()
         max_val = df[value_column].max()
         min_val = df[value_column].min()
 
         return (
             f"Trend analysis for '{value_column}' over '{date_column}':\n"
             f"  First value: {first}\n"
             f"  Last value: {last}\n"
             f"  Absolute change: {change:.2f}\n"
             f"  Percentage change: {pct:.2f}%\n"
             f"  Average: {avg:.2f}\n"
             f"  Min: {min_val}\n"
             f"  Max: {max_val}"
         )
     except Exception as e:
         return f"Error analyzing trend: {e}"
 
 
 @function_tool
 def generate_chart(path: str, x_column: str, y_column: str, output_path: str) -> str:
     """Generate a line chart of y_column over x_column and save it to output_path."""
     try:
         df = pd.read_csv(path)
         if x_column not in df.columns or y_column not in df.columns:
             return f"Columns {x_column} or {y_column} not found."
 
         plt.figure(figsize=(10, 6))
         plt.plot(df[x_column], df[y_column], marker="o", linestyle="-", color="steelblue")
         plt.title(f"{y_column} over {x_column}", fontsize=14)
         plt.xlabel(x_column)
         plt.ylabel(y_column)
         plt.xticks(rotation=45, ha="right")
         plt.grid(True, linestyle="--", alpha=0.5)
         plt.tight_layout()
         plt.savefig(output_path, dpi=150)
         plt.close()
         return f"Chart saved to {output_path}"
     except Exception as e:
         return f"Error generating chart: {e}"
 
 
 @function_tool
 def save_report(content: str, output_path: str) -> str:
     """Save a Markdown business analysis report to output_path."""
     try:
         with open(output_path, "w", encoding="utf-8") as f:
             f.write(content)
         return f"Report saved to {output_path}"
     except Exception as e:
         return f"Error saving report: {e}"
 
 
 @function_tool
 def top_performers(
     path: str,
     group_column: str,
     value_column: str,
     top_n: int = 5,
 ) -> str:
     """Return the top N groups by a value column (e.g. top products by sales)."""
     try:
         df = pd.read_csv(path)
         if group_column not in df.columns or value_column not in df.columns:
             return f"Columns {group_column} or {value_column} not found."
 
         grouped = df.groupby(group_column)[value_column].sum().sort_values(ascending=False)
         top = grouped.head(top_n)
         return f"Top {top_n} {group_column} by {value_column}:\n{top.to_string()}"
     except Exception as e:
         return f"Error ranking top performers: {e}"
