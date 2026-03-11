from celery import Celery

celery_app = Celery(
    "data_governance",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=["app.tasks"]   # 👈 ADD THIS
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