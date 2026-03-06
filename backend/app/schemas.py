from pydantic import BaseModel, Field


class DataRecordCreate(BaseModel):
    uid: str = Field(..., min_length=1)
    product_id: str = Field(..., min_length=1)
    data_retention_days: int = Field(..., gt=0)