 """Run the sample analysis on the included sample_sales.csv dataset."""
 import asyncio
 import sys
 from pathlib import Path
 
 project_root = Path(__file__).resolve().parent.parent
 sys.path.insert(0, str(project_root))
 
 from src.main import analyze
 
 
 async def main() -> None:
     sample_csv = project_root / "data" / "sample_sales.csv"
     output_dir = project_root / "outputs"
     result = await analyze(str(sample_csv), str(output_dir))
     print("\n--- Final Output ---")
     print(result)
 
 
 if __name__ == "__main__":
     asyncio.run(main())
