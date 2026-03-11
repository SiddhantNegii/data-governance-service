import time
from datetime import datetime

from sqlalchemy import select

from app.celery_app import celery_app
from app.database import SyncSessionLocal
from app.models import RetentionPolicy, PurgeJob, PurgeLog


# --------------------------------------------------
# POLICY SCHEDULER
# --------------------------------------------------

@celery_app.task
def check_retention_policies():

    print("Checking retention policies...")

    db = SyncSessionLocal()

    try:

        policies = db.execute(select(RetentionPolicy)).scalars().all()

        for policy in policies:
            evaluate_policy(db, policy)

    finally:
        db.close()


# --------------------------------------------------
# POLICY EVALUATION
# --------------------------------------------------

def evaluate_policy(db, policy):

    job = (
        db.execute(
            select(PurgeJob)
            .where(PurgeJob.client_id == policy.client_id)
            .where(PurgeJob.product_id == policy.product_id)
            .order_by(PurgeJob.created_at.desc())
            .limit(1)
        )
        .scalars()
        .first()
    )

    # skip if job already running
    if job and job.status in ("Pending", "Running"):
        print("Job already running, skipping")
        return

    # respect retention time
    if job:

        diff = datetime.utcnow() - job.created_at

        if diff.total_seconds() < policy.retention_days:
            return

    # create new job
    new_job = PurgeJob(
        retention_policy_id=policy.id,
        client_id=policy.client_id,
        product_id=policy.product_id,
        trigger_type="Automatic",
        status="Pending",
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    print(f"Queued purge job {new_job.id}")

    run_dummy_purge.delay(str(new_job.id))


# --------------------------------------------------
# PURGE TASK
# --------------------------------------------------

@celery_app.task
def run_dummy_purge(job_id):

    db = SyncSessionLocal()

    try:

        job = db.get(PurgeJob, job_id)

        if not job:
            print("Job not found")
            return

        # mark job running
        job.status = "Running"
        db.commit()

        print(f"Running purge job {job_id}")

        # create log immediately
        log = PurgeLog(
            retention_policy_id=job.retention_policy_id,
            client_id=job.client_id,
            product_id=job.product_id,
            action_type="Automatic",
            status="Running",
            timestamp=datetime.utcnow(),
        )

        db.add(log)
        db.commit()

        # fetch retention policy duration
        policy = db.get(RetentionPolicy, job.retention_policy_id)

        duration = policy.retention_days

        print(f"Purge duration = {duration} seconds")

        # simulate purge
        time.sleep(duration)

        # update job status
        job.status = "Success"
        job.finished_at = datetime.utcnow()

        # update existing log to success
        log = (
            db.execute(
                select(PurgeLog)
                .where(PurgeLog.retention_policy_id == job.retention_policy_id)
                .order_by(PurgeLog.timestamp.desc())
                .limit(1)
            )
            .scalars()
            .first()
        )

        if log:
            log.status = "Success"

        db.commit()

        print(f"Purge job {job_id} completed")

    except Exception as e:

        job = db.get(PurgeJob, job_id)

        if job:
            job.status = "Failed"
            db.commit()

        print("Purge failed:", e)

    finally:
        db.close()