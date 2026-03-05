from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class RetentionPolicyCreate(BaseModel):
    client_id: str
    product_id: str
    retention_days: int


class RetentionPolicyResponse(BaseModel):
    id: UUID
    client_id: str
    product_id: str
    retention_days: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True