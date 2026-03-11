import redis
from sqlalchemy import text

from app.database import sync_engine


# -----------------------------
# REDIS RESET
# -----------------------------
def reset_redis():

    print("Clearing Redis queue...")

    r = redis.Redis(host="localhost", port=6379, db=0)

    r.flushdb()

    print("Redis cleared")


# -----------------------------
# PURGE TABLE RESET
# -----------------------------
def reset_purge_tables():

    print("Clearing purge tables...")

    with sync_engine.connect() as conn:

        conn.execute(text("TRUNCATE TABLE purge_logs RESTART IDENTITY CASCADE"))
        conn.execute(text("TRUNCATE TABLE purge_jobs RESTART IDENTITY CASCADE"))

        conn.commit()

    print("Purge tables cleared")


# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":

    reset_redis()
    reset_purge_tables()

    print("\nRuntime environment fully reset.")