from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import PurgeJob
from app.schemas.purge_jobs import PurgeJobCreate, PurgeJobResponse

router = APIRouter(prefix="/purge-jobs", tags=["Purge Jobs"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=list[PurgeJobResponse])
async def get_jobs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PurgeJob))
    return result.scalars().all()


@router.post("/", response_model=PurgeJobResponse)
async def create_job(job: PurgeJobCreate, db: AsyncSession = Depends(get_db)):
    new_job = PurgeJob(
        client_id=job.client_id,
        product_id=job.product_id,
        trigger_type=job.trigger_type,
        rows_deleted=0,
        status="Running"
    )

    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)

    return new_job