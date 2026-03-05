from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class PurgeLogResponse(BaseModel):
    id: UUID
    timestamp: datetime
    client_id: str
    product_id: str
    action_type: str
    rows_deleted: int
    status: str
    notes: str | None

    class Config:
        from_attributes = True