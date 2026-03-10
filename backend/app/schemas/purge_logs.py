from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class PurgeLogResponse(BaseModel):
    id: UUID
    timestamp: datetime
    retention_policy_id: UUID
    client_id: str
    product_id: str
    action_type: str
    status: str

    class Config:
        from_attributes = True