from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from app.database import AsyncSessionLocal
from app.models import RetentionPolicy
from app.schemas.policies import RetentionPolicyCreate, RetentionPolicyResponse

router = APIRouter(prefix="/policies", tags=["Retention Policies"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# ---------------------------
# GET ALL POLICIES
# ---------------------------

@router.get("/", response_model=list[RetentionPolicyResponse])
async def get_policies(db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(RetentionPolicy))
    return result.scalars().all()


# ---------------------------
# CREATE POLICY
# ---------------------------

@router.post("/", response_model=RetentionPolicyResponse)
async def create_policy(
    policy: RetentionPolicyCreate,
    db: AsyncSession = Depends(get_db)
):

    new_policy = RetentionPolicy(
        client_id=policy.client_id,
        product_id=policy.product_id,
        retention_days=policy.retention_days,
        last_updated_by=policy.last_updated_by
    )

    db.add(new_policy)

    try:
        await db.commit()
        await db.refresh(new_policy)
        return new_policy

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A retention policy already exists for this client-product pair"
        )


# ---------------------------
# DELETE POLICY
# ---------------------------

@router.delete("/{policy_id}")
async def delete_policy(
    policy_id: str,
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(
        select(RetentionPolicy).where(RetentionPolicy.id == policy_id)
    )

    policy = result.scalar_one_or_none()

    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    await db.delete(policy)
    await db.commit()

    return {"message": "Policy deleted successfully"}


# ---------------------------
# UPDATE POLICY
# ---------------------------

@router.put("/{policy_id}", response_model=RetentionPolicyResponse)
async def update_policy(
    policy_id: str,
    policy_data: RetentionPolicyCreate,
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(
        select(RetentionPolicy).where(RetentionPolicy.id == policy_id)
    )

    policy = result.scalar_one_or_none()

    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    policy.client_id = policy_data.client_id
    policy.product_id = policy_data.product_id
    policy.retention_days = policy_data.retention_days
    policy.last_updated_by = policy_data.last_updated_by
    policy.last_updated_at = datetime.utcnow()

    try:
        await db.commit()
        await db.refresh(policy)
        return policy

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A retention policy already exists for this client-product pair"
        )