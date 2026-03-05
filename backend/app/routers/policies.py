from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import RetentionPolicy
from app.schemas.policies import RetentionPolicyCreate, RetentionPolicyResponse

router = APIRouter(prefix="/policies", tags=["Retention Policies"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=list[RetentionPolicyResponse])
async def get_policies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RetentionPolicy))
    return result.scalars().all()


@router.post("/", response_model=RetentionPolicyResponse)
async def create_policy(policy: RetentionPolicyCreate, db: AsyncSession = Depends(get_db)):
    new_policy = RetentionPolicy(
        client_id=policy.client_id,
        product_id=policy.product_id,
        retention_days=policy.retention_days
    )

    db.add(new_policy)
    await db.commit()
    await db.refresh(new_policy)

    return new_policy