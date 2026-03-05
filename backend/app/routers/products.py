from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models import Product
from app.schemas.products import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=list[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    return result.scalars().all()


@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    new_product = Product(
        product_id=product.product_id,
        name=product.name,
        description=product.description
    )

    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)

    return new_product