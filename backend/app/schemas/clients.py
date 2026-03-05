from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class ClientCreate(BaseModel):
    client_id: str
    name: str


class ClientResponse(BaseModel):
    id: UUID
    client_id: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True