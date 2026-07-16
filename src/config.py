 """Configuration and environment setup."""
 import os
 from dotenv import load_dotenv
 
 load_dotenv()
 
 OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
 OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
 
 if not OPENAI_API_KEY:
     raise ValueError(
         "OPENAI_API_KEY is not set. Please create a .env file based on .env.example."
     )
 
 os.environ.setdefault("OPENAI_API_KEY", OPENAI_API_KEY)
