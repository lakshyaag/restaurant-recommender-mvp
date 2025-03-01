from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field


# Enums for constrained fields
class SortBy(str, Enum):
    BEST_MATCH = "best_match"
    RATING = "rating"
    REVIEW_COUNT = "review_count"
    DISTANCE = "distance"


class PriceLevel(str, Enum):
    LEVEL_1 = "1"  # $
    LEVEL_2 = "2"  # $$
    LEVEL_3 = "3"  # $$$
    LEVEL_4 = "4"  # $$$$


class Attribute(str, Enum):
    HOT_AND_NEW = "hot_and_new"
    REQUEST_A_QUOTE = "request_a_quote"
    RESERVATION = "reservation"
    WAITLIST_RESERVATION = "waitlist_reservation"
    DEALS = "deals"
    GENDER_NEUTRAL_RESTROOMS = "gender_neutral_restrooms"
    OPEN_TO_ALL = "open_to_all"
    WHEELCHAIR_ACCESSIBLE = "wheelchair_accessible"
    # Premium attributes
    AMBIENCE = "ambience"
    AMBIENCE_CASUAL = "ambience_casual"
    AMBIENCE_CLASSY = "ambience_classy"
    AMBIENCE_DIVEY = "ambience_divey"
    AMBIENCE_HIPSTER = "ambience_hipster"
    AMBIENCE_INTIMATE = "ambience_intimate"
    AMBIENCE_ROMANTIC = "ambience_romantic"
    AMBIENCE_TOURISTY = "ambience_touristy"
    AMBIENCE_TRENDY = "ambience_trendy"
    AMBIENCE_UPSCALE = "ambience_upscale"
    DOGS_ALLOWED = "dogs_allowed"
    GOOD_FOR_DANCING = "good_for_dancing"
    HAPPY_HOUR = "happy_hour"
    LIKED_BY_BEER = "liked_by_beer"
    LIKED_BY_DATES = "liked_by_dates"
    LIKED_BY_FIFTIES = "liked_by_fifties"
    LIKED_BY_FORTIES = "liked_by_forties"
    LIKED_BY_GENX = "liked_by_genx"
    LIKED_BY_THIRTIES = "liked_by_thirties"
    LIKED_BY_TWENTIES = "liked_by_twenties"
    LIKED_BY_MEN = "liked_by_men"
    LIKED_BY_STUDENTS = "liked_by_students"
    LIKED_BY_TRAVELERS = "liked_by_travelers"
    LIKED_BY_VEGETARIANS = "liked_by_vegetarians"
    LIKED_BY_WINE = "liked_by_wine"
    LIKED_BY_WOMEN = "liked_by_women"
    LIKED_BY_YOUNG_PROFESSIONALS = "liked_by_young_professionals"
    NOISE_LEVEL = "noise_level"
    NOISE_LEVEL_AVERAGE = "noise_level_average"
    NOISE_LEVEL_LOUD = "noise_level_loud"
    NOISE_LEVEL_QUIET = "noise_level_quiet"
    NOISE_LEVEL_VERY_LOUD = "noise_level_very_loud"
    OUTDOOR_SEATING = "outdoor_seating"
    PARKING = "parking"
    PARKING_GARAGE = "parking_garage"
    PARKING_LOT = "parking_lot"
    PARKING_STREET = "parking_street"
    PARKING_VALET = "parking_valet"
    PARKING_VALIDATED = "parking_validated"
    PARKING_BIKE = "parking_bike"
    RESTAURANTS_DELIVERY = "restaurants_delivery"
    RESTAURANTS_TAKEOUT = "restaurants_takeout"
    WIFI = "wifi"
    WIFI_FREE = "wifi_free"
    WIFI_PAID = "wifi_paid"


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

    # View type for frontend
    view_type: Optional[str] = Field(
        "list", description="View type for frontend (list or map)"
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


# Enhanced models for map view
class MapLocation(BaseModel):
    """Simplified location data for map view."""

    id: str
    name: str
    coordinates: Coordinates
    rating: float
    price: Optional[str] = None
    categories: List[str]
    image_url: Optional[str] = None


class MapViewResponse(BaseModel):
    """Simplified API response for map view."""

    locations: List[MapLocation]
    total: int
    region: Optional[Region] = None
