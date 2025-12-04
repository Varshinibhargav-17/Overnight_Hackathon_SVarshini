import os
from sqlalchemy import create_engine, text

url = os.getenv("DATABASE_URL")
print("Using DATABASE_URL:", url)
engine = create_engine(url, echo=False, pool_pre_ping=True)
with engine.connect() as conn:
    r = conn.execute(text("SELECT 1"))
    print("DB test query result:", list(r))