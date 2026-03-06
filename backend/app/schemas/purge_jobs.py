from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class PurgeJobCreate(BaseModel):
    client_id: str
    product_id: str
    trigger_type: str


class PurgeJobResponse(BaseModel):
    id: UUID
    client_id: str
    product_id: str
    trigger_type: str
    rows_deleted: int
    execution_time: datetime
    duration: str | None
    status: str

    class Config:
        from_attributes = True