from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field


# Enums for constrained fields
class SortBy(str, Enum):
    BEST_MATCH = "best_match"
    RATING = "rating"
    REVIEW_COUNT = "review_count"
    DISTANCE = "distance"

# Request models
class RestaurantSearchParams(BaseModel):
    """Restaurant search query parameters."""

    # Location parameters (one of these is required)
    location: Optional[str] = Field(
        None,
        description="Location to search (e.g., 'Toronto', '123 Main St')",
        min_length=1,
        max_length=250,
    )
    latitude: Optional[float] = Field(
        None, description="Latitude coordinate", ge=-90.0, le=90.0
    )
    longitude: Optional[float] = Field(
        None, description="Longitude coordinate", ge=-180.0, le=180.0
    )

    # Search parameters
    term: Optional[str] = Field(
        "restaurant", description="Search term (e.g., 'Italian', 'Sushi')"
    )
    radius: Optional[int] = Field(
        None, description="Search radius in meters (max 40000)", ge=0, le=40000
    )
    categories: Optional[str] = Field(
        None,
        description="Comma-separated list of category aliases (e.g., 'italian,pizza')",
    )
    locale: Optional[str] = Field(None, description="Locale (e.g., 'en_US')")

    # Price and availability filters
    price: Optional[str] = Field(
        None, description="Comma-separated list of price levels (1, 2, 3, 4)"
    )
    open_now: Optional[bool] = Field(
        None, description="Only show businesses that are open now"
    )
    open_at: Optional[int] = Field(
        None, description="Unix timestamp for when businesses should be open"
    )

    # Additional filters
    attributes: Optional[str] = Field(
        None, description="Comma-separated list of business attributes"
    )

    # Sorting and pagination
    sort_by: Optional[SortBy] = Field(
        SortBy.BEST_MATCH, description="How to sort results"
    )
    limit: Optional[int] = Field(
        20, description="Number of results to return", ge=1, le=50
    )
    offset: Optional[int] = Field(0, description="Offset for pagination", ge=0)

    # Reservation parameters
    reservation_date: Optional[str] = Field(
        None, description="Date for reservation (YYYY-MM-DD)"
    )
    reservation_time: Optional[str] = Field(
        None, description="Time for reservation (HH:MM)"
    )
    reservation_covers: Optional[int] = Field(
        None, description="Number of people for reservation", ge=1, le=10
    )


# Response models
class Coordinates(BaseModel):
    """Geographic coordinates."""

    latitude: float
    longitude: float


class Category(BaseModel):
    """Business category."""

    alias: str
    title: str


class Location(BaseModel):
    """Business location."""

    address1: Optional[str] = None
    address2: Optional[str] = None
    address3: Optional[str] = None
    city: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    state: Optional[str] = None
    display_address: List[str]
    cross_streets: Optional[str] = None


class BusinessHours(BaseModel):
    """Business hours."""

    hour_type: str
    open: List[Dict[str, Any]]
    is_open_now: bool


class Restaurant(BaseModel):
    """Restaurant data model."""

    id: str
    alias: str
    name: str
    image_url: Optional[str] = None
    is_closed: bool
    url: str
    review_count: int
    categories: List[Category]
    rating: float
    coordinates: Coordinates
    transactions: List[str] = []
    price: Optional[str] = None
    location: Location
    phone: str
    display_phone: str
    distance: Optional[float] = None

    # Additional fields that might be included
    photos: Optional[List[str]] = None
    hours: Optional[List[BusinessHours]] = None
    attributes: Optional[Dict[str, Any]] = None


class Region(BaseModel):
    """Region information."""

    center: Coordinates


class RestaurantResponse(BaseModel):
    """API response for restaurant search."""

    restaurants: List[Restaurant]
    total: int
    region: Optional[Region] = None
    offset: int
    limit: int
    location: str
