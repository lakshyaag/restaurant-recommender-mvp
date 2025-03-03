from fastapi import APIRouter, HTTPException
from app.models.client_profile import (
    ClientProfileParams,
    ClientProfileRestaurantSearchParams,
)
from app.services.profile_query import generate_restaurant_search_params

router = APIRouter()


@router.post("/client_profile", response_model=ClientProfileRestaurantSearchParams)
async def create_client_profile(
    client_profile_params: ClientProfileParams,
) -> ClientProfileRestaurantSearchParams:
    try:
        response = generate_restaurant_search_params(client_profile_params)

        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
