from fastapi import APIRouter, HTTPException, Query
from typing import Union, Optional
from app.models.restaurants import (
    RestaurantSearchParams,
    RestaurantResponse,
    MapViewResponse,
    SortBy,
)
from app.services.yelp import yelp_service

router = APIRouter()


@router.get("/restaurants", response_model=Union[RestaurantResponse, MapViewResponse])
async def search_restaurants(
    # Location parameters (at least one is required)
    location: Optional[str] = Query(
        None, description="Location to search (e.g., 'Toronto', '123 Main St')"
    ),
    latitude: Optional[float] = Query(
        None, description="Latitude coordinate", ge=-90.0, le=90.0
    ),
    longitude: Optional[float] = Query(
        None, description="Longitude coordinate", ge=-180.0, le=180.0
    ),
    # Search parameters
    term: Optional[str] = Query(
        "restaurant", description="Search term (e.g., 'Italian', 'Sushi')"
    ),
    radius: Optional[int] = Query(
        None, description="Search radius in meters (max 40000)", ge=0, le=40000
    ),
    categories: Optional[str] = Query(
        None,
        description="Comma-separated list of category aliases (e.g., 'italian,pizza')",
    ),
    locale: Optional[str] = Query(None, description="Locale (e.g., 'en_US')"),
    # Price and availability filters
    price: Optional[str] = Query(
        None, description="Comma-separated list of price levels (1, 2, 3, 4)"
    ),
    open_now: Optional[bool] = Query(
        None, description="Only show businesses that are open now"
    ),
    open_at: Optional[int] = Query(
        None, description="Unix timestamp for when businesses should be open"
    ),
    # Additional filters
    attributes: Optional[str] = Query(
        None, description="Comma-separated list of business attributes"
    ),
    # Sorting and pagination
    sort_by: Optional[str] = Query(
        SortBy.BEST_MATCH.value, description="How to sort results"
    ),
    limit: Optional[int] = Query(
        20, description="Number of results to return", ge=1, le=50
    ),
    offset: Optional[int] = Query(0, description="Offset for pagination", ge=0),
    # Reservation parameters
    reservation_date: Optional[str] = Query(
        None, description="Date for reservation (YYYY-MM-DD)"
    ),
    reservation_time: Optional[str] = Query(
        None, description="Time for reservation (HH:MM)"
    ),
    reservation_covers: Optional[int] = Query(
        None, description="Number of people for reservation", ge=1, le=10
    ),
    
    # View type for frontend
    view_type: Optional[str] = Query(
        "list", description="View type for frontend (list or map)"
    ),
) -> Union[RestaurantResponse, MapViewResponse]:
    """
    Search for restaurants based on location and various filters.

    This endpoint provides a flexible search interface with many optional parameters for filtering and sorting
    restaurant results. It requires either a location string or latitude/longitude coordinates.

    Returns either a detailed list of restaurants or a simplified map view based on the view_type parameter.
    """
    # Validate that we have either location or lat/long
    if not location and (latitude is None or longitude is None):
        raise HTTPException(
            status_code=400,
            detail="Either 'location' or both 'latitude' and 'longitude' must be provided",
        )

    # Convert parameters to our search model
    search_params = RestaurantSearchParams(
        location=location,
        latitude=latitude,
        longitude=longitude,
        term=term,
        radius=radius,
        categories=categories,
        locale=locale,
        price=price,
        open_now=open_now,
        open_at=open_at,
        attributes=attributes,
        sort_by=sort_by,
        limit=limit,
        offset=offset,
        reservation_date=reservation_date,
        reservation_time=reservation_time,
        reservation_covers=reservation_covers,
        view_type=view_type,
    )

    try:
        # Use the Yelp service to search for restaurants
        data = yelp_service.search_restaurants(search_params)

        # Format the response based on the view type
        return yelp_service.format_response(data, search_params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
