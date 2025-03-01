from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Bain Restaurant Recommender API",
    description="API for recommending restaurants in Toronto for client meetings",
    version="0.1.0",
)

# Add CORS middleware to allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # NextJS default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Yelp API configuration
YELP_API_KEY = os.getenv("YELP_API_KEY")
YELP_API_URL = "https://api.yelp.com/v3/businesses/search"

if not YELP_API_KEY:
    raise ValueError("YELP_API_KEY environment variable is not set")


# Models
class Restaurant(BaseModel):
    """Model representing restaurant data returned to the client."""

    id: str
    name: str
    image_url: str
    url: str
    review_count: int
    rating: float
    price: Optional[str] = None
    categories: List[str]
    address: str
    city: str
    zip_code: str
    phone: str
    latitude: float
    longitude: float
    distance: Optional[float] = None


class RestaurantResponse(BaseModel):
    """Model representing the response from the API."""

    restaurants: List[Restaurant]
    total: int


@app.get("/api/health")
def health_check() -> Dict[str, str]:
    """Health check endpoint to verify API is running."""
    return {"status": "ok"}


@app.get("/api/restaurants", response_model=RestaurantResponse)
async def search_restaurants(
    location: str = Query(..., description="Location to search for restaurants"),
    term: str = Query("restaurant", description="Search term"),
    limit: int = Query(20, description="Number of results to return", ge=1, le=50),
    offset: int = Query(0, description="Offset to start results from", ge=0),
    sort_by: str = Query(
        "best_match", description="Sort by: best_match, rating, review_count, distance"
    ),
    price: Optional[str] = Query(
        None, description="Pricing levels to filter by: 1, 2, 3, 4"
    ),
    open_now: bool = Query(
        False, description="Filter for businesses that are open now"
    ),
    categories: Optional[str] = Query(None, description="Categories to filter by"),
) -> RestaurantResponse:
    """
    Search for restaurants based on the provided parameters.
    """
    headers = {"Authorization": f"Bearer {YELP_API_KEY}"}

    params = {
        "term": term,
        "location": location,
        "limit": limit,
        "offset": offset,
        "sort_by": sort_by,
        "open_now": open_now,
    }

    # Add optional parameters if provided
    if price:
        params["price"] = price
    if categories:
        params["categories"] = categories

    try:
        response = requests.get(YELP_API_URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        restaurants = []
        for business in data.get("businesses", []):
            categories_list = [
                category["title"] for category in business.get("categories", [])
            ]
            location_data = business.get("location", {})

            restaurant = Restaurant(
                id=business.get("id"),
                name=business.get("name"),
                image_url=business.get("image_url", ""),
                url=business.get("url", ""),
                review_count=business.get("review_count", 0),
                rating=business.get("rating", 0.0),
                price=business.get("price"),
                categories=categories_list,
                address=", ".join(location_data.get("display_address", [])),
                city=location_data.get("city", ""),
                zip_code=location_data.get("zip_code", ""),
                phone=business.get("phone", ""),
                latitude=business.get("coordinates", {}).get("latitude", 0.0),
                longitude=business.get("coordinates", {}).get("longitude", 0.0),
                distance=business.get("distance"),
            )
            restaurants.append(restaurant)

        return RestaurantResponse(restaurants=restaurants, total=data.get("total", 0))

    except requests.RequestException as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching data from Yelp API: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
