from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.database import AsyncSessionLocal
from app.models import Product
from app.schemas.products import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# ---------------------------
# GET PRODUCTS
# ---------------------------

@router.get("/", response_model=list[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(Product))
    return result.scalars().all()


# ---------------------------
# CREATE PRODUCT
# ---------------------------

@router.post("/", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    db: AsyncSession = Depends(get_db)
):

    new_product = Product(
        product_id=product.product_id,
        name=product.name,
        description=product.description
    )

    db.add(new_product)

    try:
        await db.commit()
        await db.refresh(new_product)
        return new_product

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Product ID already exists"
        )


# ---------------------------
# UPDATE PRODUCT
# ---------------------------

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_data: ProductCreate,
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )

    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.name = product_data.name
    product.product_id = product_data.product_id
    product.description = product_data.description

    try:
        await db.commit()
        await db.refresh(product)
        return product

    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Product ID already exists"
        )


# ---------------------------
# DELETE PRODUCT
# ---------------------------

@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db)
):

    result = await db.execute(
        select(Product).where(Product.id == product_id)
    )

    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.delete(product)
    await db.commit()

    return {"message": "Product deleted successfully"}