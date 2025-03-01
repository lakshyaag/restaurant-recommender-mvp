# Bain Restaurant Recommender

A web application that helps Bain partners find restaurants for client meetings. This tool allows users to search for restaurants in different locations and provides detailed information to help make informed decisions.

## Features

- Search for restaurants by location
- View detailed restaurant information including ratings, price ranges, and contact information
- Filter results based on various criteria
- Mobile-responsive design

## Tech Stack

- **Backend**: Python with FastAPI for the API server
- **Frontend**: Next.js with React for the user interface
- **External APIs**: Yelp Fusion API for restaurant data

## Project Structure

```
bain-mvp/
├── backend/           # FastAPI application
│   ├── main.py        # Main API implementation
│   └── ...
├── frontend/          # Next.js application
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   ├── lib/           # Utility functions and hooks
│   └── ...
└── start.sh           # Script to start both servers
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm or yarn
- Yelp API Key (already set up in .env file)

### Installation

1. Clone the repository

   ```bash
   git clone <repo-url>
   cd bain-mvp
   ```

2. Install backend dependencies

   ```bash
   cd backend
   pip install -e .
   cd ..
   ```

3. Install frontend dependencies

   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

You can start both the backend and frontend with one command:

```bash
./start.sh
```

Alternatively, you can run them separately:

**Backend:**

```bash
cd backend
python main.py
```

**Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will be available at: <http://localhost:3000>
The backend API will be available at: <http://localhost:8000>

## API Documentation

Once the backend server is running, you can view the interactive API documentation at:

- <http://localhost:8000/docs> (Swagger UI)
- <http://localhost:8000/redoc> (ReDoc)

## Development Notes

- The backend uses Python 3.12 and FastAPI
- The frontend is built with Next.js and uses React hooks for state management
- The application uses the Yelp Fusion API for restaurant data
