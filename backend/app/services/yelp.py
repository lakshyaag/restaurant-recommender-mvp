import requests
import json
import logging
from typing import Dict, Any
from app.core.config import settings
from app.models.restaurants import (
    RestaurantSearchParams,
    Restaurant,
    RestaurantResponse,
    Region,
    Coordinates,
)

# Set up logging
logger = logging.getLogger(__name__)


class YelpService:
    """Service for interacting with the Yelp Fusion API."""

    def __init__(self, api_key: str = settings.YELP_API_KEY):
        """Initialize the Yelp service with API key."""
        self.api_key = api_key
        self.base_url = settings.YELP_API_URL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }

    def search_restaurants(self, params: RestaurantSearchParams) -> Dict[str, Any]:
        """
        Search for restaurants using the Yelp API.

        Args:
            params: The search parameters.

        Returns:
            The raw API response as a dictionary.

        Raises:
            Exception: If the API request fails.
        """
        # Build the API endpoint
        endpoint = f"{self.base_url}/businesses/search"

        # Convert params to a dictionary for the API request
        # Filter out None values and convert enums to strings
        request_params = {}
        for key, value in params.model_dump().items():
            # Skip frontend-specific parameters
            if key in ["view_type"]:
                continue

            # Skip None values
            if value is None:
                continue

            # Convert enum values to strings
            if hasattr(value, "value"):
                value = value.value

            request_params[key] = value

        logger.debug(f"Yelp API request: {endpoint} with params: {request_params}")

        try:
            # Make the API request
            response = requests.get(
                endpoint, headers=self.headers, params=request_params
            )
            response.raise_for_status()

            # Parse the response
            data = response.json()
            logger.debug(
                f"Yelp API response received: {len(data.get('businesses', []))} businesses"
            )

            # For debugging
            self._save_response_to_file(data, "app/constants/yelp_response.json")

            return data

        except requests.exceptions.RequestException as e:
            logger.error(f"Yelp API request failed: {str(e)}")
            raise Exception(f"Failed to fetch data from Yelp API: {str(e)}")

    def format_response(
        self, data: Dict[str, Any], params: RestaurantSearchParams
    ) -> RestaurantResponse:
        """Format response for list view."""
        restaurants = []
        for business in data.get("businesses", []):
            # Convert the raw business data to our Restaurant model
            restaurant = Restaurant.model_validate(business)
            restaurants.append(restaurant)

        # Extract region information if available
        region = None
        if "region" in data and "center" in data["region"]:
            region = Region(center=Coordinates.model_validate(data["region"]["center"]))

        # Create the response object
        return RestaurantResponse(
            restaurants=restaurants,
            total=data.get("total", 0),
            region=region,
            offset=params.offset or 0,
            limit=params.limit or 20,
            location=params.location or f"{params.latitude},{params.longitude}",
        )

    def _save_response_to_file(self, data: Dict[str, Any], filename: str) -> None:
        """Save API response to a file for debugging."""
        try:
            with open(filename, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save response to file: {str(e)}")


# Create a singleton instance
yelp_service = YelpService()
