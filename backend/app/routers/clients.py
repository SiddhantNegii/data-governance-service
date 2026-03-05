from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import Client
from app.schemas.clients import ClientCreate, ClientResponse

router = APIRouter(prefix="/clients", tags=["Clients"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=list[ClientResponse])
async def get_clients(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Client))
    return result.scalars().all()


@router.post("/", response_model=ClientResponse)
async def create_client(client: ClientCreate, db: AsyncSession = Depends(get_db)):
    new_client = Client(
        client_id=client.client_id,
        name=client.name
    )

    db.add(new_client)
    await db.commit()
    await db.refresh(new_client)

    return new_client