from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class ProductCreate(BaseModel):
    product_id: str
    name: str
    description: str | None = None


class ProductResponse(BaseModel):
    id: UUID
    product_id: str
    name: str
    description: str | None
    created_at: datetime

    class Config:
        from_attributes = True