from fastapi import APIRouter
from pydantic import BaseModel
from app.tasks import run_dummy_purge

router = APIRouter(prefix="/purge-jobs", tags=["Purge Jobs"])


class ManualPurgeRequest(BaseModel):
    client_id: str
    product_id: str


@router.post("/")
async def trigger_purge(data: ManualPurgeRequest):

    task = run_dummy_purge.delay(
        data.client_id,
        data.product_id
    )

    return {
        "message": "Purge job queued",
        "task_id": task.id
    }