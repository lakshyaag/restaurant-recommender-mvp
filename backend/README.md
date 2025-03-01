# Bain Restaurant Recommender Backend

This is the backend API for the Bain Restaurant Recommender application, built with FastAPI and Python.

## Features

- Restaurant search using Yelp Fusion API
- Location-based recommendations
- Filtering by price, categories, open status, etc.
- Detailed restaurant information
- Flexible API supporting multiple view types (list and map)
- Clean architecture with separation of concerns

## Project Structure

```
backend/
├── app/                  # Application core
│   ├── api/              # API routes/endpoints
│   │   ├── health.py     # Health check endpoints
│   │   └── restaurants.py # Restaurant endpoints
│   ├── models/           # Data models
│   │   └── restaurants.py # Pydantic models
│   ├── services/         # Business logic
│   │   └── yelp.py       # Yelp API interaction
│   └── core/             # Core configuration
│       └── config.py     # Environment and app config
├── main.py               # Application entry point
├── requirements.txt      # Dependencies
└── pyproject.toml        # Project metadata
```

## Setup

### Prerequisites

- Python 3.12 or higher
- Yelp API Key (already in .env file)

### Installation

1. Make sure you're in the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies using uv (already set up):

   ```bash
   uv pip install -e .
   ```

### Running the API

Start the FastAPI server:

```bash
python main.py
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- http://localhost:8000/api/docs (Swagger UI)
- http://localhost:8000/api/redoc (ReDoc)

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

## Development

The application is structured with clean architecture principles:

- **API Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic and external API interactions
- **Model Layer**: Defines data structures using Pydantic

## Environment Variables

The application requires the following environment variables in a `.env` file:

- `YELP_API_KEY`: API key for Yelp Fusion API (already set up)
