from fastapi import APIRouter
from typing import Dict

router = APIRouter()


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint to verify the API is running."""
    return {"status": "ok"}
