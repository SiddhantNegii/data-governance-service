from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


# ---------------------------
# CREATE POLICY
# ---------------------------

class RetentionPolicyCreate(BaseModel):
    client_id: str
    product_id: str
    retention_days: int
    last_updated_by: str


# ---------------------------
# RESPONSE POLICY
# ---------------------------

class RetentionPolicyResponse(BaseModel):
    id: UUID
    client_id: str
    product_id: str
    retention_days: int
    last_updated_by: str
    last_updated_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True