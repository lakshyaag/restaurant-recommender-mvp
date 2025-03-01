# Bain Restaurant Recommender Backend

This is the backend API for the Bain Restaurant Recommender application, built with FastAPI and Python.

## Features

- Restaurant search using Yelp Fusion API
- Location-based recommendations
- Filtering by price, categories, open status, etc.
- Detailed restaurant information

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

The API will be available at <http://localhost:8000>

## API Documentation

Once the server is running, you can access the interactive API documentation at:

- <http://localhost:8000/docs> (Swagger UI)
- <http://localhost:8000/redoc> (ReDoc)

### Available Endpoints

#### GET /api/health

Health check endpoint to verify the API is running.

#### GET /api/restaurants

Search for restaurants based on the provided parameters.

Query Parameters:

- `location` (required): Location to search for restaurants (e.g., "Toronto")
- `term` (optional, default: "restaurant"): Search term
- `limit` (optional, default: 20): Number of results to return (1-50)
- `offset` (optional, default: 0): Offset for pagination
- `sort_by` (optional, default: "best_match"): Sort by: best_match, rating, review_count, distance
- `price` (optional): Pricing levels to filter by: 1, 2, 3, 4 ($ to $$$$)
- `open_now` (optional, default: false): Filter for businesses that are open now
- `categories` (optional): Categories to filter by (e.g., "italian")

## Development

The application is structured with proper type hints and documentation. The main components are:

- `main.py`: FastAPI application with endpoints
- Models for request/response data validation

## Environment Variables

The application requires the following environment variables in a `.env` file:

- `YELP_API_KEY`: API key for Yelp Fusion API (already set up)
