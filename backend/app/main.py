from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import uuid4
from datetime import datetime
from app.schemas import DataRecordCreate
from app.database import engine, Base, AsyncSessionLocal
from app.models import DataRecord
from app.logger import logger

app = FastAPI(title="Data Governance Service")


# Create tables on startup
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created.")


# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# Insert dummy data
@app.post("/records")
async def create_record(
    request: DataRecordCreate,
    db: AsyncSession = Depends(get_db),
):
    record = DataRecord(
        uid=request.uid,
        product_id=request.product_id,
        data_retention_days=request.data_retention_days,
    )

    db.add(record)
    await db.commit()
    await db.refresh(record)

    logger.info(f"Inserted record for uid={record.uid}")

    return record

# Get all records
@app.get("/records")
async def get_records(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DataRecord))
    records = result.scalars().all()

    logger.info("Fetched all records")

    return records