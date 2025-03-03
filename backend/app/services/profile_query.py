from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from textwrap import dedent
from app.core.config import settings
from app.models.client_profile import (
    ClientProfileParams,
    ClientProfileRestaurantSearchParams,
)


def generate_restaurant_search_params(
    client_profile_params: ClientProfileParams,
) -> ClientProfileRestaurantSearchParams:
    model = ChatOpenAI(
        model="gpt-4o-mini",
        openai_api_key=settings.OPENAI_API_KEY,
    )

    prompts = [
        SystemMessage(
            dedent("""
    You are an AI assistant for a restaurant recommendation tool used by consulting firm partners to find restaurants for client meetings. Your task is to synthesize a search query for restaurants based on the following input data provided by a partner. Ensure the query is specific, concise, and suitable for a business context in a major city. The query should be formatted to interface with the Yelp Fusion API.
                    
    For clients in positions of seniority or for clients with a longer engagement period, consider a more upscale or expensive restaurant by increasing the price level.
                    
    Based on the purpose of the meeting, the search term should be tuned accordingly to ensure that the ambiance is appropriate for the meeting. Please keep the additional notes in mind when generating the search term.
                    
    The category filter is extremely exclusive, so please select more categories than necessary to ensure that the search is not too narrow. If the client profile already contains categories, only add similar categories.
    """)
        ),
        HumanMessage(
            dedent(f"""
            {client_profile_params.model_dump_json(indent=4)}
            """)
        ),
    ]

    response = model.with_structured_output(ClientProfileRestaurantSearchParams).invoke(
        prompts
    )

    response.categories = ",".join(response.categories) if response.categories else ""

    return response
