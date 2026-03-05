import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


# ---------------------------
# CLIENTS
# ---------------------------

class Client(Base):
    __tablename__ = "clients"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    client_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    name: Mapped[str] = mapped_column(String(200), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


# ---------------------------
# PRODUCTS
# ---------------------------

class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    product_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    name: Mapped[str] = mapped_column(String(200), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


# ---------------------------
# RETENTION POLICIES
# ---------------------------

class RetentionPolicy(Base):
    __tablename__ = "retention_policies"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    client_id: Mapped[str] = mapped_column(String(100), nullable=False)

    product_id: Mapped[str] = mapped_column(String(100), nullable=False)

    retention_days: Mapped[int] = mapped_column(Integer, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


# ---------------------------
# PURGE JOBS
# ---------------------------

class PurgeJob(Base):
    __tablename__ = "purge_jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    client_id: Mapped[str] = mapped_column(String(100), nullable=False)

    product_id: Mapped[str] = mapped_column(String(100), nullable=False)

    trigger_type: Mapped[str] = mapped_column(String(50))  # Manual / Scheduled

    rows_deleted: Mapped[int] = mapped_column(Integer, default=0)

    execution_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    duration: Mapped[str] = mapped_column(String(50))

    status: Mapped[str] = mapped_column(String(50))


# ---------------------------
# PURGE LOGS
# ---------------------------

class PurgeLog(Base):
    __tablename__ = "purge_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    client_id: Mapped[str] = mapped_column(String(100))

    product_id: Mapped[str] = mapped_column(String(100))

    action_type: Mapped[str] = mapped_column(String(100))

    rows_deleted: Mapped[int] = mapped_column(Integer)

    status: Mapped[str] = mapped_column(String(50))

    notes: Mapped[str] = mapped_column(Text)