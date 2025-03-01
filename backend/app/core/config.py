import os
from typing import Optional, List
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseModel):
    """Application settings."""

    # App configuration
    APP_NAME: str = "Bain Restaurant Recommender API"
    APP_DESCRIPTION: str = "API for recommending restaurants for client meetings"
    APP_VERSION: str = "0.1.0"

    # API configuration
    API_PREFIX: str = "/api"

    # CORS configuration
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # Yelp API configuration
    YELP_API_KEY: str = os.getenv("YELP_API_KEY", "")
    YELP_CLIENT_ID: Optional[str] = os.getenv("YELP_CLIENT_ID")
    YELP_API_URL: str = "https://api.yelp.com/v3"

    # Default search parameters
    DEFAULT_LOCATION: str = "Toronto"
    DEFAULT_TERM: str = "restaurant"
    DEFAULT_LIMIT: int = 20
    DEFAULT_SORT_BY: str = "best_match"

    # Caching (for future implementation)
    ENABLE_CACHE: bool = False
    CACHE_EXPIRY: int = 3600  # 1 hour in seconds


# Create settings instance
settings = Settings()

# Validation
if not settings.YELP_API_KEY:
    raise ValueError("YELP_API_KEY environment variable must be set")
