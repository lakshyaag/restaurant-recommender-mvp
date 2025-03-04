# Bain Restaurant Recommender Backend

This is the backend API for the Bain Restaurant Recommender application, built with FastAPI and Python.

## Features

- Restaurant search using Yelp Fusion API
- Persona generation using LLMs for tailored search
- Clean architecture with separation of concerns

## Project Structure

```dir
backend/
├── app/                  # Application core
│   ├── api/              # API routes/endpoints
│   │   ├── health.py     # Health check endpoint
│   │   ├── restaurants.py # Restaurant endpoint
│   │   └── client_profile.py # Client profile endpoint
│   ├── models/           # Data models
│   │   ├── restaurants.py # Restaurant models
│   │   ├── client_profile.py # Client profile models
│   │   └── yelp_categories.py # Helper functions for Yelp categories
│   ├── services/         # Business logic
│   │   ├── yelp.py       # Yelp API interaction
│   │   └── profile_query.py # Profile query logic (LLM-based)
│   ├── constants/        # Configuration constants
│   └── core/             # Core configuration
│       └── config.py     # Environment and app config
├── main.py               # Application entry point
├── requirements.txt      # Dependencies
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore file
└── pyproject.toml        # Project metadata
```

## Setup

### Prerequisites

- Python 3.12 or higher (specified in `.python-version`)
- API keys (see `.env.example` & [here](#environment-variables))

### Installation

1. Make sure you're in the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies using uv. Please [install uv](https://docs.astral.sh/uv/getting-started/installation/) if you haven't already:

   ```bash
   uv sync
   ```

3. Start the FastAPI server:

   ```bash
   uv run main.py
   ```

The API will be available at `http://localhost:8000`

## Docker Support

To build and run the application using Docker:

```bash
docker build -t bain-recommender-backend .
docker run -p 8000:8000 bain-recommender-backend
```

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- `http://localhost:8000/api/docs` (Swagger UI)
- `http://localhost:8000/api/redoc` (ReDoc)

### Available Endpoints

#### GET /api/health

Health check endpoint to verify the API is running.

#### GET /api/restaurants

Search for restaurants based on the provided parameters.

Query Parameters:

- `location` (optional): Location to search for restaurants (e.g., "Toronto")
- `latitude` & `longitude` (optional): Coordinates to search from
- `term` (optional, default: "restaurant"): Search term
- `radius` (optional): Search radius in meters (0-40000)
- `limit` (optional, default: 20): Number of results to return (1-50)
- `offset` (optional, default: 0): Offset for pagination
- `sort_by` (optional, default: "best_match"): Sort by: best_match, rating, review_count, distance
- `price` (optional): Pricing levels to filter by: 1, 2, 3, 4 ($ to $$$$)
- `open_now` (optional, default: false): Filter for businesses that are open now
- `open_at` (optional): Unix timestamp for when businesses should be open
- `categories` (optional): Categories to filter by (e.g., "italian")
- `attributes` (optional): Additional attributes to filter by
- `view_type` (optional, default: "list"): View type for frontend (list or map)

Note: Either `location` or both `latitude` and `longitude` must be provided.

#### POST /api/client_profile

Generate a client persona based on the provided client and meeting details.

Body Parameters:

- `clientDesignation`: The client's designation or role
- `meetingPurpose`: Purpose of the meeting
- `otherPurpose`: Specific purpose of the meeting, if applicable
- `relationshipStatus`: Status of the client relationship
- `location`: Meeting location (e.g. "Toronto, ON")
- `meetingDuration`: Duration of the meeting (e.g. "1 hour")
- `dietaryRestrictions`: Any dietary restrictions
- `additionalNotes`: Additional notes about the client or meeting
- `cuisinePreferences`: Preferred cuisine types

## Development

The application is structured with clean architecture principles:

- **API Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic and external API interactions
- **Model Layer**: Defines data structures using Pydantic

## External APIs

- [Yelp Fusion API](https://www.yelp.com/developers/documentation/v3) for restaurant search
- [OpenAI API](https://platform.openai.com/docs/api-reference) for LLM-based persona generation
- [LangSmith API](https://smith.langchain.com/docs/api-reference/introduction) for tracing and monitoring LLM calls

## Environment Variables

The application requires the following environment variables in a `.env` file:

- `YELP_API_KEY`: API key for Yelp Fusion API
- `OPENAI_API_KEY`: API key for OpenAI API
- `WHITELISTED_CORS_ORIGINS`: Whitelisted CORS origins (e.g. `http://localhost:3000`, `<deployment-url>`)
- `LANGSMITH_API_KEY`: API key for LangSmith API
