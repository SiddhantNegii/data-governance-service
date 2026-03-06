# reset.py
import asyncio
from sqlalchemy import text
from app.database import engine, Base


async def reset_db():
    async with engine.begin() as conn:

        print("Dropping schema...")
        await conn.execute(text("DROP SCHEMA public CASCADE"))
        await conn.execute(text("CREATE SCHEMA public"))

        print("Creating tables...")
        await conn.run_sync(Base.metadata.create_all)

    print("Database fully reset.")


asyncio.run(reset_db())