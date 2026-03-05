from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.logger import logger

# Import routers
from app.routers import (
    clients,
    products,
    policies,
    purge_jobs,
    purge_logs
)

app = FastAPI(
    title="Tartan Data Governance Service",
    version="1.0.0"
)

# -----------------------------
# Enable CORS (React Frontend)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # For development. Later restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Create DB tables on startup
# -----------------------------
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    logger.info("Database tables created.")

# -----------------------------
# Register API Routers
# -----------------------------
app.include_router(clients.router)
app.include_router(products.router)
app.include_router(policies.router)
app.include_router(purge_jobs.router)
app.include_router(purge_logs.router)

# -----------------------------
# Health Check Endpoint
# -----------------------------
@app.get("/")
async def root():
    return {
        "service": "Tartan Data Governance Service",
        "status": "running"
    }