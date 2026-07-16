 """Entry point to run the Business Analyst Agent on a CSV file."""
 import asyncio
 import sys
 from pathlib import Path
 
 from agents import Runner
 
 from .agent import business_analyst_agent
 from .config import OPENAI_MODEL
 
 
 async def analyze(csv_path: str, output_dir: str) -> str:
     """Run the business analyst agent on the provided CSV and return the final output."""
     out = Path(output_dir)
     out.mkdir(parents=True, exist_ok=True)
     chart_path = str(out / "trend_chart.png")
     report_path = str(out / "report.md")
 
     prompt = (
         f"Analyze the business data in '{csv_path}'. "
         f"Save the chart to '{chart_path}' and the final Markdown report to '{report_path}'."
     )
     print(f"Running Business Analyst Agent (model: {OPENAI_MODEL})...")
     print(f"Data: {csv_path}")
     print(f"Outputs: {out}")
     result = await Runner.run(business_analyst_agent, prompt)
     return result.final_output
 
 
 async def main() -> None:
     if len(sys.argv) < 2:
         print("Usage: python -m src.main <path_to_csv>")
         print("Example: python -m src.main data/sample_sales.csv")
         sys.exit(1)
 
     csv_path = sys.argv[1]
     output_dir = str(Path(csv_path).parent.parent / "outputs")
     final_output = await analyze(csv_path, output_dir)
     print("\n--- Final Output ---")
     print(final_output)
 
 
 if __name__ == "__main__":
     asyncio.run(main())
