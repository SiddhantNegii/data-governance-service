from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import PurgeLog
from app.schemas.purge_logs import PurgeLogResponse

router = APIRouter(prefix="/purge-logs", tags=["Purge Logs"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# ---------------------------
# GET ALL PURGE LOGS
# ---------------------------

@router.get("/", response_model=list[PurgeLogResponse])
async def get_logs(db: AsyncSession = Depends(get_db)):

    result = await db.execute(
        select(PurgeLog).order_by(PurgeLog.timestamp.desc())
    )

    return result.scalars().all()