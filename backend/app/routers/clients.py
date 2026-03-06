from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.database import AsyncSessionLocal
from app.models import Client
from app.schemas.clients import ClientCreate, ClientResponse

router = APIRouter(prefix="/clients", tags=["Clients"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# ---------------------------
# GET CLIENTS
# ---------------------------

@router.get("/", response_model=list[ClientResponse])
async def get_clients(db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(Client))
    return result.scalars().all()


# ---------------------------
# CREATE CLIENT
# ---------------------------

@router.post("/", response_model=ClientResponse)
async def create_client(
    client: ClientCreate,
    db: AsyncSession = Depends(get_db)
):

    new_client = Client(
        client_id=client.client_id,
        name=client.name
    )

    db.add(new_client)

    try:
        await db.commit()
        await db.refresh(new_client)
        return new_client

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Client ID already exists"
        )


# ---------------------------
# UPDATE CLIENT
# ---------------------------

@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: str,
    client_data: ClientCreate,
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(
        select(Client).where(Client.id == client_id)
    )

    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    client.name = client_data.name
    client.client_id = client_data.client_id

    try:
        await db.commit()
        await db.refresh(client)
        return client

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Client ID already exists"
        )


# ---------------------------
# DELETE CLIENT
# ---------------------------

@router.delete("/{client_id}")
async def delete_client(
    client_id: str,
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(
        select(Client).where(Client.id == client_id)
    )

    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    await db.delete(client)
    await db.commit()

    return {"message": "Client deleted successfully"}