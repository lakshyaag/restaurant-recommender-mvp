from textwrap import dedent
from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.yelp_categories import get_yelp_categories


class ClientProfileParams(BaseModel):
    """
    Client profile data model for restaurant recommendations.
    Contains information about the client and meeting context.
    """

    clientDesignation: str = Field(..., description="The client's designation or role")
    meetingPurpose: str = Field(..., description="Purpose of the meeting")
    otherPurpose: Optional[str] = Field(
        None, description="Specific purpose of the meeting, if applicable"
    )
    relationshipStatus: str = Field(
        ..., description="Status of the client relationship"
    )
    location: str = Field(..., min_length=2, description="Meeting location")
    meetingDuration: str = Field(..., description="Duration of the meeting")
    dietaryRestrictions: Optional[str] = Field(
        None, description="Any dietary restrictions"
    )
    additionalNotes: Optional[str] = Field(
        None, description="Additional notes about the client or meeting"
    )
    cuisinePreferences: Optional[str] = Field(
        None, description="Preferred cuisine types"
    )


class ClientProfileRestaurantSearchParams(BaseModel):
    """
    Search parameters for restaurant recommendations based on client profile.
    """

    # Location
    location: str = Field(
        description="Location to search (e.g., 'Toronto', '123 Main St')",
    )

    # Search parameters
    term: str = Field(description="Terms to search for")

    # Categories
    categories: Optional[List[str]] = Field(
        description=dedent(
            f"""List of category aliases. If no information can be inferred, return an empty list. 
            
Here are the list of categories that can be chosen from: {get_yelp_categories()}"""
        )
    )

    # Price
    price: Optional[str] = Field(
        description="Comma-separated list of price levels (1, 2, 3, 4). A higher number indicates a more expensive restaurant. Multiple prices can be provided.",
    )