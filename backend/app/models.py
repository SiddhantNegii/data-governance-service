import uuid
from datetime import datetime

from sqlalchemy import String, Integer, DateTime, Text, UniqueConstraint, ForeignKey
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

    client_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

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

    product_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


# ---------------------------
# RETENTION POLICIES
# ---------------------------

class RetentionPolicy(Base):
    __tablename__ = "retention_policies"

    __table_args__ = (
        UniqueConstraint(
            "client_id",
            "product_id",
            name="unique_client_product_policy"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    client_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey("clients.client_id"),
        nullable=False
    )

    product_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey("products.product_id"),
        nullable=False
    )

    retention_days: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    # NEW AUDIT FIELDS
    last_updated_by: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    last_updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )


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

    retention_policy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("retention_policies.id"),
        nullable=False
    )

    client_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey("clients.client_id"),
        nullable=False
    )

    product_id: Mapped[str] = mapped_column(
        String(100),
        ForeignKey("products.product_id"),
        nullable=False
    )

    action_type: Mapped[str] = mapped_column(
        String(100)
    )

    status: Mapped[str] = mapped_column(
        String(50)
    )

class PurgeJob(Base):

    __tablename__ = "purge_jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    retention_policy_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        nullable=False
    )

    client_id: Mapped[str] = mapped_column(String(100), nullable=False)

    product_id: Mapped[str] = mapped_column(String(100), nullable=False)

    trigger_type: Mapped[str] = mapped_column(String(50))

    status: Mapped[str] = mapped_column(String(50))

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    finished_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True
    )