import os
from dotenv import load_dotenv
from celery import Celery

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "data_governance",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks"]
)

celery_app.conf.update(
    timezone="UTC",
    enable_utc=True,
)

celery_app.conf.beat_schedule = {
    "policy-check": {
        "task": "app.tasks.check_retention_policies",
        "schedule": 5.0,
    }
}